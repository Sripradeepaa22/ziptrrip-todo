import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">✦</div>
        <div>
          <div className="sidebar-name">TaskFlow</div>
          <div className="sidebar-sub">by Ziptrrip</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Workspace</p>
        <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          All Tasks
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-avatar">H</div>
        <div>
          <div className="sidebar-user">Hii</div>
          <div className="sidebar-role">Developer</div>
        </div>
      </div>
    </aside>
  );
}
