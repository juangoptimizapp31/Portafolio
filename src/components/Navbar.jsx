import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar glass-card">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <span className="text-gradient">Port</span>folio
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          </li>
          <li>
            <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>Projects</Link>
          </li>
          <li>
            <Link to="/certifications" className={location.pathname === '/certifications' ? 'active' : ''}>Certifications</Link>
          </li>
          <li>
            <Link to="/degrees" className={location.pathname === '/degrees' ? 'active' : ''}>Degrees</Link>
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
