import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService, { getImageUrl } from '../../services/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await apiService.products.getById(id);
      setProduct(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (error || !product) {
    return <div className="error-message">{error || 'Product not found'}</div>;
  }

  return (
    <div className="product-detail-container">
      <Link to="/products" className="back-link">← Back to Products</Link>

      <div className="product-detail">
        <div className="product-images">
          {product.images && product.images.length > 0 && product.images[0].url ? (
            <img
              src={getImageUrl(product.images[0].url)}
              alt={product.images[0].alt || product.name}
              className="main-image"
            />
          ) : (
            <div className="image-placeholder">No Image Available</div>
          )}
        </div>

        <div className="product-details">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-artisan-info">
            <p className="artisan-name">By {product.artisanName}</p>
            {product.artisanShopName && (
              <p className="shop-name">{product.artisanShopName}</p>
            )}
          </div>

          <p className="product-category">Category: {product.category}</p>

          <p className="product-price">Rs {product.price.toFixed(2)}</p>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-stock">
            <p>Stock: {product.stock} available</p>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="product-tags">
              {product.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

