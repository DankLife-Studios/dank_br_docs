import { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import MarkdownView from './MarkdownView.jsx';
import TableOfContents from './TableOfContents.jsx';

const GameLoopFlowchart = lazy(() => import('./GameLoopFlowchart.jsx'));

function FlowchartFallback() {
  return <div className="game-loop-flow game-loop-flow--loading">Loading flowchart…</div>;
}

export default function DocPage({ title, kicker, markdown, currentFile, hideTitle }) {
  const [headings, setHeadings] = useState([]);
  const onHeadings = useCallback((next) => setHeadings(next), []);

  const embeds = useMemo(() => {
    if (currentFile !== 'overview.md') return undefined;
    return {
      'game-loop-flow': (
        <Suspense fallback={<FlowchartFallback />}>
          <GameLoopFlowchart />
        </Suspense>
      ),
    };
  }, [currentFile]);

  return (
    <>
      <main className="main-column">
        <article className="doc-page">
          {kicker ? <div className="doc-page-kicker">{kicker}</div> : null}
          {!hideTitle && title ? <h1 style={{ fontFamily: 'var(--font-display)', marginTop: 0 }}>{title}</h1> : null}
          <MarkdownView
            markdown={markdown}
            currentFile={currentFile}
            onHeadings={onHeadings}
            embeds={embeds}
          />
        </article>
      </main>
      <TableOfContents headings={headings} />
    </>
  );
}
