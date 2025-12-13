import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiService, { getServerBaseUrl, normalizeImageUrl, getImageUrl } from '../../services/api';
import { ROUTES } from '../../constants/routes';
import './AddProduct.css';

const EditProduct = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [],
    tags: '',
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoadingProduct(true);
      const response = await apiService.products.getById(id);
      const product = response.data;
      
      // Normalize existing images to relative paths and set previews
      const normalizedImages = (product.images && product.images.length > 0 
        ? product.images 
        : []).map(img => ({
        ...img,
        url: normalizeImageUrl(img.url), // Normalize to relative path
      }));
      
      // Set previews for existing images - construct full URLs for display
      setImagePreviews(normalizedImages.map(img => getImageUrl(img.url)));
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
        images: normalizedImages, // Store normalized relative paths
        tags: product.tags ? product.tags.join(', ') : '',
      });
    } catch (err) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setError('');
    setUploadingImages(true);

    try {
      // Create previews immediately
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...previews]);

      // Upload images (auth required for product uploads)
      const uploadPromises = files.map((file) => apiService.upload.image(file, true));
      const uploadResults = await Promise.all(uploadPromises);

      // Store only relative paths in database (backend returns /api/uploads/filename)
      // Full URLs will be constructed when displaying images
      const uploadedImages = uploadResults.map((result, index) => ({
        url: normalizeImageUrl(result.data.url), // Normalize to relative path: /api/uploads/filename
        alt: files[index].name.split('.')[0] || `Image ${index + 1}`,
      }));

      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedImages],
      });
    } catch (err) {
      setError(err.message || 'Failed to upload images');
      // Remove failed previews
      setImagePreviews(imagePreviews.slice(0, imagePreviews.length));
    } finally {
      setUploadingImages(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    // Revoke object URL if it's a preview (newly uploaded)
    if (imagePreviews[index] && imagePreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[index]);
    }

    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const tagsArray = formData.tags
      ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];

    // Use uploaded images
    const validImages = formData.images.filter((img) => img.url && img.url.trim() !== '');

    if (validImages.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      images: validImages,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
    };

    try {
      setLoading(true);
      await apiService.products.update(id, productData);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return <div className="loading">Loading product...</div>;
  }

  return (
    <div className="product-form-container">
      <div className="product-form-card">
        <h1>Update Product</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Enter product description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (Rs) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="jewelry">Jewelry</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home Decor</option>
              <option value="art">Art</option>
              <option value="crafts">Crafts</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="images">Product Images *</label>
            <div className="image-upload-section">
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  disabled={uploadingImages}
                  className="file-input"
                />
                <label htmlFor="images" className="file-input-label">
                  {uploadingImages ? 'Uploading...' : '📷 Select Images'}
                </label>
              </div>
              <p className="file-input-hint">You can select multiple images (Max 5MB each)</p>
              
              {imagePreviews.length > 0 && (
                <div className="image-previews">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={formData.images[index]?.alt || `Preview ${index + 1}`} className="preview-image" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="remove-image-button"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="cancel-button"
            >
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;

