import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Search from './Search.jsx';

export default function Shell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start' });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          type="button"
          className="menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => setSidebarOpen((v) => !v)}
        >
          Menu
        </button>
        <Link to="/" className="brand">
          <div className="brand-mark">
            Dank’s <span>BR</span>
          </div>
          <div className="brand-sub">Documentation</div>
        </Link>
        <div className="topbar-actions">
          <Search onNavigate={closeSidebar} />
        </div>
      </header>

      <div
        className={`sidebar-backdrop${sidebarOpen ? ' open' : ''}`}
        onClick={closeSidebar}
        aria-hidden={!sidebarOpen}
      />

      <div className="shell-body">
        <Sidebar open={sidebarOpen} onNavigate={closeSidebar} />
        <Outlet />
      </div>
    </div>
  );
}
