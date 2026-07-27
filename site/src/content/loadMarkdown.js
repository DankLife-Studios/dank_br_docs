import { getAllPages } from './manifest.js';

/**
 * Eager raw imports of every docs markdown file under docs/.
 * Paths are relative to this file: docs/site/src/content/
 */
const rootDocs = import.meta.glob('../../../{overview,commands,dependencies,README}.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const resourceDocs = import.meta.glob('../../../resources/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/**
 * @param {string} viteKey
 * @returns {string} file key under docs/ e.g. overview.md or resources/br-hud.md
 */
function toDocsKey(viteKey) {
  const normalized = viteKey.replace(/\\/g, '/');
  const resourcesIdx = normalized.lastIndexOf('/resources/');
  if (resourcesIdx !== -1) {
    return `resources/${normalized.slice(resourcesIdx + '/resources/'.length)}`;
  }
  const base = normalized.split('/').pop();
  return base || normalized;
}

const byFile = new Map();

for (const [key, value] of Object.entries(rootDocs)) {
  byFile.set(toDocsKey(key), value);
}

for (const [key, value] of Object.entries(resourceDocs)) {
  byFile.set(toDocsKey(key), value);
}

/**
 * @param {string} file relative path under docs/ (e.g. overview.md)
 * @returns {string}
 */
export function loadMarkdown(file) {
  const content = byFile.get(file);
  if (typeof content !== 'string') {
    const available = [...byFile.keys()].sort().join(', ');
    throw new Error(
      `Missing markdown for "${file}". Available keys: ${available || '(none)'}`
    );
  }
  return content;
}

/** Validate every manifest page has loadable content at module init. */
export function assertManifestContent() {
  const missing = [];
  for (const page of getAllPages()) {
    if (!byFile.has(page.file)) {
      missing.push(page.file);
    }
  }
  if (missing.length) {
    throw new Error(`Docs manifest missing markdown files: ${missing.join(', ')}`);
  }
}

export function getSearchCorpus() {
  return getAllPages().map((page) => ({
    ...page,
    text: loadMarkdown(page.file),
  }));
}
