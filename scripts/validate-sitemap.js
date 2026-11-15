#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_CONCURRENCY = 4;
const MAX_REDIRECTS = 5;

const COLORS = process.stdout.isTTY
  ? {
      reset: '\x1b[0m',
      bold: '\x1b[1m',
      dim: '\x1b[2m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      red: '\x1b[31m',
      cyan: '\x1b[36m',
    }
  : {
      reset: '',
      bold: '',
      dim: '',
      green: '',
      yellow: '',
      red: '',
      cyan: '',
    };

function badge(level) {
  if (level === 'PASS') return `${COLORS.green}[PASS]${COLORS.reset}`;
  if (level === 'WARN') return `${COLORS.yellow}[WARN]${COLORS.reset}`;
  if (level === 'FAIL') return `${COLORS.red}[FAIL]${COLORS.reset}`;
  return `${COLORS.cyan}[INFO]${COLORS.reset}`;
}

function printHelp() {
  console.log(`Usage: node scripts/validate-sitemap.js [options]

Options:
  --sitemap <path>       Path to sitemap XML (default: public/sitemap.xml)
  --robots <path>        Path to robots.txt (default: public/robots.txt)
  --domain <origin>      Expected production origin (default: inferred from index.html canonical)
  --base-url <url>       Target HTTP base URL to probe (default: configured production origin)
  --timeout <ms>         HTTP request timeout in ms (default: ${DEFAULT_TIMEOUT_MS})
  --concurrency <n>      Max concurrent HTTP requests (default: ${DEFAULT_CONCURRENCY})
  --skip-http            Skip live HTTP checks (structural, route, and robots checks only)
  --help                 Show this help message
`);
}

function parseCliArgs(argv) {
  const opts = {
    sitemap: 'public/sitemap.xml',
    robots: 'public/robots.txt',
    domain: null,
    baseUrl: null,
    timeout: DEFAULT_TIMEOUT_MS,
    concurrency: DEFAULT_CONCURRENCY,
    skipHttp: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else if (arg === '--skip-http') {
      opts.skipHttp = true;
    } else if (arg === '--sitemap' && argv[i + 1]) {
      opts.sitemap = argv[++i];
    } else if (arg === '--robots' && argv[i + 1]) {
      opts.robots = argv[++i];
    } else if (arg === '--domain' && argv[i + 1]) {
      opts.domain = argv[++i];
    } else if (arg === '--base-url' && argv[i + 1]) {
      opts.baseUrl = argv[++i];
    } else if (arg === '--timeout' && argv[i + 1]) {
      const parsed = Number(argv[++i]);
      if (Number.isFinite(parsed) && parsed > 0) opts.timeout = parsed;
    } else if (arg === '--concurrency' && argv[i + 1]) {
      const parsed = Number(argv[++i]);
      if (Number.isInteger(parsed) && parsed > 0) opts.concurrency = parsed;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown or incomplete CLI option: ${arg}`);
    }
  }

  return opts;
}

function decodeXmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
}

/**
 * Strict, zero-dependency XML parser tailored for sitemaps.
 * Catches mismatched/unclosed tags, stray '<', unescaped '&', unclosed comments,
 * missing <urlset>, and extracts every <url> entry with line numbers.
 */
function parseSitemapXml(xmlContent) {
  const errors = [];
  const warnings = [];

  if (!xmlContent || !xmlContent.trim()) {
    return { entries: [], errors: ['Sitemap XML file is empty.'], warnings };
  }

  if (xmlContent.charCodeAt(0) === 0xfeff) {
    errors.push('Sitemap XML begins with a UTF-8 BOM (0xEF 0xBB 0xBF); save as UTF-8 without BOM.');
  }

  const trimmed = xmlContent.replace(/^\uFEFF/, '');
  if (/^\s+<\?xml/i.test(trimmed)) {
    errors.push('Sitemap XML has leading whitespace before the <?xml?> declaration.');
  }

  // Check for unclosed comments first
  let scanIdx = 0;
  while (true) {
    const commentStart = trimmed.indexOf('<!--', scanIdx);
    if (commentStart === -1) break;
    const commentEnd = trimmed.indexOf('-->', commentStart + 4);
    if (commentEnd === -1) {
      const line = trimmed.slice(0, commentStart).split('\n').length;
      errors.push(`Unclosed XML comment starting at line ${line}.`);
      return { entries: [], errors, warnings };
    }
    scanIdx = commentEnd + 3;
  }

  // Strip comments while preserving newlines for accurate line numbers
  const noComments = trimmed.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '));

  const stack = [];
  let rootElement = null;
  let currentUrlEntry = null;
  const entries = [];

  const tokenRegex = /<([^>]+)>|([^<]+)/g;
  let match;
  let lastIndex = 0;

  while ((match = tokenRegex.exec(noComments)) !== null) {
    if (match.index !== lastIndex) {
      const line = noComments.slice(0, lastIndex).split('\n').length;
      errors.push(`Malformed XML markup near line ${line}.`);
      break;
    }
    lastIndex = tokenRegex.lastIndex;

    const tagRaw = match[1];
    const textRaw = match[2];

    if (textRaw !== undefined) {
      // Validate stray '<' or unescaped '&' inside text nodes
      if (textRaw.includes('<')) {
        const line = noComments.slice(0, match.index).split('\n').length;
        errors.push(`Stray '<' character in text content at line ${line}.`);
        continue;
      }

      const invalidAmp = textRaw.match(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/);
      if (invalidAmp) {
        const line = noComments.slice(0, match.index).split('\n').length;
        errors.push(`Unescaped '&' entity in XML text at line ${line}.`);
      }

      if (stack.length === 0) {
        if (textRaw.trim().length > 0) {
          const line = noComments.slice(0, match.index).split('\n').length;
          errors.push(`Unexpected text outside root XML element at line ${line}: "${textRaw.trim().slice(0, 40)}".`);
        }
        continue;
      }

      const activeTag = stack[stack.length - 1];
      if (currentUrlEntry && activeTag.tag === 'loc') {
        currentUrlEntry.locRaw += textRaw;
      } else if (currentUrlEntry && activeTag.tag === 'lastmod') {
        currentUrlEntry.lastmod += textRaw;
      } else if (currentUrlEntry && activeTag.tag === 'changefreq') {
        currentUrlEntry.changefreq += textRaw;
      } else if (currentUrlEntry && activeTag.tag === 'priority') {
        currentUrlEntry.priority += textRaw;
      }
      continue;
    }

    const line = noComments.slice(0, match.index).split('\n').length;
    const tagContent = tagRaw.trim();

    if (!tagContent) {
      errors.push(`Empty XML tag '<>' at line ${line}.`);
      continue;
    }

    // Processing instruction <?xml ... ?>
    if (tagContent.startsWith('?')) {
      if (!tagContent.endsWith('?')) {
        errors.push(`Unclosed XML processing instruction at line ${line}.`);
      }
      continue;
    }

    // Reject unclosed '<' inside tag attributes
    if (tagContent.includes('<')) {
      errors.push(`Unclosed XML tag missing '>' before line ${line}.`);
      continue;
    }

    const isClosing = tagContent.startsWith('/');
    const isSelfClosing = !isClosing && tagContent.endsWith('/');

    if (isClosing) {
      const tagName = tagContent.slice(1).trim();
      if (!/^[A-Za-z_][\w:.-]*$/.test(tagName)) {
        errors.push(`Invalid closing XML tag '</${tagName}>' at line ${line}.`);
        continue;
      }
      if (stack.length === 0) {
        errors.push(`Unexpected closing tag '</${tagName}>' at line ${line} with no matching opening tag.`);
        continue;
      }
      const top = stack.pop();
      if (top.tag !== tagName) {
        errors.push(
          `Mismatched XML closing tag '</${tagName}>' at line ${line} (expected '</${top.tag}>' opened at line ${top.line}).`
        );
        continue;
      }

      if (tagName === 'url' && currentUrlEntry) {
        if (currentUrlEntry.locCount === 0) {
          errors.push(`<url> block opened at line ${currentUrlEntry.line} is missing a <loc> element.`);
        } else if (currentUrlEntry.locCount > 1) {
          errors.push(`<url> block opened at line ${currentUrlEntry.line} has multiple <loc> elements.`);
        }
        entries.push({
          loc: decodeXmlEntities(currentUrlEntry.locRaw.trim()),
          lastmod: decodeXmlEntities(currentUrlEntry.lastmod.trim()),
          changefreq: decodeXmlEntities(currentUrlEntry.changefreq.trim()),
          priority: decodeXmlEntities(currentUrlEntry.priority.trim()),
          line: currentUrlEntry.line,
        });
        currentUrlEntry = null;
      }
      continue;
    }

    // Opening or self-closing tag
    const cleanTag = isSelfClosing ? tagContent.slice(0, -1).trim() : tagContent;
    const nameMatch = cleanTag.match(/^([A-Za-z_][\w:.-]*)(?:\s+([\s\S]*))?$/);
    if (!nameMatch) {
      errors.push(`Malformed XML opening tag '<${tagContent}>' at line ${line}.`);
      continue;
    }

    const tagName = nameMatch[1];
    const attrsText = (nameMatch[2] || '').trim();
    if (attrsText) {
      // Basic attribute well-formedness validation (key="value" or key='value')
      const stripped = attrsText.replace(/[A-Za-z_][\w:.-]*\s*=\s*(?:"[^"]*"|'[^']*')/g, '').trim();
      if (stripped.length > 0) {
        errors.push(`Malformed XML attributes in <${tagName}> at line ${line}: "${stripped}".`);
      }
    }

    if (stack.length === 0) {
      if (rootElement !== null) {
        errors.push(`Multiple root XML elements detected at line ${line} (<${tagName}> after <${rootElement}>).`);
      }
      rootElement = tagName;
      if (tagName !== 'urlset') {
        if (tagName === 'sitemapindex') {
          warnings.push('Root element is <sitemapindex> rather than <urlset>.');
        } else {
          errors.push(`Unexpected root element <${tagName}> at line ${line} (expected <urlset>).`);
        }
      } else if (!/xmlns\s*=\s*["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/i.test(attrsText)) {
        errors.push(`Root <urlset> at line ${line} is missing required xmlns="http://www.sitemaps.org/schemas/sitemap/0.9".`);
      }
    }

    if (!isSelfClosing) {
      stack.push({ tag: tagName, line });
      if (tagName === 'url') {
        if (currentUrlEntry) {
          errors.push(`Nested <url> tag at line ${line} before previous <url> closed.`);
        }
        currentUrlEntry = {
          line,
          locRaw: '',
          locCount: 0,
          lastmod: '',
          changefreq: '',
          priority: '',
        };
      } else if (tagName === 'loc' && currentUrlEntry) {
        currentUrlEntry.locCount += 1;
      }
    } else if (tagName === 'loc' && currentUrlEntry) {
      currentUrlEntry.locCount += 1;
      errors.push(`Self-closing <loc /> at line ${line} has no URL value.`);
    }
  }

  if (lastIndex < noComments.length) {
    const trailing = noComments.slice(lastIndex);
    const line = noComments.slice(0, lastIndex).split('\n').length;
    errors.push(`Unclosed or truncated XML near line ${line}: "${trailing.trim().slice(0, 60)}".`);
  }

  if (stack.length > 0) {
    for (const unclosed of stack.reverse()) {
      errors.push(`Unclosed XML tag <${unclosed.tag}> opened at line ${unclosed.line}.`);
    }
  }

  if (!rootElement) {
    errors.push('No root XML element found.');
  }

  return { entries, errors, warnings };
}

/**
 * Dynamically inspects project files to identify configured production origin
 * and actual React SPA + pre-rendered routes without hardcoding invented routes.
 */
function discoverProjectContext(rootDir) {
  const indexPath = path.join(rootDir, 'index.html');
  let configuredOrigin = 'https://iam-mjyogananth.pages.dev';
  if (fs.existsSync(indexPath)) {
    const indexHtml = fs.readFileSync(indexPath, 'utf8');
    const canonicalMatch = indexHtml.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    if (canonicalMatch) {
      try {
        configuredOrigin = new URL(canonicalMatch[1]).origin;
      } catch {
        // fallback to default
      }
    }
  }

  // Extract Motion Lab experiment slugs from src/components/motion-playground/detail-data/index.ts
  const motionSlugs = [];
  const motionIndexPath = path.join(
    rootDir,
    'src/components/motion-playground/detail-data/index.ts'
  );
  if (fs.existsSync(motionIndexPath)) {
    const content = fs.readFileSync(motionIndexPath, 'utf8');
    const blockMatch = content.match(/ALL_EXPERIMENT_DETAILS\s*=\s*\{([\s\S]*?)\}/);
    if (blockMatch) {
      const keyRegex = /['"]([a-z0-9-]+)['"]\s*:/gi;
      let m;
      while ((m = keyRegex.exec(blockMatch[1])) !== null) {
        motionSlugs.push(m[1]);
      }
    }
  }

  // Extract utility error routes from src/App.tsx
  const errorRoutes = [];
  const appPath = path.join(rootDir, 'src/App.tsx');
  if (fs.existsSync(appPath)) {
    const appContent = fs.readFileSync(appPath, 'utf8');
    const errCodesMatch = appContent.match(/errorCodes\s*=\s*\[([^\]]+)\]/);
    if (errCodesMatch) {
      const codeRegex = /['"]([a-z0-9-]+)['"]/gi;
      let m;
      while ((m = codeRegex.exec(errCodesMatch[1])) !== null) {
        errorRoutes.push(`/${m[1]}`);
      }
    }
  }

  // Extract project IDs from src/data/portfolioData.ts
  const projectIds = new Set();
  const portfolioDataPath = path.join(rootDir, 'src/data/portfolioData.ts');
  if (fs.existsSync(portfolioDataPath)) {
    const pdContent = fs.readFileSync(portfolioDataPath, 'utf8');
    const projectsStart = pdContent.indexOf('export const PROJECTS');
    if (projectsStart !== -1) {
      const slice = pdContent.slice(projectsStart);
      const idRegex = /^\s*id:\s*['"]([a-z0-9-]+)['"]/gm;
      let m;
      while ((m = idRegex.exec(slice)) !== null) {
        projectIds.add(m[1]);
      }
    }
  }

  const validIndexablePaths = new Set(['/']);
  for (const slug of motionSlugs) {
    validIndexablePaths.add(`/motion-lab/${slug}`);
  }

  return {
    configuredOrigin,
    validIndexablePaths,
    errorRoutes: new Set(errorRoutes),
    projectIds,
    motionSlugs,
  };
}

function parseRobotsTxt(content) {
  const lines = content.split(/\r?\n/);
  const groups = [];
  const sitemaps = [];
  let currentGroup = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const directive = line.slice(0, colonIdx).trim().toLowerCase();
    const value = line.slice(colonIdx + 1).trim();

    if (directive === 'user-agent') {
      if (!currentGroup || currentGroup.rules.length > 0) {
        currentGroup = { agents: [], rules: [] };
        groups.push(currentGroup);
      }
      currentGroup.agents.push(value.toLowerCase());
    } else if ((directive === 'disallow' || directive === 'allow') && currentGroup) {
      if (value !== '') {
        currentGroup.rules.push({ type: directive, pattern: value });
      }
    } else if (directive === 'sitemap') {
      sitemaps.push(value);
    }
  }

  return { groups, sitemaps };
}

function matchesRobotsPattern(pathWithQuery, pattern) {
  let regexStr = '^';
  const hasEndAnchor = pattern.endsWith('$');
  const body = hasEndAnchor ? pattern.slice(0, -1) : pattern;
  for (const ch of body) {
    if (ch === '*') regexStr += '.*';
    else regexStr += ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  if (hasEndAnchor) regexStr += '$';
  return new RegExp(regexStr).test(pathWithQuery);
}

function evaluateRobotsForPath(parsedRobots, pathWithQuery, userAgent = 'googlebot') {
  const targetGroups = parsedRobots.groups.filter((g) => g.agents.includes(userAgent.toLowerCase()));
  const wildcardGroups = parsedRobots.groups.filter((g) => g.agents.includes('*'));
  const applicable = targetGroups.length > 0 ? targetGroups : wildcardGroups;

  let bestMatch = null;
  for (const group of applicable) {
    for (const rule of group.rules) {
      if (matchesRobotsPattern(pathWithQuery, rule.pattern)) {
        if (
          !bestMatch ||
          rule.pattern.length > bestMatch.pattern.length ||
          (rule.pattern.length === bestMatch.pattern.length && rule.type === 'allow')
        ) {
          bestMatch = rule;
        }
      }
    }
  }

  return {
    blocked: bestMatch ? bestMatch.type === 'disallow' : false,
    matchedRule: bestMatch,
  };
}

function extractHtmlSeoSignals(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const canonicalMatch =
    html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/i) ||
    html.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']canonical["'][^>]*>/i);
  const robotsMetaMatch =
    html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["']([^"']+)["'][^>]*>/i) ||
    html.match(/<meta\b[^>]*\bcontent=["']([^"']+)["'][^>]*\bname=["']robots["'][^>]*>/i);

  const normalizedFingerprint = html
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 4000);

  return {
    title: titleMatch ? decodeXmlEntities(titleMatch[1].trim()) : null,
    canonical: canonicalMatch ? canonicalMatch[1].trim() : null,
    robotsMeta: robotsMetaMatch ? robotsMetaMatch[1].trim().toLowerCase() : null,
    isHtml: /<!doctype\s+html|<html\b/i.test(html),
    hasRootDiv: /<div\s+id=["']root["']\s*>/i.test(html),
    fingerprint: normalizedFingerprint,
  };
}

async function fetchWithRedirects(url, timeoutMs) {
  const chain = [];
  let currentUrl = url;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetch(currentUrl, {
      method: 'GET',
      redirect: 'manual',
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        'User-Agent': 'Portfolio-Sitemap-Validator/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    chain.push({ url: currentUrl, status: res.status });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) {
        return {
          ok: false,
          initialStatus: chain[0].status,
          finalStatus: res.status,
          finalUrl: currentUrl,
          chain,
          contentType: res.headers.get('content-type') || '',
          body: '',
          error: `Redirect ${res.status} without Location header`,
        };
      }
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    const contentType = res.headers.get('content-type') || '';
    const body = contentType.includes('text/html') || contentType.includes('xml') || contentType.includes('text/')
      ? await res.text()
      : '';

    return {
      ok: res.status >= 200 && res.status < 300,
      initialStatus: chain[0].status,
      finalStatus: res.status,
      finalUrl: currentUrl,
      chain,
      contentType,
      body,
      error: null,
    };
  }

  return {
    ok: false,
    initialStatus: chain[0]?.status ?? 0,
    finalStatus: chain[chain.length - 1]?.status ?? 0,
    finalUrl: currentUrl,
    chain,
    contentType: '',
    body: '',
    error: `Exceeded maximum redirects (${MAX_REDIRECTS})`,
  };
}

async function runPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIdx = 0;

  async function runWorker() {
    while (nextIdx < items.length) {
      const idx = nextIdx++;
      results[idx] = await worker(items[idx], idx);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker());
  await Promise.all(workers);
  return results;
}

function normalizeUrlForComparison(rawUrl) {
  try {
    const u = new URL(rawUrl);
    u.hash = '';
    if (u.pathname.length > 1 && u.pathname.endsWith('/')) {
      u.pathname = u.pathname.slice(0, -1);
    }
    return u.toString();
  } catch {
    return rawUrl.trim();
  }
}

async function main() {
  let opts;
  try {
    opts = parseCliArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`${badge('FAIL')} ${err.message}`);
    printHelp();
    process.exit(1);
  }

  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  const rootDir = process.cwd();
  const projectCtx = discoverProjectContext(rootDir);
  const expectedOrigin = opts.domain
    ? new URL(opts.domain).origin
    : projectCtx.configuredOrigin;
  const targetBaseUrl = (opts.baseUrl ? new URL(opts.baseUrl).origin : expectedOrigin).replace(/\/$/, '');
  const isLocalTarget =
    targetBaseUrl.includes('localhost') ||
    targetBaseUrl.includes('127.0.0.1') ||
    targetBaseUrl.includes('0.0.0.0');

  console.log(`${COLORS.bold}=== Portfolio Sitemap Validator ===${COLORS.reset}`);
  console.log(`${badge('INFO')} Sitemap file:       ${opts.sitemap}`);
  console.log(`${badge('INFO')} Robots file:        ${opts.robots}`);
  console.log(`${badge('INFO')} Production origin:  ${expectedOrigin}`);
  console.log(`${badge('INFO')} HTTP probe target:  ${opts.skipHttp ? '(skipped)' : targetBaseUrl}`);
  console.log(
    `${badge('INFO')} Discovered routes:  ${[...projectCtx.validIndexablePaths].join(', ')}`
  );
  console.log('');

  let failCount = 0;
  let warnCount = 0;
  let passCount = 0;

  const record = (level, msg) => {
    if (level === 'FAIL') failCount++;
    else if (level === 'WARN') warnCount++;
    else if (level === 'PASS') passCount++;
    console.log(`${badge(level)} ${msg}`);
  };

  // 1. Read & parse sitemap.xml
  const sitemapPath = path.resolve(rootDir, opts.sitemap);
  if (!fs.existsSync(sitemapPath)) {
    record('FAIL', `Sitemap file not found at ${sitemapPath}`);
    process.exit(1);
  }

  const sitemapRaw = fs.readFileSync(sitemapPath, 'utf8');
  const parsedXml = parseSitemapXml(sitemapRaw);

  for (const w of parsedXml.warnings) {
    record('WARN', `XML warning: ${w}`);
  }
  if (parsedXml.errors.length > 0) {
    for (const err of parsedXml.errors) {
      record('FAIL', `XML parse error: ${err}`);
    }
    console.log(`\nSummary: ${passCount} PASS, ${warnCount} WARN, ${failCount} FAIL`);
    process.exit(1);
  }

  if (parsedXml.entries.length === 0) {
    record('FAIL', 'Sitemap parsed cleanly but contains 0 <url> entries.');
    console.log(`\nSummary: ${passCount} PASS, ${warnCount} WARN, ${failCount} FAIL`);
    process.exit(1);
  }

  record('PASS', `XML well-formed: extracted ${parsedXml.entries.length} <url> entries.`);

  // 2. Read & parse robots.txt
  const robotsPath = path.resolve(rootDir, opts.robots);
  let parsedRobots = null;
  if (fs.existsSync(robotsPath)) {
    const robotsRaw = fs.readFileSync(robotsPath, 'utf8');
    parsedRobots = parseRobotsTxt(robotsRaw);
    const expectedSitemapLoc = `${expectedOrigin}/sitemap.xml`;
    if (parsedRobots.sitemaps.includes(expectedSitemapLoc)) {
      record('PASS', `robots.txt declares Sitemap: ${expectedSitemapLoc}`);
    } else if (parsedRobots.sitemaps.length > 0) {
      record(
        'WARN',
        `robots.txt declares Sitemap (${parsedRobots.sitemaps.join(', ')}) which does not match ${expectedSitemapLoc}`
      );
    } else {
      record('WARN', `robots.txt does not declare a Sitemap directive for ${expectedSitemapLoc}`);
    }

    const sitemapRobotsEval = evaluateRobotsForPath(parsedRobots, '/sitemap.xml', 'googlebot');
    if (sitemapRobotsEval.blocked) {
      record(
        'FAIL',
        `robots.txt blocks Googlebot from /sitemap.xml (${sitemapRobotsEval.matchedRule.type}: ${sitemapRobotsEval.matchedRule.pattern}).`
      );
    } else {
      record('PASS', 'robots.txt permits Googlebot access to /sitemap.xml.');
    }
  } else {
    record('WARN', `robots.txt not found at ${robotsPath}; skipping crawl-block verification.`);
  }

  // 3. Structural, domain, duplicate, robots, and route-definition validation
  const seenExact = new Map();
  const seenNormalized = new Map();
  const validProbeTargets = [];

  for (const entry of parsedXml.entries) {
    const loc = entry.loc;
    if (!loc) {
      record('FAIL', `Line ${entry.line}: Empty <loc> tag.`);
      continue;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(loc);
    } catch {
      record('FAIL', `Line ${entry.line}: Invalid URL "${loc}".`);
      continue;
    }

    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      record('FAIL', `Line ${entry.line}: Unsupported protocol "${parsedUrl.protocol}" in "${loc}".`);
      continue;
    }

    if (parsedUrl.protocol !== 'https:') {
      record('WARN', `Line ${entry.line}: Non-HTTPS URL in sitemap: ${loc}`);
    }

    if (parsedUrl.origin !== expectedOrigin) {
      record(
        'FAIL',
        `Line ${entry.line}: Domain mismatch — "${loc}" does not belong to configured production origin "${expectedOrigin}".`
      );
    }

    if (parsedUrl.hash) {
      record('FAIL', `Line ${entry.line}: Sitemap URL must not contain fragment "${parsedUrl.hash}": ${loc}`);
    }

    // Duplicate detection
    if (seenExact.has(loc)) {
      record('FAIL', `Line ${entry.line}: Duplicate exact URL "${loc}" (first seen at line ${seenExact.get(loc)}).`);
    } else {
      seenExact.set(loc, entry.line);
    }

    const norm = normalizeUrlForComparison(loc);
    if (seenNormalized.has(norm) && seenNormalized.get(norm) !== loc) {
      record(
        'WARN',
        `Line ${entry.line}: Near-duplicate normalized URL "${loc}" conflicts with "${seenNormalized.get(norm)}".`
      );
    } else {
      seenNormalized.set(norm, loc);
    }

    // Optional metadata validation
    if (entry.lastmod && !/^\d{4}-\d{2}-\d{2}(?:T.+)?$/.test(entry.lastmod)) {
      record('WARN', `Line ${entry.line}: Unusual <lastmod> format "${entry.lastmod}" on ${loc}`);
    }
    if (entry.priority) {
      const p = Number(entry.priority);
      if (!Number.isFinite(p) || p < 0 || p > 1) {
        record('WARN', `Line ${entry.line}: Invalid <priority> "${entry.priority}" (must be 0.0–1.0) on ${loc}`);
      }
    }

    // Route definition checks against project router
    const cleanPath =
      parsedUrl.pathname.length > 1 && parsedUrl.pathname.endsWith('/')
        ? parsedUrl.pathname.slice(0, -1)
        : parsedUrl.pathname;

    if (projectCtx.errorRoutes.has(cleanPath.toLowerCase()) || cleanPath.toLowerCase().startsWith('/error/')) {
      record('FAIL', `Line ${entry.line}: Utility error route "${cleanPath}" must not be listed in sitemap.xml.`);
    } else if (parsedUrl.searchParams.has('project')) {
      const pid = parsedUrl.searchParams.get('project');
      const known = projectCtx.projectIds.has(pid);
      record(
        'FAIL',
        `Line ${entry.line}: Modal query URL "${loc}" (${known ? 'valid project modal ID' : 'unknown project ID'}) is not a standalone indexable route.`
      );
    } else if (!projectCtx.validIndexablePaths.has(cleanPath)) {
      record(
        'FAIL',
        `Line ${entry.line}: Route "${cleanPath}" does not match any defined indexable route in the project.`
      );
    }

    // robots.txt check
    if (parsedRobots) {
      const pathWithQuery = `${parsedUrl.pathname}${parsedUrl.search}`;
      const evalStar = evaluateRobotsForPath(parsedRobots, pathWithQuery, '*');
      const evalGoogle = evaluateRobotsForPath(parsedRobots, pathWithQuery, 'googlebot');
      if (evalStar.blocked || evalGoogle.blocked) {
        const rule = evalGoogle.blocked ? evalGoogle.matchedRule : evalStar.matchedRule;
        record(
          'FAIL',
          `Line ${entry.line}: Blocked by robots.txt (${rule.type}: ${rule.pattern}) -> ${loc}`
        );
      }
    }

    validProbeTargets.push({
      loc,
      parsedUrl,
      cleanPath,
      line: entry.line,
    });
  }

  // 4. Live HTTP accessibility, canonical consistency, and SPA fallback detection
  if (!opts.skipHttp && validProbeTargets.length > 0) {
    console.log('');
    console.log(`${COLORS.bold}--- HTTP Accessibility, Canonical & SPA Fallback Checks ---${COLORS.reset}`);

    // Probe /sitemap.xml directly as Googlebot to verify HTTP 200, XML Content-Type, and zero challenges/redirects
    const sitemapHttpUrl = `${targetBaseUrl}/sitemap.xml`;
    try {
      const smRes = await fetch(sitemapHttpUrl, {
        method: 'GET',
        redirect: 'manual',
        signal: AbortSignal.timeout(opts.timeout),
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          Accept: 'application/xml,text/xml;q=0.9,*/*;q=0.8',
        },
      });
      const smCt = (smRes.headers.get('content-type') || '').toLowerCase();
      const smBody = await smRes.text();
      const isXmlCt = smCt.includes('application/xml') || smCt.includes('text/xml');

      if (smRes.status !== 200) {
        record('FAIL', `${sitemapHttpUrl} returned HTTP ${smRes.status} (expected HTTP 200 without redirects).`);
      } else if (!isXmlCt) {
        record('FAIL', `${sitemapHttpUrl} returned unexpected Content-Type "${smCt}" (expected application/xml or text/xml).`);
      } else if (/<html\b/i.test(smBody) || !/<urlset\b/i.test(smBody)) {
        record('FAIL', `${sitemapHttpUrl} did not return a valid XML <urlset> body (possible challenge or SPA fallback).`);
      } else {
        record('PASS', `${sitemapHttpUrl} (Googlebot UA) -> HTTP 200 | Content-Type=${smCt}`);
      }
    } catch (err) {
      record(
        'FAIL',
        `Failed to fetch ${sitemapHttpUrl}: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    // Probe a guaranteed non-existent route to fingerprint SPA fallback behavior
    const probePath = '/__sitemap_invalid_route_probe__';
    const probeUrl = `${targetBaseUrl}${probePath}`;
    let spaFallbackFingerprint = null;

    try {
      const probeRes = await fetchWithRedirects(probeUrl, opts.timeout);
      if (probeRes.finalStatus === 200) {
        const signals = extractHtmlSeoSignals(probeRes.body);
        if (signals.isHtml) {
          spaFallbackFingerprint = signals;
          record(
            'INFO',
            `SPA fallback detected: invalid probe "${probePath}" returned HTTP 200 with shell canonical "${signals.canonical || '(none)'}" and title "${signals.title || '(none)'}".`
          );
        }
      } else {
        record('INFO', `Server returned HTTP ${probeRes.finalStatus} for invalid route probe "${probePath}".`);
      }
    } catch (err) {
      record(
        'WARN',
        `SPA fallback probe failed against ${probeUrl}: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    const probeResults = await runPool(validProbeTargets, opts.concurrency, async (item) => {
      const targetUrl = `${targetBaseUrl}${item.parsedUrl.pathname}${item.parsedUrl.search}`;
      try {
        const res = await fetchWithRedirects(targetUrl, opts.timeout);
        return { item, targetUrl, res, error: null };
      } catch (err) {
        return {
          item,
          targetUrl,
          res: null,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    });

    for (const { item, targetUrl, res, error } of probeResults) {
      if (error || !res) {
        record('FAIL', `${item.loc} -> Network/timeout error probing ${targetUrl}: ${error}`);
        continue;
      }

      if (res.error) {
        record('FAIL', `${item.loc} -> HTTP ${res.finalStatus} (${res.error}) at ${targetUrl}`);
        continue;
      }

      const redirectCount = res.chain.length - 1;
      if (redirectCount > 0) {
        const hopSummary = res.chain.map((h) => `${h.status} ${h.url}`).join(' -> ');
        record('WARN', `${item.loc} -> Redirected (${hopSummary})`);
      }

      if (res.finalStatus < 200 || res.finalStatus >= 300) {
        record('FAIL', `${item.loc} -> Inaccessible HTTP status ${res.finalStatus} at ${targetUrl}`);
        continue;
      }

      const signals = extractHtmlSeoSignals(res.body);
      if (!signals.isHtml) {
        record('FAIL', `${item.loc} -> Unexpected non-HTML response (${res.contentType || 'unknown'}).`);
        continue;
      }

      if (signals.robotsMeta && signals.robotsMeta.includes('noindex')) {
        record('FAIL', `${item.loc} -> Page contains meta robots "${signals.robotsMeta}" (conflicts with sitemap).`);
        continue;
      }

      const isNonRootRoute = item.cleanPath !== '/';
      const routeDefined = projectCtx.validIndexablePaths.has(item.cleanPath);
      const matchesSpaFallbackShell =
        spaFallbackFingerprint !== null &&
        signals.fingerprint === spaFallbackFingerprint.fingerprint;

      // Distinguish genuine pages from SPA fallback HTTP 200 shells
      if (isNonRootRoute && matchesSpaFallbackShell) {
        if (!routeDefined) {
          record(
            'FAIL',
            `${item.loc} -> HTTP 200 SPA fallback for non-existent route (serves generic root shell "${signals.canonical || '/'}").`
          );
        } else if (isLocalTarget) {
          record(
            'WARN',
            `${item.loc} -> HTTP 200 served generic root SPA shell (expected in Vite dev mode; pre-rendered dist/ HTML provides self-referencing canonical).`
          );
        } else {
          record(
            'FAIL',
            `${item.loc} -> HTTP 200 returned generic root SPA fallback shell (pre-JS canonical "${signals.canonical || '(none)'}" points to "/" instead of "${item.loc}").`
          );
        }
        continue;
      }

      if (!signals.canonical) {
        record('WARN', `${item.loc} -> HTTP ${res.finalStatus} missing <link rel="canonical"> in HTML response.`);
      } else {
        const normCanonical = normalizeUrlForComparison(signals.canonical);
        const normLoc = normalizeUrlForComparison(item.loc);
        if (normCanonical !== normLoc) {
          if (isNonRootRoute && isLocalTarget && normCanonical === normalizeUrlForComparison(expectedOrigin)) {
            record(
              'WARN',
              `${item.loc} -> HTTP ${res.finalStatus} pre-JS canonical is "${signals.canonical}" (Vite dev SPA shell; verify against production/dist build).`
            );
          } else {
            record(
              'FAIL',
              `${item.loc} -> Canonical mismatch: HTML canonical is "${signals.canonical}", expected "${item.loc}".`
            );
          }
          continue;
        }
      }

      record(
        'PASS',
        `${item.loc} -> HTTP ${res.finalStatus} | canonical=${signals.canonical} | title="${signals.title || ''}"`
      );
    }
  }

  console.log('');
  console.log(
    `${COLORS.bold}Summary:${COLORS.reset} ${passCount} PASS, ${warnCount} WARN, ${failCount} FAIL`
  );

  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`${badge('FAIL')} Unhandled validator error: ${err instanceof Error ? err.stack || err.message : String(err)}`);
  process.exit(1);
});
