import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ROUTES } from '../../constants/routes';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useApp();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={ROUTES.HOME} className="navbar-logo">
          DOR
        </Link>
        
        <div className="navbar-menu">
          <Link to={ROUTES.PRODUCTS} className="navbar-link">
            Products
          </Link>
          <Link to={ROUTES.ARTISANS} className="navbar-link">
            Artisans
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.DASHBOARD} className="navbar-link">
                Dashboard
              </Link>
              <Link to={ROUTES.ADD_PRODUCT} className="navbar-link">
                Add Product
              </Link>
              <span className="navbar-user">Hello, {user?.name}</span>
              <button onClick={logout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="navbar-link">
                Login
              </Link>
              <Link to={ROUTES.REGISTER} className="navbar-button">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

