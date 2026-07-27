import { Link } from 'react-router-dom';
import {
  apiJumpLinks,
  guides,
  resourceGroups,
  resourceTitles,
  getResourcePath,
} from '../content/manifest.js';
import TableOfContents from '../components/TableOfContents.jsx';

const homeToc = [
  { id: 'guides', depth: 2, text: 'Guides' },
  { id: 'resources', depth: 2, text: 'Resources' },
  { id: 'api-surface', depth: 2, text: 'Exports & public APIs' },
  { id: 'quick-links', depth: 2, text: 'Quick links' },
];

export default function HomePage() {
  return (
    <>
      <main className="main-column">
        <div className="doc-page home-grid">
          <section className="home-hero">
            <h1>Dank’s BR Documentation</h1>
            <p>
              Detailed reference for the Battle Royale resource stack — architecture, commands,
              dependencies, and every resource’s config, events, and public APIs.
            </p>
            <div className="quick-chips">
              <span className="chip">/admin · F10</span>
              <span className="chip">/leaderboard · F7</span>
              <span className="chip">Target · Left Alt</span>
              <span className="chip">Voice · F11</span>
            </div>
          </section>

          <section className="home-section" id="guides">
            <h2>Guides</h2>
            <div className="card-grid">
              {guides.map((guide) => (
                <Link key={guide.id} to={guide.path} className="card">
                  <div className="card-title">{guide.title}</div>
                  <div className="card-desc">{guide.description}</div>
                </Link>
              ))}
            </div>
          </section>

          <section className="home-section" id="resources">
            <h2>Resources</h2>
            {resourceGroups.map((group) => (
              <div key={group.id} style={{ marginBottom: 22 }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    color: 'var(--text-muted)',
                    margin: '0 0 10px',
                  }}
                >
                  {group.title}
                </h3>
                <div className="card-grid">
                  {group.items.map((name) => (
                    <Link key={name} to={getResourcePath(name)} className="card">
                      <div className="card-title">{resourceTitles[name] || name}</div>
                      <div className="card-desc">Role, config, events, commands, exports</div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="home-section" id="api-surface">
            <h2>Exports & public APIs</h2>
            <div className="api-list">
              {apiJumpLinks.map((item) => (
                <Link key={`${item.resource}-${item.hash}`} to={`/resources/${item.resource}#${item.hash}`}>
                  <strong>{item.resource}</strong>
                  <span>{item.label}</span>
                </Link>
              ))}
              <div
                style={{
                  padding: '8px 12px',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                }}
              >
                br-hud / br-leaderboard / br-loadscreen — no exports; see event contracts on their pages.
              </div>
            </div>
          </section>

          <section className="home-section" id="quick-links">
            <h2>Quick links</h2>
            <ul>
              <li>
                <Link to="/overview">Overview</Link> — game loop, buckets, state bags
              </li>
              <li>
                <Link to="/commands">Commands</Link> — master command & keybind reference
              </li>
              <li>
                <Link to="/dependencies">Dependencies</Link> — oxmysql, pma-voice
              </li>
              <li>
                Markdown sources remain in <code>docs/</code> for editing; this site renders them.
              </li>
            </ul>
          </section>
        </div>
      </main>
      <TableOfContents headings={homeToc} />
    </>
  );
}
