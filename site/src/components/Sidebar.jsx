import { NavLink } from 'react-router-dom';
import { guides, resourceGroups, resourceTitles, getResourcePath } from '../content/manifest.js';

export default function Sidebar({ open, onNavigate }) {
  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sidebar-group">
        <p className="sidebar-group-title">Start</p>
        <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`} onClick={onNavigate}>
          Home
        </NavLink>
      </div>

      <div className="sidebar-group">
        <p className="sidebar-group-title">Guides</p>
        {guides.map((guide) => (
          <NavLink
            key={guide.id}
            to={guide.path}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            onClick={onNavigate}
          >
            {guide.title}
          </NavLink>
        ))}
      </div>

      {resourceGroups.map((group) => (
        <div className="sidebar-group" key={group.id}>
          <p className="sidebar-group-title">{group.title}</p>
          {group.items.map((name) => (
            <NavLink
              key={name}
              to={getResourcePath(name)}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={onNavigate}
            >
              {resourceTitles[name] || name}
            </NavLink>
          ))}
        </div>
      ))}
    </aside>
  );
}
