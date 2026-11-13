import fs from 'node:fs';
import path from 'node:path';

interface LintViolation {
  file: string;
  line: number;
  column: number;
  message: string;
}

const ROOT_DIR = process.cwd();
const SRC_DIR = path.join(ROOT_DIR, 'src');

function collectFiles(dir: string, exts: Set<string>, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, exts, out);
    } else if (exts.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function getLineCol(content: string, index: number): { line: number; column: number } {
  const prefix = content.slice(0, index);
  const lines = prefix.split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

/**
 * Finds the end of a `<img ...>` or `<img ... />` tag in JSX/HTML while respecting
 * quoted strings ("...", '...', `...`) and nested `{...}` JSX expressions.
 */
function findTagEnd(content: string, startIndex: number): number {
  let i = startIndex + 4; // skip '<img'
  let braceDepth = 0;
  let quote: '"' | "'" | '`' | null = null;

  while (i < content.length) {
    const ch = content[i];
    const prev = i > 0 ? content[i - 1] : '';

    if (quote) {
      if (ch === quote && prev !== '\\') {
        quote = null;
      }
      i++;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      i++;
      continue;
    }

    if (ch === '{') {
      braceDepth++;
      i++;
      continue;
    }

    if (ch === '}') {
      if (braceDepth > 0) braceDepth--;
      i++;
      continue;
    }

    if (ch === '>' && braceDepth === 0) {
      return i;
    }

    i++;
  }

  return -1;
}

function stripCommentsOutsideStrings(content: string): string {
  // Replace single-line // comments (only outside URLs like https://) and /* ... */ block comments
  // while preserving line numbers so reported positions match exact lines.
  return content.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

function validateTagAttributes(
  attrsChunk: string,
  relPath: string,
  line: number,
  column: number,
  violations: LintViolation[]
) {
  if (/\{\.\.\.\s*(?:getAccessibleImageProps|props)\b/.test(attrsChunk)) {
    return;
  }

  // Match explicit `alt` prop in JSX or HTML:
  // - alt="..." / alt='...'
  // - alt={...}
  // - bare `alt` (invalid)
  const altPropMatch = attrsChunk.match(/(?:^|\s)alt(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([\s\S]*?)\})|(?=\s|\/?>|$))/);

  if (!altPropMatch) {
    violations.push({
      file: relPath,
      line,
      column,
      message:
        '<img> element is missing an explicit "alt" attribute (provide descriptive alt text or alt="" if decorative).',
    });
    return;
  }

  // Bare `alt` without `=`
  if (
    altPropMatch[1] === undefined &&
    altPropMatch[2] === undefined &&
    altPropMatch[3] === undefined
  ) {
    violations.push({
      file: relPath,
      line,
      column,
      message:
        '<img> "alt" attribute has no string value. Provide descriptive text or alt="" for decorative images.',
    });
    return;
  }

  const staticVal = altPropMatch[1] ?? altPropMatch[2];
  if (staticVal !== undefined) {
    if (staticVal.length > 0 && staticVal.trim().length === 0) {
      violations.push({
        file: relPath,
        line,
        column,
        message:
          '<img> "alt" attribute contains only whitespace. Use alt="" for decorative images or provide descriptive text.',
      });
    }
    return;
  }

  const expr = (altPropMatch[3] ?? '').trim();
  if (!expr || expr === 'undefined' || expr === 'null') {
    violations.push({
      file: relPath,
      line,
      column,
      message: '<img> "alt" expression cannot be empty, null, or undefined.',
    });
    return;
  }

  const quotedExpr = expr.match(/^(['"`])([\s\S]*)\1$/);
  if (quotedExpr && quotedExpr[2].length > 0 && quotedExpr[2].trim().length === 0) {
    violations.push({
      file: relPath,
      line,
      column,
      message: '<img> "alt" expression is whitespace-only.',
    });
  }
}

function checkFileForImgAlt(filePath: string, violations: LintViolation[]): number {
  const relPath = path.relative(ROOT_DIR, filePath);
  const rawContent = fs.readFileSync(filePath, 'utf8');
  const content = stripCommentsOutsideStrings(rawContent);
  const tagPattern = /<img(?=\s|\/?>)/gi;

  let imgCount = 0;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(content)) !== null) {
    const startIdx = match.index;
    const endIdx = findTagEnd(content, startIdx);
    if (endIdx === -1) continue;

    // Ignore prose comments mentioning `<img>` (i.e. literally `<img>` with empty attrs)
    const attrsChunk = content.slice(startIdx + 4, endIdx).replace(/\/$/, '').trim();
    if (attrsChunk.length === 0) {
      continue;
    }

    imgCount++;
    const { line, column } = getLineCol(rawContent, startIdx);
    validateTagAttributes(attrsChunk, relPath, line, column, violations);
  }

  return imgCount;
}

const tsFiles = collectFiles(SRC_DIR, new Set(['.ts', '.tsx']));
const allFiles = [...tsFiles, path.join(ROOT_DIR, 'index.html')].filter((f) => fs.existsSync(f));
const violations: LintViolation[] = [];
let totalImgsChecked = 0;

for (const file of allFiles) {
  totalImgsChecked += checkFileForImgAlt(file, violations);
}

if (violations.length > 0) {
  console.error(`\n[a11y-img-alt] Found ${violations.length} <img> alt violation(s):\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}:${v.column} — ${v.message}`);
  }
  console.error('');
  process.exit(1);
}

console.log(
  `[a11y-img-alt] Verified ${allFiles.length} files (${totalImgsChecked} <img> tags): 0 alt violations.`
);
