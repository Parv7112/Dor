import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../../services/api';
import { getServerBaseUrl } from '../../services/api';
import './ArtisanDetail.css';

const ArtisanDetail = () => {
  const { id } = useParams();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadArtisan();
  }, [id]);

  const loadArtisan = async () => {
    try {
      setLoading(true);
      const response = await apiService.artisans.getById(id);
      setArtisan(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load artisan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading artisan details...</div>;
  }

  if (error || !artisan) {
    return <div className="error-message">{error || 'Artisan not found'}</div>;
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${getServerBaseUrl()}${imagePath}`;
  };

  const getProductImageUrl = (image) => {
    if (!image || !image.url) return null;
    if (image.url.startsWith('http')) return image.url;
    return `${getServerBaseUrl()}${image.url}`;
  };

  return (
    <div className="artisan-detail-container">
      <Link to="/artisans" className="back-link">← Back to Artisans</Link>

      <div className="artisan-detail">
        <div className="artisan-profile">
          <div className="artisan-avatar-large">
            {artisan.image ? (
              <img
                src={getImageUrl(artisan.image)}
                alt={artisan.name}
                className="avatar-image-large"
              />
            ) : (
              <span className="avatar-icon-large">👨‍🎨</span>
            )}
          </div>

          <div className="artisan-main-info">
            <h1 className="artisan-name-large">{artisan.name}</h1>
            {artisan.shopName && (
              <p className="artisan-shop-large">{artisan.shopName}</p>
            )}
            {artisan.bio && (
              <div className="artisan-bio-section">
                <h3>About</h3>
                <p className="artisan-bio-text">{artisan.bio}</p>
              </div>
            )}
          </div>
        </div>

        <div className="artisan-details-section">
          <div className="contact-section">
            <h2>Contact Information</h2>
            <div className="contact-details">
              <div className="contact-item-detail">
                <span className="contact-icon">📧</span>
                <div className="contact-info">
                  <span className="contact-label">Email</span>
                  <a href={`mailto:${artisan.email}`} className="contact-link">
                    {artisan.email}
                  </a>
                </div>
              </div>
              {artisan.phone && (
                <div className="contact-item-detail">
                  <span className="contact-icon">📞</span>
                  <div className="contact-info">
                    <span className="contact-label">Phone</span>
                    <a href={`tel:${artisan.phone}`} className="contact-link">
                      {artisan.phone}
                    </a>
                  </div>
                </div>
              )}
              {artisan.address && (
                <div className="contact-item-detail">
                  <span className="contact-icon">📍</span>
                  <div className="contact-info">
                    <span className="contact-label">Address</span>
                    <span className="contact-text">
                      {[
                        artisan.address.street,
                        artisan.address.city,
                        artisan.address.state,
                        artisan.address.zipCode,
                        artisan.address.country,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {artisan.products && artisan.products.length > 0 && (
            <div className="products-section">
              <h2>Products ({artisan.products.length})</h2>
              <div className="products-grid">
                {artisan.products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="product-card-link"
                  >
                    <div className="product-card-mini">
                      {product.images && product.images.length > 0 && product.images[0].url ? (
                        <img
                          src={getProductImageUrl(product.images[0])}
                          alt={product.images[0].alt || product.name}
                          className="product-image-mini"
                        />
                      ) : (
                        <div className="product-image-placeholder">No Image</div>
                      )}
                      <div className="product-info-mini">
                        <h4 className="product-name-mini">{product.name}</h4>
                        <p className="product-category-mini">{product.category}</p>
                        <p className="product-price-mini">Rs {product.price?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanDetail;

