import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  ['FASHION', '/articles?category=Fashion'],
  ['TRENDS', '/trends'],
  ['DESIGNERS', '/designers'],
  ['COLLECTIONS', '/collections'],
  ['STREET FILE', '/street-style'],
  ['BEAUTY', '/articles?category=Beauty'],
  ['CULTURE', '/articles?category=Culture']
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, openAuthModal, setIsSearchOpen, bookmarksCount, logout } = useAuth();

  const isCategoryActive = (path) => ({ isActive }) => {
    if (path.includes('?category=')) {
      return locationMatchesCategory(path);
    }
    return isActive;
  };

  const locationMatchesCategory = (path) => {
    const category = new URLSearchParams(window.location.search).get('category');
    return window.location.pathname === '/articles' && category === new URL(path, window.location.origin).searchParams.get('category');
  };

  return (
    <header className="site-header">
      <div className="header-strip">FD Trend Journal / Independent Fashion Design Platform / 2026</div>

      <div className="container-wide header-main">
        <div className="header-left">
          <button className="mobile-toggle" onClick={() => setOpen(v => !v)}>{open ? 'CLOSE' : 'MENU'}</button>
          <div className="desktop-home-links">
            <NavLink className="header-link" to="/">HOME</NavLink>
            <NavLink className="header-link" to="/about">ABOUT</NavLink>
          </div>
        </div>

        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <div className="brand-name">FD TREND</div>
          <div className="brand-sub">Fashion Design / Journal / Platform</div>
        </Link>

        <div className="header-actions">
          <button className="header-link" onClick={() => setIsSearchOpen(true)}>SEARCH</button>
          <Link className="header-link" to={user ? '/profile?tab=saved' : '#'} onClick={(e) => { if (!user) { e.preventDefault(); openAuthModal('login'); } }}>SAVE {bookmarksCount ? `(${bookmarksCount})` : ''}</Link>
          {user ? (
            <div className="user-actions">
              <Link className="header-link" to="/profile">{user.name.split(' ')[0]}</Link>
              {user.role === 'admin' && <Link className="header-link" to="/admin">EDITOR</Link>}
              <button className="header-link" onClick={logout}>LOG OUT</button>
            </div>
          ) : <button className="header-link" onClick={() => openAuthModal('login')}>SIGN IN</button>}
        </div>
      </div>

      <nav className="desktop-category-nav" aria-label="Main navigation">
        <div className="container-wide desktop-category-inner">
          {links.map(([label, path]) => (
            <NavLink
              key={label}
              to={path}
              className={() => `header-nav-link ${locationMatchesCategory(path) ? 'active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          {links.map(([label, path]) => <Link key={label} to={path} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link to="/about" onClick={() => setOpen(false)}>About FD Trend</Link>
          {user ? <Link to="/profile" onClick={() => setOpen(false)}>My Library</Link> : <button className="header-link" style={{textAlign:'left',padding:'15px 0'}} onClick={() => { setOpen(false); openAuthModal('login'); }}>Sign in</button>}
        </nav>
      </div>
    </header>
  );
}
