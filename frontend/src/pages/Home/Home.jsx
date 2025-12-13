import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components';
import apiService, { getServerBaseUrl } from '../../services/api';
import './Home.css';

const Home = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalArtisans: 0,
    totalCategories: 5,
  });
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      // Load products and artisans
      const [productsRes, artisansRes] = await Promise.all([
        apiService.products.getAll({ limit: 6 }),
        apiService.artisans.getAll(),
      ]);

      const products = productsRes.data?.products || [];
      const artisans = artisansRes.data || [];

      setStats({
        totalProducts: productsRes.data?.pagination?.total || products.length,
        totalArtisans: artisans.length,
        totalCategories: 5,
      });

      setFeaturedProducts(products.slice(0, 6));
    } catch (err) {
      console.error('Failed to load home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductImageUrl = (image) => {
    if (!image || !image.url) return null;
    if (image.url.startsWith('http')) return image.url;
    return `${getServerBaseUrl()}${image.url}`;
  };

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

      {/* Statistics Section */}
      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number" data-target={stats.totalProducts}>
              {loading ? '...' : stats.totalProducts}+
            </div>
            <div className="stat-label">Products</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-target={stats.totalArtisans}>
              {loading ? '...' : stats.totalArtisans}+
            </div>
            <div className="stat-label">Artisans</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-target={stats.totalCategories}>
              {stats.totalCategories}
            </div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <Link to="/category/crafts" className="feature-card-link">
          <div className="feature-card">
            <div className="feature-icon">🎭</div>
            <h3>Traditional Puppets</h3>
            <p>Authentic Rajasthani Kathputli puppets</p>
          </div>
        </Link>
        <Link to="/category/clothing" className="feature-card-link">
          <div className="feature-card">
            <div className="feature-icon">🧵</div>
            <h3>Handcrafted Textiles</h3>
            <p>Beautiful bandhani and block prints</p>
          </div>
        </Link>
        <Link to="/category/jewelry" className="feature-card-link">
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Artisan Jewelry</h3>
            <p>Unique silver and gemstone pieces</p>
          </div>
        </Link>
        <Link to="/category/home" className="feature-card-link">
          <div className="feature-card">
            <div className="feature-icon">🏺</div>
            <h3>Pottery & Crafts</h3>
            <p>Traditional ceramics and handicrafts</p>
          </div>
        </Link>
      </div>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <div className="featured-products-section">
          <div className="section-header-home">
            <h2>Featured Products</h2>
            <Link to={ROUTES.PRODUCTS} className="view-all-button">
              View All Products →
            </Link>
          </div>
          <div className="featured-products-grid">
            {featuredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="featured-product-card"
              >
                {product.images && product.images.length > 0 && product.images[0].url ? (
                  <img
                    src={getProductImageUrl(product.images[0])}
                    alt={product.images[0].alt || product.name}
                    className="featured-product-image"
                  />
                ) : (
                  <div className="featured-product-placeholder">No Image</div>
                )}
                <div className="featured-product-info">
                  <h4>{product.name}</h4>
                  <p className="featured-product-artisan">By {product.artisanName}</p>
                  <p className="featured-product-price">Rs {product.price?.toFixed(2) || '0.00'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Why Choose Us Section */}
      <div className="why-choose-section">
        <h2>Why Choose DOR?</h2>
        <div className="why-choose-grid">
          <div className="why-choose-item">
            <div className="why-icon">✨</div>
            <h3>Authentic Craftsmanship</h3>
            <p>Every product is handcrafted by skilled artisans using traditional techniques passed down through generations.</p>
          </div>
          <div className="why-choose-item">
            <div className="why-icon">🤝</div>
            <h3>Support Local Artisans</h3>
            <p>Your purchase directly supports local artisans and helps preserve Rajasthan's cultural heritage.</p>
          </div>
          <div className="why-choose-item">
            <div className="why-icon">🎨</div>
            <h3>Unique Designs</h3>
            <p>Discover one-of-a-kind pieces that reflect the rich artistic traditions of Rajasthan.</p>
          </div>
          <div className="why-choose-item">
            <div className="why-icon">🚚</div>
            <h3>Secure Delivery</h3>
            <p>We ensure safe and secure packaging and delivery of your precious handcrafted items.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

