import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <NavLink to="/" className="logo">
            Sport<span>Pro</span>
          </NavLink>
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
          <nav className={isMenuOpen ? 'active' : ''}>
            <ul>
              <li><NavLink to="/" end>Accueil</NavLink></li>
              <li><NavLink to="/actualites">Actualités</NavLink></li>
              <li><NavLink to="/evenements">Événements</NavLink></li>
              <li><NavLink to="/equipements">Équipements</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;