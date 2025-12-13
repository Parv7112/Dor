import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService, { getImageUrl, getServerBaseUrl } from '../../services/api';
import { ROUTES } from '../../constants/routes';
import './CategoryDetail.css';

const CategoryDetail = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [stats, setStats] = useState({
    productCount: 0,
    artisanCount: 0,
    avgPrice: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Category information data
  const categoryInfo = {
    crafts: {
      title: 'Traditional Puppets & Crafts',
      icon: '🎭',
      description: 'Discover the enchanting world of Rajasthani Kathputli puppets and traditional crafts that have been passed down through generations.',
      history: 'Kathputli, meaning "wooden puppet", is one of Rajasthan\'s oldest and most colorful forms of entertainment. These handcrafted puppets tell stories of valor, romance, and folklore, bringing ancient tales to life.',
      features: [
        'Hand-carved wooden puppets',
        'Traditional string puppetry',
        'Colorful hand-painted designs',
        'Authentic Rajasthani craftsmanship',
      ],
      culturalSignificance: 'Puppetry in Rajasthan dates back over 1000 years and is an integral part of the state\'s cultural heritage. Each puppet is crafted with precision and tells a unique story.',
    },
    clothing: {
      title: 'Handcrafted Textiles',
      icon: '🧵',
      description: 'Explore the vibrant world of Rajasthani textiles featuring exquisite Bandhani, Block Print, and traditional embroidery techniques.',
      history: 'Rajasthan is renowned for its textile heritage, with techniques like Bandhani (tie-dye) and Block Printing dating back centuries. Each piece is a masterpiece of color and pattern.',
      features: [
        'Authentic Bandhani tie-dye',
        'Traditional block prints',
        'Hand-embroidered designs',
        'Natural dye techniques',
      ],
      culturalSignificance: 'Textiles from Rajasthan are celebrated worldwide for their intricate patterns and vibrant colors. Each region has its unique style and motifs.',
    },
    jewelry: {
      title: 'Artisan Jewelry',
      icon: '💎',
      description: 'Adorn yourself with exquisite handcrafted jewelry featuring traditional Rajasthani designs in silver, gold, and precious gemstones.',
      history: 'Rajasthani jewelry is known for its intricate designs and use of precious metals and stones. The art of jewelry making has been perfected over generations.',
      features: [
        'Handcrafted silver jewelry',
        'Traditional Kundan work',
        'Precious gemstone settings',
        'Meenakari enamel work',
      ],
      culturalSignificance: 'Jewelry in Rajasthan is not just adornment but a symbol of status, tradition, and cultural identity. Each piece tells a story of craftsmanship and heritage.',
    },
    home: {
      title: 'Pottery & Home Decor',
      icon: '🏺',
      description: 'Transform your living space with beautiful handcrafted pottery and traditional home decor items from Rajasthan\'s skilled artisans.',
      history: 'Rajasthani pottery has a rich tradition dating back thousands of years. From functional earthenware to decorative pieces, each item reflects the region\'s artistic heritage.',
      features: [
        'Traditional terracotta pottery',
        'Hand-painted ceramic designs',
        'Decorative home accessories',
        'Authentic Rajasthani motifs',
      ],
      culturalSignificance: 'Pottery in Rajasthan is both functional and artistic. The blue pottery of Jaipur and terracotta work are world-renowned for their beauty and craftsmanship.',
    },
    art: {
      title: 'Traditional Art',
      icon: '🎨',
      description: 'Explore the rich artistic traditions of Rajasthan through paintings, miniatures, and traditional art forms.',
      history: 'Rajasthan is home to various art forms including miniature paintings, Pichwai art, and traditional frescoes that adorn palaces and temples.',
      features: [
        'Miniature paintings',
        'Pichwai art',
        'Traditional frescoes',
        'Hand-painted artworks',
      ],
      culturalSignificance: 'Rajasthani art forms are a testament to the region\'s rich cultural heritage, with techniques passed down through generations of skilled artists.',
    },
  };

  const currentCategory = categoryInfo[category] || {
    title: category?.charAt(0).toUpperCase() + category?.slice(1) || 'Category',
    icon: '🎨',
    description: 'Explore our collection of handcrafted products.',
    history: 'Discover the rich heritage and craftsmanship.',
    features: [],
    culturalSignificance: 'Each piece represents traditional artistry.',
  };

  useEffect(() => {
    loadCategoryData();
  }, [category]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      
      // Load products for this category
      const productsResponse = await apiService.products.getAll({ category, limit: 6 });
      const categoryProducts = productsResponse.data.products || [];
      
      // Load all artisans
      const artisansResponse = await apiService.artisans.getAll();
      const allArtisans = artisansResponse.data || [];
      
      // Filter artisans who have products in this category
      const categoryArtisanIds = new Set(categoryProducts.map(p => p.artisan?._id || p.artisan));
      const categoryArtisans = allArtisans.filter(a => categoryArtisanIds.has(a._id)).slice(0, 4);
      
      // Calculate statistics
      const productCount = categoryProducts.length;
      const artisanCount = categoryArtisans.length;
      const totalPrice = categoryProducts.reduce((sum, p) => sum + (p.price || 0), 0);
      const avgPrice = productCount > 0 ? totalPrice / productCount : 0;
      
      setProducts(categoryProducts);
      setArtisans(categoryArtisans);
      setStats({
        productCount,
        artisanCount,
        avgPrice,
      });
    } catch (err) {
      setError(err.message || 'Failed to load category data');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <div className="loading">Loading category details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="category-detail-container">
      <Link to={ROUTES.HOME} className="back-link">← Back to Home</Link>

      <div className="category-hero">
        <div className="category-icon-large">{currentCategory.icon}</div>
        <h1 className="category-title">{currentCategory.title}</h1>
        <p className="category-description">{currentCategory.description}</p>
      </div>

      <div className="category-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{stats.productCount}</div>
          <div className="stat-label">Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍🎨</div>
          <div className="stat-value">{stats.artisanCount}</div>
          <div className="stat-label">Artisans</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">Rs {stats.avgPrice.toFixed(0)}</div>
          <div className="stat-label">Avg Price</div>
        </div>
      </div>

      <div className="category-content">
        <div className="category-info-section">
          <div className="info-card">
            <h2>History & Heritage</h2>
            <p>{currentCategory.history}</p>
          </div>
          <div className="info-card">
            <h2>Cultural Significance</h2>
            <p>{currentCategory.culturalSignificance}</p>
          </div>
        </div>

        {currentCategory.features.length > 0 && (
          <div className="features-section">
            <h2>Key Features</h2>
            <div className="features-grid">
              {currentCategory.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div className="featured-products">
            <div className="section-header">
              <h2>Featured Products</h2>
              <Link to={`${ROUTES.PRODUCTS}?category=${category}`} className="view-all-link">
                View All →
              </Link>
            </div>
            <div className="products-grid">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="product-card"
                >
                  {product.images && product.images.length > 0 && product.images[0].url ? (
                    <img
                      src={getImageUrl(product.images[0].url)}
                      alt={product.images[0].alt || product.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="product-image-placeholder">No Image</div>
                  )}
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-artisan">By {product.artisanName}</p>
                    <p className="product-price">Rs {product.price?.toFixed(2) || '0.00'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {artisans.length > 0 && (
          <div className="featured-artisans">
            <div className="section-header">
              <h2>Featured Artisans</h2>
              <Link to={ROUTES.ARTISANS} className="view-all-link">
                View All →
              </Link>
            </div>
            <div className="artisans-grid">
              {artisans.map((artisan) => (
                <Link
                  key={artisan._id}
                  to={`/artisans/${artisan._id}`}
                  className="artisan-card"
                >
                  <div className="artisan-avatar">
                    {artisan.image ? (
                      <img
                        src={getImageUrl(artisan.image)}
                        alt={artisan.name}
                        className="avatar-image"
                      />
                    ) : (
                      <span className="avatar-icon">👨‍🎨</span>
                    )}
                  </div>
                  <div className="artisan-info">
                    <h3 className="artisan-name">{artisan.name}</h3>
                    {artisan.shopName && (
                      <p className="artisan-shop">{artisan.shopName}</p>
                    )}
                    {artisan.bio && (
                      <p className="artisan-bio">{artisan.bio.substring(0, 80)}...</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;

