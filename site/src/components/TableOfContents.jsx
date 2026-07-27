export default function TableOfContents({ headings = [] }) {
  if (!headings.length) {
    return (
      <aside className="toc">
        <p className="toc-title">On this page</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0 12px' }}>No sections</p>
      </aside>
    );
  }

  return (
    <aside className="toc">
      <p className="toc-title">On this page</p>
      <nav>
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`depth-${heading.depth}`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
