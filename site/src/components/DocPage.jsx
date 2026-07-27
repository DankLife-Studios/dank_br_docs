import { useCallback, useState } from 'react';
import MarkdownView from './MarkdownView.jsx';
import TableOfContents from './TableOfContents.jsx';

export default function DocPage({ title, kicker, markdown, currentFile, hideTitle }) {
  const [headings, setHeadings] = useState([]);
  const onHeadings = useCallback((next) => setHeadings(next), []);

  return (
    <>
      <main className="main-column">
        <article className="doc-page">
          {kicker ? <div className="doc-page-kicker">{kicker}</div> : null}
          {!hideTitle && title ? <h1 style={{ fontFamily: 'var(--font-display)', marginTop: 0 }}>{title}</h1> : null}
          <MarkdownView markdown={markdown} currentFile={currentFile} onHeadings={onHeadings} />
        </article>
      </main>
      <TableOfContents headings={headings} />
    </>
  );
}
