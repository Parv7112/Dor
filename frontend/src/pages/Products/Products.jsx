import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    page: 1,
  });

  useEffect(() => {
    loadProducts();
  }, [filters.category, filters.page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.products.getAll(filters);
      setProducts(response.data.products || []);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>All Products</h1>
        <p>Discover unique handmade products from talented artisans</p>
      </div>

      <div className="products-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>

        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
          className="category-filter"
        >
          <option value="">All Categories</option>
          <option value="jewelry">Jewelry</option>
          <option value="clothing">Clothing</option>
          <option value="home">Home Decor</option>
          <option value="art">Art</option>
          <option value="crafts">Crafts</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="no-products">No products found.</div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="product-card"
            >
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.name}
                  className="product-image"
                />
              ) : (
                <div className="product-image-placeholder">No Image</div>
              )}
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-artisan">By {product.artisanName}</p>
                <p className="product-category">{product.category}</p>
                <p className="product-price">Rs {product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

