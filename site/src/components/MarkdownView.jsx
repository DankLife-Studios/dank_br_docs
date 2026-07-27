import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Marked } from 'marked';
import DOMPurify from 'dompurify';
import mermaid from 'mermaid';
import { rewriteDocHref } from '../content/rewriteLinks.js';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'IBM Plex Sans, sans-serif',
});

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

/**
 * @param {{ markdown: string, currentFile?: string, onHeadings?: (h: any[]) => void }} props
 */
export default function MarkdownView({ markdown, currentFile = '', onHeadings }) {
  const rootRef = useRef(null);
  const navigate = useNavigate();

  const html = useMemo(() => {
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
      },
    });

    const raw = parser.parse(markdown);

    return DOMPurify.sanitize(raw, {
      ADD_ATTR: ['id', 'target', 'rel'],
    });
  }, [markdown, currentFile]);

  useEffect(() => {
    onHeadings?.(extractHeadings(html));
  }, [html, onHeadings]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const blocks = root.querySelectorAll('pre code.language-mermaid');
    const jobs = [];

    blocks.forEach((code, index) => {
      const pre = code.parentElement;
      if (!pre) return;
      const source = code.textContent || '';
      const host = document.createElement('div');
      host.className = 'mermaid';
      host.textContent = source;
      pre.replaceWith(host);

      jobs.push(
        mermaid
          .render(`mermaid-${index}-${Date.now()}`, source)
          .then(({ svg }) => {
            host.innerHTML = svg;
          })
          .catch((err) => {
            host.innerHTML = `<pre>Mermaid error: ${String(err.message || err)}</pre>`;
          })
      );
    });

    return () => {
      // no-op; next render replaces root content
    };
  }, [html]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

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
  }, [navigate, html]);

  return <div className="markdown" ref={rootRef} dangerouslySetInnerHTML={{ __html: html }} />;
}
