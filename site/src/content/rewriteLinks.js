/**
 * Rewrite markdown-relative links to app routes.
 * @param {string} href
 * @param {string} currentFile e.g. "resources/br-hud.md" or "overview.md"
 */
export function rewriteDocHref(href, currentFile = '') {
  if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
    return href;
  }

  if (href.startsWith('#')) {
    return href;
  }

  const [pathPart, hash = ''] = href.split('#');
  const hashSuffix = hash ? `#${hash}` : '';

  if (!pathPart || pathPart === '.') {
    return hashSuffix || '#';
  }

  // Root repo README
  if (pathPart === '../README.md' || pathPart.endsWith('/../README.md')) {
    return `/${hashSuffix}`;
  }

  // Docs index
  if (pathPart === 'README.md' || pathPart === './README.md') {
    return `/${hashSuffix}`;
  }

  // Normalize relative segments against current file directory
  const currentDir = currentFile.includes('/')
    ? currentFile.slice(0, currentFile.lastIndexOf('/') + 1)
    : '';
  let resolved = pathPart;

  if (pathPart.startsWith('./')) {
    resolved = currentDir + pathPart.slice(2);
  } else if (pathPart.startsWith('../')) {
    // From resources/foo.md → ../overview.md
    const parts = (currentDir + pathPart).split('/');
    const stack = [];
    for (const part of parts) {
      if (part === '..') stack.pop();
      else if (part && part !== '.') stack.push(part);
    }
    resolved = stack.join('/');
  } else if (!pathPart.startsWith('/') && currentDir) {
    // Bare relative like br-hud.md from within resources/
    if (!pathPart.includes('/') && currentFile.startsWith('resources/')) {
      resolved = `resources/${pathPart}`;
    }
  }

  resolved = resolved.replace(/^\.\//, '');

  if (resolved.endsWith('.md')) {
    if (resolved === 'overview.md' || resolved === 'commands.md' || resolved === 'dependencies.md') {
      return `/${resolved.replace(/\.md$/, '')}${hashSuffix}`;
    }
    if (resolved.startsWith('resources/')) {
      const name = resolved.replace(/^resources\//, '').replace(/\.md$/, '');
      return `/resources/${name}${hashSuffix}`;
    }
    // Bare resource file name
    if (/^br-[\w-]+\.md$/.test(resolved)) {
      return `/resources/${resolved.replace(/\.md$/, '')}${hashSuffix}`;
    }
  }

  return href;
}
