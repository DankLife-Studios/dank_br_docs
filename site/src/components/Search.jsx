import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSearchCorpus } from '../content/loadMarkdown.js';

function snippetAround(text, query, radius = 60) {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, radius * 2).replace(/\s+/g, ' ').trim();
  const start = Math.max(0, idx - radius);
  const end = Math.min(text.length, idx + query.length + radius);
  const slice = text.slice(start, end).replace(/\s+/g, ' ').trim();
  return `${start > 0 ? '…' : ''}${slice}${end < text.length ? '…' : ''}`;
}

export default function Search({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const corpus = useMemo(() => getSearchCorpus(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const scored = [];
    for (const page of corpus) {
      const titleHit = page.title.toLowerCase().includes(q);
      const descHit = (page.description || '').toLowerCase().includes(q);
      const bodyIdx = page.text.toLowerCase().indexOf(q);
      if (!titleHit && !descHit && bodyIdx === -1) continue;

      let score = 0;
      if (titleHit) score += 50;
      if (descHit) score += 20;
      if (bodyIdx !== -1) score += Math.max(1, 30 - Math.floor(bodyIdx / 200));

      scored.push({
        ...page,
        score,
        snippet: snippetAround(page.text.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*|`-]/g, ' '), q),
      });
    }

    return scored.sort((a, b) => b.score - a.score).slice(0, 12);
  }, [corpus, query]);

  useEffect(() => {
    const onDocClick = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className="search" ref={rootRef}>
      <span className="search-icon" aria-hidden>
        ⌕
      </span>
      <input
        type="search"
        placeholder="Search docs…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        aria-label="Search documentation"
      />
      {open && query.trim().length >= 2 && (
        <div className="search-results" role="listbox">
          {results.length === 0 ? (
            <div className="search-empty">No matches for “{query.trim()}”</div>
          ) : (
            results.map((result) => (
              <Link
                key={result.path}
                to={result.path}
                className="search-result"
                onClick={() => {
                  setOpen(false);
                  setQuery('');
                  onNavigate?.();
                }}
              >
                <div className="search-result-title">{result.title}</div>
                <div className="search-result-snippet">{result.snippet}</div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
