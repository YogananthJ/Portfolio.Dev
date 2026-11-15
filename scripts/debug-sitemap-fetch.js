#!/usr/bin/env node

/**
 * Diagnostic utility to probe a live sitemap URL with HEAD (tracking the full
 * redirect chain and complete HTTP headers), extract security / CDN headers,
 * inspect for bot-challenge response bodies, and verify a clean HTTP 200 status.
 */

const DEFAULT_SITEMAP_URL = 'https://iam-mjyogananth.pages.dev/sitemap.xml';
const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const DEFAULT_TIMEOUT_MS = 10000;
const MAX_REDIRECTS = 10;

const SECURITY_AND_EDGE_HEADER_NAMES = new Set([
  'server',
  'cf-ray',
  'cf-mitigated',
  'cf-cache-status',
  'cf-chl-out',
  'cf-chl-bypass',
  'x-robots-tag',
  'x-content-type-options',
  'x-frame-options',
  'x-xss-protection',
  'strict-transport-security',
  'content-security-policy',
  'content-security-policy-report-only',
  'referrer-policy',
  'permissions-policy',
  'cross-origin-opener-policy',
  'cross-origin-embedder-policy',
  'cross-origin-resource-policy',
  'access-control-allow-origin',
  'www-authenticate',
  'set-cookie',
  'retry-after',
]);

const BOT_CHALLENGE_PATTERNS = [
  { name: 'Cloudflare cf-mitigated challenge', test: (_body, headers) => /challenge/i.test(headers['cf-mitigated'] || '') },
  { name: 'Cloudflare JS Challenge ("Just a moment...")', test: (body) => /<title>\s*Just a moment\.\.\.\s*<\/title>/i.test(body) },
  { name: 'Cloudflare Challenge Platform script', test: (body) => /\/cdn-cgi\/challenge-platform\//i.test(body) || /_cf_chl_opt/i.test(body) },
  { name: 'Cloudflare Block / Attention Required', test: (body) => /Attention Required!\s*\|\s*Cloudflare/i.test(body) || /Sorry, you have been blocked/i.test(body) },
  { name: 'JavaScript/Cookie Gate', test: (body) => /Enable JavaScript and cookies to continue/i.test(body) },
  { name: 'CAPTCHA Widget (reCAPTCHA / hCaptcha / Turnstile)', test: (body) => /g-recaptcha|h-captcha|cf-turnstile/i.test(body) },
  { name: 'HTML document returned instead of XML', test: (body) => /^\s*(?:<!doctype\s+html|<html\b)/i.test(body) },
];

function printHelp() {
  console.log(`Usage: node scripts/debug-sitemap-fetch.js [options] [url]

Options:
  --url <url>           Target sitemap URL (default: ${DEFAULT_SITEMAP_URL})
  --user-agent <ua>     User-Agent header (default: Googlebot)
  --timeout <ms>        Request timeout in ms (default: ${DEFAULT_TIMEOUT_MS})
  --help, -h            Show this help message
`);
}

function parseArgs(argv) {
  const opts = {
    url: DEFAULT_SITEMAP_URL,
    userAgent: DEFAULT_USER_AGENT,
    timeout: DEFAULT_TIMEOUT_MS,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else if (arg === '--url' && argv[i + 1]) {
      opts.url = argv[++i];
    } else if (arg === '--user-agent' && argv[i + 1]) {
      opts.userAgent = argv[++i];
    } else if (arg === '--timeout' && argv[i + 1]) {
      const n = Number(argv[++i]);
      if (Number.isFinite(n) && n > 0) opts.timeout = n;
    } else if (!arg.startsWith('--')) {
      opts.url = arg;
    } else {
      throw new Error(`Unknown or incomplete option: ${arg}`);
    }
  }

  // Validate URL syntax
  new URL(opts.url);
  return opts;
}

function headersToObject(headers) {
  const out = {};
  for (const [k, v] of headers.entries()) {
    out[k.toLowerCase()] = v;
  }
  return out;
}

function extractSecurityHeaders(headersObj) {
  const extracted = {};
  for (const [k, v] of Object.entries(headersObj)) {
    if (SECURITY_AND_EDGE_HEADER_NAMES.has(k)) {
      extracted[k] = v;
    }
  }
  return extracted;
}

function detectChallenges(body, headersObj) {
  const matches = [];
  for (const rule of BOT_CHALLENGE_PATTERNS) {
    if (rule.test(body || '', headersObj || {})) {
      matches.push(rule.name);
    }
  }
  return matches;
}

async function traceHeadRequests(startUrl, userAgent, timeoutMs) {
  const chain = [];
  let currentUrl = startUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const startedAt = Date.now();
    const res = await fetch(currentUrl, {
      method: 'HEAD',
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        'User-Agent': userAgent,
        Accept: 'application/xml,text/xml;q=0.9,*/*;q=0.8',
      },
    });
    const elapsedMs = Date.now() - startedAt;
    const headersObj = headersToObject(res.headers);
    const headBody = await res.text().catch(() => '');

    chain.push({
      hop: hop + 1,
      url: currentUrl,
      status: res.status,
      statusText: res.statusText,
      elapsedMs,
      headers: headersObj,
      securityHeaders: extractSecurityHeaders(headersObj),
      headBody,
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) {
        return {
          chain,
          error: `HTTP ${res.status} redirect returned without Location header`,
        };
      }
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    return { chain, error: null };
  }

  return {
    chain,
    error: `Exceeded maximum redirect limit (${MAX_REDIRECTS})`,
  };
}

async function inspectBodyViaGet(finalUrl, userAgent, timeoutMs) {
  const startedAt = Date.now();
  const res = await fetch(finalUrl, {
    method: 'GET',
    redirect: 'manual',
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      'User-Agent': userAgent,
      Accept: 'application/xml,text/xml;q=0.9,*/*;q=0.8',
    },
  });
  const elapsedMs = Date.now() - startedAt;
  const headersObj = headersToObject(res.headers);
  const body = await res.text();
  const challenges = detectChallenges(body, headersObj);

  return {
    url: finalUrl,
    status: res.status,
    statusText: res.statusText,
    elapsedMs,
    headers: headersObj,
    securityHeaders: extractSecurityHeaders(headersObj),
    bodyLength: Buffer.byteLength(body, 'utf8'),
    hasXmlDeclaration: /^\s*<\?xml\b/i.test(body),
    hasUrlset: /<urlset\b/i.test(body),
    hasSitemapIndex: /<sitemapindex\b/i.test(body),
    challenges,
    bodySnippet: body.slice(0, 600),
  };
}

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`[FAIL] ${err instanceof Error ? err.message : String(err)}`);
    printHelp();
    process.exit(1);
  }

  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  console.log('=== Sitemap Fetch Debugger (HEAD + Challenge Inspection) ===');
  console.log(`Target URL:  ${opts.url}`);
  console.log(`User-Agent:  ${opts.userAgent}`);
  console.log(`Timeout:     ${opts.timeout}ms`);
  console.log('');

  let trace;
  try {
    trace = await traceHeadRequests(opts.url, opts.userAgent, opts.timeout);
  } catch (err) {
    console.error(`[FAIL] HEAD request failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }

  console.log('--- Redirect Chain (HEAD) ---');
  for (const step of trace.chain) {
    const locNote = step.headers.location ? ` -> Location: ${step.headers.location}` : '';
    console.log(
      `  [${step.hop}] HTTP ${step.status} ${step.statusText || ''} (${step.elapsedMs}ms) ${step.url}${locNote}`
    );
  }
  if (trace.error) {
    console.error(`  [ERROR] ${trace.error}`);
  }
  console.log('');

  const finalHead = trace.chain[trace.chain.length - 1];

  console.log('--- Complete HTTP Response Headers (Final HEAD Response) ---');
  for (const [name, value] of Object.entries(finalHead.headers).sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`  ${name}: ${value}`);
  }
  console.log('');

  console.log('--- Security, Edge & Bot-Protection Headers ---');
  const secEntries = Object.entries(finalHead.securityHeaders).sort(([a], [b]) => a.localeCompare(b));
  if (secEntries.length === 0) {
    console.log('  (none)');
  } else {
    for (const [name, value] of secEntries) {
      console.log(`  ${name}: ${value}`);
    }
  }
  console.log('');

  if (finalHead.headBody && finalHead.headBody.trim().length > 0) {
    console.log('--- Unexpected HEAD Response Body ---');
    console.log(finalHead.headBody.slice(0, 600));
    console.log('');
  }

  // HTTP HEAD does not transmit a body, so run a diagnostic GET on the final URL
  // to inspect for bot-challenge interstitials or non-XML responses.
  let getDiag = null;
  console.log('--- Bot-Challenge & Payload Body Inspection (Diagnostic GET) ---');
  try {
    getDiag = await inspectBodyViaGet(finalHead.url, opts.userAgent, opts.timeout);
    console.log(
      `  GET Status: HTTP ${getDiag.status} (${getDiag.elapsedMs}ms) | Content-Type: ${getDiag.headers['content-type'] || '(none)'} | Bytes: ${getDiag.bodyLength}`
    );
    console.log(
      `  XML Signals: xmlDecl=${getDiag.hasXmlDeclaration} urlset=${getDiag.hasUrlset} sitemapindex=${getDiag.hasSitemapIndex}`
    );

    if (getDiag.challenges.length > 0) {
      console.log(`  Bot-Challenge / Interstitial Detected: ${getDiag.challenges.join('; ')}`);
      console.log('  Response Body Snippet:');
      console.log(getDiag.bodySnippet);
    } else {
      console.log('  Bot-Challenge Check: None detected (clean XML sitemap payload).');
    }
  } catch (err) {
    console.error(
      `  [FAIL] Diagnostic GET failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
  console.log('');

  const isHead200 = finalHead.status === 200 && !trace.error;
  const contentType = (finalHead.headers['content-type'] || '').toLowerCase();
  const isXmlContentType = contentType.includes('application/xml') || contentType.includes('text/xml');
  const hasChallenges =
    detectChallenges(finalHead.headBody, finalHead.headers).length > 0 ||
    (getDiag ? getDiag.challenges.length > 0 : false);

  console.log('--- Final Check ---');
  console.log(`  HEAD returns 200:      ${isHead200 ? 'PASS (HTTP 200)' : `FAIL (HTTP ${finalHead.status})`}`);
  console.log(`  Redirect hops:         ${trace.chain.length - 1}`);
  console.log(`  XML Content-Type:      ${isXmlContentType ? `PASS (${contentType})` : `WARN (${contentType || '(none)'})`}`);
  console.log(`  Bot-challenge signals: ${hasChallenges ? 'FAIL (detected)' : 'PASS (none)'}`);

  if (!isHead200 || hasChallenges) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`[FAIL] Unhandled error: ${err instanceof Error ? err.stack || err.message : String(err)}`);
  process.exit(1);
});
