import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService, { getImageUrl } from '../../services/api';
import './Artisans.css';

const Artisans = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadArtisans();
  }, []);

  const loadArtisans = async () => {
    try {
      setLoading(true);
      const response = await apiService.artisans.getAll();
      setArtisans(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load artisans');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="artisans-container">
      <div className="artisans-header">
        <h1>Our Artisans</h1>
        <p>Meet the talented craftspeople behind our beautiful products</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading artisans...</div>
      ) : artisans.length === 0 ? (
        <div className="no-artisans">No artisans found.</div>
      ) : (
        <div className="artisans-grid">
          {artisans.map((artisan) => (
            <Link
              key={artisan._id}
              to={`/artisans/${artisan._id}`}
              className="artisan-card-link"
            >
              <div className="artisan-card">
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
                <h2 className="artisan-name">{artisan.name}</h2>
                {artisan.shopName && (
                  <p className="artisan-shop">{artisan.shopName}</p>
                )}
                {artisan.bio && (
                  <p className="artisan-bio">{artisan.bio}</p>
                )}
                <div className="artisan-stats">
                  <span className="product-count">
                    {artisan.productCount || 0} Products
                  </span>
                </div>
                <div className="artisan-contact">
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <a href={`mailto:${artisan.email}`} className="contact-link">
                      {artisan.email}
                    </a>
                  </div>
                  {artisan.phone && (
                    <div className="contact-item">
                      <span className="contact-icon">📞</span>
                      <a href={`tel:${artisan.phone}`} className="contact-link">
                        {artisan.phone}
                      </a>
                    </div>
                  )}
                  {artisan.address && (
                    <div className="contact-item">
                      <span className="contact-icon">📍</span>
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
                  )}
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Artisans;

