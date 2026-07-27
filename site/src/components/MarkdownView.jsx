import { Fragment, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marked } from 'marked';
import DOMPurify from 'dompurify';
import { rewriteDocHref } from '../content/rewriteLinks.js';

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function extractHeadings(html) {
  const headings = [];
  const re = /<h([23])\s+id="([^"]+)"[^>]*>(.*?)<\/h\1>/gi;
  let match;
  while ((match = re.exec(html))) {
    headings.push({
      depth: Number(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, ''),
    });
  }
  return headings;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderMarkdownHtml(markdown, currentFile) {
  const parser = new Marked();
  parser.use({
    gfm: true,
    breaks: false,
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = slugify(text);
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const next = rewriteDocHref(href || '', currentFile);
        const titleAttr = title ? ` title="${title}"` : '';
        return `<a href="${next}"${titleAttr}>${text}</a>`;
      },
      code({ text, lang }) {
        const language = String(lang || '').trim().split(/\s+/)[0] || '';
        const classAttr = language ? ` class="language-${escapeHtml(language)}"` : '';
        return `<pre><code${classAttr}>${escapeHtml(text)}</code></pre>\n`;
      },
    },
  });

  return DOMPurify.sanitize(parser.parse(markdown), {
    ADD_ATTR: ['id', 'target', 'rel'],
  });
}

/**
 * Split markdown on {{embed-id}} markers for React embeds.
 * @param {string} markdown
 * @param {Record<string, import('react').ReactNode>} embeds
 */
function splitWithEmbeds(markdown, embeds) {
  const keys = Object.keys(embeds || {});
  if (!keys.length) {
    return [{ type: 'md', content: markdown }];
  }

  const pattern = new RegExp(`\\{\\{(${keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\}\\}`, 'g');
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(markdown))) {
    if (match.index > lastIndex) {
      parts.push({ type: 'md', content: markdown.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'embed', id: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < markdown.length) {
    parts.push({ type: 'md', content: markdown.slice(lastIndex) });
  }

  return parts.length ? parts : [{ type: 'md', content: markdown }];
}

/**
 * @param {{
 *   markdown: string,
 *   currentFile?: string,
 *   onHeadings?: (h: any[]) => void,
 *   embeds?: Record<string, import('react').ReactNode>,
 * }} props
 */
export default function MarkdownView({ markdown, currentFile = '', onHeadings, embeds }) {
  const rootRef = useRef(null);
  const navigate = useNavigate();

  const parts = useMemo(() => splitWithEmbeds(markdown, embeds), [markdown, embeds]);

  const renderedParts = useMemo(
    () =>
      parts.map((part) => {
        if (part.type === 'embed') return part;
        return {
          type: 'md',
          html: renderMarkdownHtml(part.content, currentFile),
        };
      }),
    [parts, currentFile]
  );

  const htmlSignature = useMemo(
    () => renderedParts.map((p) => (p.type === 'md' ? p.html : `embed:${p.id}`)).join('\n'),
    [renderedParts]
  );

  useEffect(() => {
    const headings = [];
    for (const part of renderedParts) {
      if (part.type === 'md') {
        headings.push(...extractHeadings(part.html));
      }
    }
    onHeadings?.(headings);
  }, [htmlSignature, onHeadings, renderedParts]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const onClick = (event) => {
      const anchor = event.target.closest('a');
      if (!anchor || !root.contains(anchor)) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) {
        return;
      }
      if (href.startsWith('/')) {
        event.preventDefault();
        navigate(href);
      }
    };

    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  }, [navigate, htmlSignature]);

  return (
    <div className="markdown" ref={rootRef}>
      {renderedParts.map((part, index) => {
        if (part.type === 'embed') {
          return (
            <div className="doc-embed" key={`embed-${part.id}-${index}`}>
              {embeds?.[part.id] ?? null}
            </div>
          );
        }
        return (
          <Fragment key={`md-${index}`}>
            <div dangerouslySetInnerHTML={{ __html: part.html }} />
          </Fragment>
        );
      })}
    </div>
  );
}
