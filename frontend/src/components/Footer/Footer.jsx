import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="footer-logo-icon">🎭</span>
              <h3>DOR</h3>
            </div>
            <p className="footer-description">
              Preserving Rajasthan's rich cultural heritage through authentic handcrafted products.
              Supporting local artisans and bringing traditional craftsmanship to the world.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook">📘</a>
              <a href="#" className="social-link" aria-label="Instagram">📷</a>
              <a href="#" className="social-link" aria-label="Twitter">🐦</a>
              <a href="#" className="social-link" aria-label="YouTube">📺</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to={ROUTES.HOME}>Home</Link></li>
              <li><Link to={ROUTES.PRODUCTS}>Products</Link></li>
              <li><Link to={ROUTES.ARTISANS}>Artisans</Link></li>
              <li><Link to={ROUTES.REGISTER}>Become an Artisan</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><Link to="/category/crafts">Traditional Puppets</Link></li>
              <li><Link to="/category/clothing">Handcrafted Textiles</Link></li>
              <li><Link to="/category/jewelry">Artisan Jewelry</Link></li>
              <li><Link to="/category/home">Pottery & Crafts</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <span className="contact-icon">📧</span>
                <a href="mailto:info@dor.com">info@dor.com</a>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
              <li>
                <span className="contact-icon">📍</span>
                <span>Jaipur, Rajasthan, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} DOR - Rajasthani Heritage Crafts. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="#">Privacy Policy</Link>
            <span>|</span>
            <Link to="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

