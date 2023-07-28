import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import './appHeader.scss';

function AppHeader() {
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const activeClass = menuMobileOpen ? 'is-active' : '';

  const toggleMobileMenu = (e) => {
    setMenuMobileOpen(!menuMobileOpen);
  }

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="header-logo">
          <span>IKcoding</span>
          <span>movies</span>
        </Link>

        <nav className={`header-menu ${activeClass}`}>
          <ul className="header-menu__list">
            <li>
              <NavLink end to="/" onClick={toggleMobileMenu}>Homepage</NavLink>
            </li>
            <li>
              <NavLink to="/movie" onClick={toggleMobileMenu}>Movies</NavLink>
            </li>
            <li>
              <NavLink to="/tv" onClick={toggleMobileMenu}>TV-Shows</NavLink>
            </li>
          </ul>
        </nav>

        <button className={`header-burger ${activeClass}`} type="button" onClick={toggleMobileMenu}>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default AppHeader;