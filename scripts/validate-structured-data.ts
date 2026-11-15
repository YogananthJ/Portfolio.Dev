import fs from 'node:fs';
import path from 'node:path';

interface JsonLdNode {
  '@type'?: string | string[];
  '@id'?: string;
  [key: string]: unknown;
}

const ROOT_DIR = process.cwd();

function collectSourceFiles(dir: string, exts: Set<string>, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(fullPath, exts, out);
    } else if (exts.has(path.extname(entry.name))) {
      out.push(fullPath);
    }
  }
  return out;
}

function assert(condition: unknown, message: string, errors: string[]): void {
  if (!condition) {
    errors.push(message);
  }
}

function isNonEmptyString(val: unknown): val is string {
  return typeof val === 'string' && val.trim().length > 0;
}

function isValidHttpUrl(val: unknown): boolean {
  if (!isNonEmptyString(val)) return false;
  try {
    const parsed = new URL(val);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function hasType(node: JsonLdNode, expectedType: string): boolean {
  const t = node['@type'];
  if (Array.isArray(t)) return t.includes(expectedType);
  return t === expectedType;
}

function validateHtmlStructuredData(htmlPath: string, errors: string[]): void {
  const relPath = path.relative(ROOT_DIR, htmlPath);
  const html = fs.readFileSync(htmlPath, 'utf8');

  const canonicalMatch =
    html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/i) ||
    html.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']canonical["'][^>]*>/i);

  assert(Boolean(canonicalMatch?.[1]), `${relPath}: Missing <link rel="canonical"> tag.`, errors);

  let canonicalOrigin = '';
  if (canonicalMatch?.[1]) {
    try {
      canonicalOrigin = new URL(canonicalMatch[1]).origin;
    } catch {
      errors.push(`${relPath}: Invalid canonical URL "${canonicalMatch[1]}".`);
    }
  }

  const ldScripts = [
    ...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ];
  assert(
    ldScripts.length === 1,
    `${relPath}: Expected exactly 1 <script type="application/ld+json"> tag, found ${ldScripts.length}.`,
    errors
  );
  if (ldScripts.length === 0) return;

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(ldScripts[0][1]) as Record<string, unknown>;
  } catch (err) {
    errors.push(
      `${relPath}: Invalid JSON-LD syntax (${err instanceof Error ? err.message : String(err)}).`
    );
    return;
  }

  assert(
    parsed['@context'] === 'https://schema.org',
    `${relPath}: JSON-LD @context must be "https://schema.org".`,
    errors
  );

  const graph = Array.isArray(parsed['@graph']) ? (parsed['@graph'] as JsonLdNode[]) : [];
  assert(graph.length > 0, `${relPath}: JSON-LD @graph must be a non-empty array.`, errors);
  if (graph.length === 0) return;

  // Check unique @ids
  const nodesById = new Map<string, JsonLdNode>();
  for (let i = 0; i < graph.length; i++) {
    const node = graph[i];
    const id = node['@id'];
    assert(isNonEmptyString(id), `${relPath}: @graph[${i}] is missing a non-empty @id.`, errors);
    if (isNonEmptyString(id)) {
      if (nodesById.has(id)) {
        errors.push(`${relPath}: Duplicate JSON-LD @id "${id}".`);
      } else {
        nodesById.set(id, node);
      }
      if (canonicalOrigin && isValidHttpUrl(id)) {
        const idOrigin = new URL(id).origin;
        assert(
          idOrigin === canonicalOrigin,
          `${relPath}: Entity @id origin "${idOrigin}" mismatches canonical origin "${canonicalOrigin}".`,
          errors
        );
      }
    }
  }

  const websites = graph.filter((n) => hasType(n, 'WebSite'));
  const persons = graph.filter((n) => hasType(n, 'Person'));
  const profilePages = graph.filter((n) => hasType(n, 'ProfilePage'));

  assert(
    websites.length === 1,
    `${relPath}: Expected exactly 1 WebSite entity in @graph, found ${websites.length}.`,
    errors
  );
  assert(
    persons.length === 1,
    `${relPath}: Expected exactly 1 Person entity in @graph, found ${persons.length}.`,
    errors
  );
  assert(
    profilePages.length === 1,
    `${relPath}: Expected exactly 1 ProfilePage entity in @graph, found ${profilePages.length}.`,
    errors
  );

  const website = websites[0];
  const person = persons[0];
  const profilePage = profilePages[0];

  const ogSiteNameMatch =
    html.match(/<meta\b[^>]*\bproperty=["']og:site_name["'][^>]*\bcontent=["']([^"']+)["'][^>]*>/i) ||
    html.match(/<meta\b[^>]*\bcontent=["']([^"']+)["'][^>]*\bproperty=["']og:site_name["'][^>]*>/i);
  assert(Boolean(ogSiteNameMatch?.[1]), `${relPath}: Missing <meta property="og:site_name"> tag.`, errors);

  if (website) {
    assert(isNonEmptyString(website.name), `${relPath}: WebSite entity is missing valid "name".`, errors);
    assert(isValidHttpUrl(website.url), `${relPath}: WebSite entity "url" must be an absolute URL.`, errors);
    if (canonicalMatch?.[1] && isValidHttpUrl(website.url)) {
      assert(
        String(website.url) === canonicalMatch[1],
        `${relPath}: WebSite.url "${website.url}" must match canonical URL "${canonicalMatch[1]}".`,
        errors
      );
    }
    const altNames = website.alternateName;
    const validAltNames =
      isNonEmptyString(altNames) ||
      (Array.isArray(altNames) && altNames.length > 0 && altNames.every((item) => isNonEmptyString(item)));
    assert(
      validAltNames,
      `${relPath}: WebSite entity must include a non-empty "alternateName" string or array.`,
      errors
    );
    const publisher = website.publisher as Record<string, unknown> | undefined;
    if (publisher && isNonEmptyString(publisher['@id'])) {
      assert(
        nodesById.has(publisher['@id']),
        `${relPath}: WebSite.publisher "${publisher['@id']}" does not resolve in @graph.`,
        errors
      );
    }
    if (ogSiteNameMatch?.[1] && isNonEmptyString(website.name)) {
      assert(
        ogSiteNameMatch[1].trim() === website.name.trim(),
        `${relPath}: og:site_name "${ogSiteNameMatch[1]}" must match WebSite.name "${website.name}".`,
        errors
      );
    }
  }

  if (person) {
    assert(isNonEmptyString(person.name), `${relPath}: Person entity is missing valid "name".`, errors);
    assert(isValidHttpUrl(person.url), `${relPath}: Person entity "url" must be an absolute URL.`, errors);
    assert(
      isValidHttpUrl(person.image),
      `${relPath}: Person entity "image" must be an absolute URL.`,
      errors
    );
    assert(
      isNonEmptyString(person.email) &&
        (String(person.email).startsWith('mailto:') || String(person.email).includes('@')),
      `${relPath}: Person entity has invalid "email".`,
      errors
    );
    assert(
      Array.isArray(person.sameAs) && person.sameAs.every((u) => isValidHttpUrl(u)),
      `${relPath}: Person entity "sameAs" must be an array of valid absolute URLs.`,
      errors
    );
    assert(
      Array.isArray(person.knowsAbout) &&
        person.knowsAbout.length > 0 &&
        person.knowsAbout.every((topic) => isNonEmptyString(topic)),
      `${relPath}: Person entity "knowsAbout" must be a non-empty array of strings.`,
      errors
    );
    const addr = person.address as Record<string, unknown> | undefined;
    assert(
      Boolean(addr && addr['@type'] === 'PostalAddress' && isNonEmptyString(addr.addressCountry)),
      `${relPath}: Person entity "address" must be a valid PostalAddress.`,
      errors
    );

    if (canonicalOrigin && isValidHttpUrl(person.url)) {
      assert(
        new URL(String(person.url)).origin === canonicalOrigin,
        `${relPath}: Person.url origin mismatches canonical origin "${canonicalOrigin}".`,
        errors
      );
    }
    if (canonicalOrigin && isValidHttpUrl(person.image)) {
      assert(
        new URL(String(person.image)).origin === canonicalOrigin,
        `${relPath}: Person.image origin mismatches canonical origin "${canonicalOrigin}".`,
        errors
      );
    }
  }

  if (profilePage) {
    assert(
      isNonEmptyString(profilePage.name),
      `${relPath}: ProfilePage is missing valid "name".`,
      errors
    );
    assert(
      isValidHttpUrl(profilePage.url),
      `${relPath}: ProfilePage "url" must be an absolute URL.`,
      errors
    );

    const mainEntity = profilePage.mainEntity as Record<string, unknown> | undefined;
    const mainEntityId = mainEntity?.['@id'];
    assert(
      isNonEmptyString(mainEntityId),
      `${relPath}: ProfilePage is missing required "mainEntity.@id" reference.`,
      errors
    );

    if (isNonEmptyString(mainEntityId)) {
      const target = nodesById.get(mainEntityId);
      assert(
        Boolean(target),
        `${relPath}: ProfilePage.mainEntity "${mainEntityId}" does not resolve in @graph.`,
        errors
      );
      if (target) {
        assert(
          hasType(target, 'Person') && isNonEmptyString(target.name),
          `${relPath}: ProfilePage.mainEntity "${mainEntityId}" must resolve to a Person with a valid name.`,
          errors
        );
      }
    }

    const about = profilePage.about as Record<string, unknown> | undefined;
    const aboutId = about?.['@id'];
    if (isNonEmptyString(aboutId)) {
      assert(
        nodesById.has(aboutId),
        `${relPath}: ProfilePage.about "${aboutId}" does not resolve in @graph.`,
        errors
      );
    }

    const isPartOf = profilePage.isPartOf as Record<string, unknown> | undefined;
    const isPartOfId = isPartOf?.['@id'];
    const resolvedWebsite = isNonEmptyString(isPartOfId) ? nodesById.get(isPartOfId) : isPartOf;
    assert(
      Boolean(
        resolvedWebsite &&
          hasType(resolvedWebsite, 'WebSite') &&
          isNonEmptyString(resolvedWebsite.name) &&
          isValidHttpUrl(resolvedWebsite.url)
      ),
      `${relPath}: ProfilePage.isPartOf must resolve to a valid WebSite with name and url.`,
      errors
    );

    const primaryImage = profilePage.primaryImageOfPage as Record<string, unknown> | undefined;
    assert(
      Boolean(
        primaryImage &&
          primaryImage['@type'] === 'ImageObject' &&
          isValidHttpUrl(primaryImage.url) &&
          typeof primaryImage.width === 'number' &&
          typeof primaryImage.height === 'number'
      ),
      `${relPath}: ProfilePage.primaryImageOfPage must be a valid ImageObject with url, width, height.`,
      errors
    );
  }
}

const errors: string[] = [];

// 1. Validate source index.html
const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  errors.push('Missing root index.html file.');
} else {
  validateHtmlStructuredData(indexHtmlPath, errors);
}

// 2. Ensure React components do not inject duplicate ld+json scripts
const srcFiles = collectSourceFiles(path.join(ROOT_DIR, 'src'), new Set(['.ts', '.tsx']));
for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (/application\/ld\+json/i.test(content)) {
    errors.push(
      `${path.relative(ROOT_DIR, file)}: Unexpected runtime JSON-LD injection; keep structured data centralized in index.html.`
    );
  }
}

// 3. Also validate built dist/index.html if present
const distIndexPath = path.join(ROOT_DIR, 'dist/index.html');
if (fs.existsSync(distIndexPath)) {
  validateHtmlStructuredData(distIndexPath, errors);
}

if (errors.length > 0) {
  console.error(`\n[seo-jsonld] Found ${errors.length} structured-data validation error(s):\n`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  console.error('');
  process.exit(1);
}

console.log(
  '[seo-jsonld] Verified index.html JSON-LD (WebSite, Person, ProfilePage.mainEntity -> #person): 0 errors.'
);
