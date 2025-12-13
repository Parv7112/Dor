import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import apiService, { getServerBaseUrl } from '../../services/api';
import { ROUTES } from '../../constants/routes';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.products.getMyProducts();
      setProducts(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await apiService.products.delete(productId);
      loadProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const getProductImageUrl = (image) => {
    if (!image || !image.url) return null;
    if (image.url.startsWith('http')) return image.url;
    return `${getServerBaseUrl()}${image.url}`;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
        <Link to={ROUTES.ADD_PRODUCT} className="add-product-button">
          + Add New Product
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading your products...</div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <p>You haven't added any products yet.</p>
          <Link to={ROUTES.ADD_PRODUCT} className="add-product-link">
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    {product.images && product.images.length > 0 && product.images[0].url ? (
                      <img
                        src={getProductImageUrl(product.images[0])}
                        alt={product.images[0].alt || product.name}
                        className="table-image"
                      />
                    ) : (
                      <div className="table-image-placeholder">No Image</div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td className="category-cell">{product.category}</td>
                  <td>Rs {product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`${ROUTES.EDIT_PRODUCT}/${product._id}`}
                        className="edit-button"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

