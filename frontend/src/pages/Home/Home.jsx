import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="puppets-decoration">
          <span className="puppet puppet-left">🎭</span>
          <span className="puppet puppet-right">🎪</span>
          <span className="puppet puppet-center">🎨</span>
        </div>
        <h1 className="hero-title">
          <span className="title-decorative">राजस्थानी</span>
          <br />
          DOR
        </h1>
        <p className="hero-subtitle">
          Discover authentic handmade Rajasthani products crafted by skilled artisans
        </p>
        <p className="hero-description">
          From traditional puppets and textiles to intricate jewelry and pottery, 
          explore the rich heritage of Rajasthan's artistic legacy
        </p>
        <div className="hero-actions">
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="primary">
              <span>🛍️</span> Browse Products
            </Button>
          </Link>
          <Link to={ROUTES.REGISTER}>
            <Button variant="secondary">
              <span>👨‍🎨</span> Become an Artisan
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🎭</div>
          <h3>Traditional Puppets</h3>
          <p>Authentic Rajasthani Kathputli puppets</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🧵</div>
          <h3>Handcrafted Textiles</h3>
          <p>Beautiful bandhani and block prints</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💎</div>
          <h3>Artisan Jewelry</h3>
          <p>Unique silver and gemstone pieces</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏺</div>
          <h3>Pottery & Crafts</h3>
          <p>Traditional ceramics and handicrafts</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

