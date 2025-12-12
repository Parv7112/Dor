import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { ROUTES } from '../../constants/routes';
import './AddProduct.css';

const AddProduct = () => {
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
  const navigate = useNavigate();

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

      // Get the uploaded URLs (backend returns /api/uploads/filename)
      const serverBaseUrl = import.meta.env.VITE_API_BASE_URL 
        ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') || ''
        : (import.meta.env.PROD ? '' : 'http://localhost:5000');
      const uploadedImages = uploadResults.map((result, index) => ({
        url: `${serverBaseUrl}${result.data.url}`,
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
    // Revoke object URL if it's a preview
    if (imagePreviews[index]) {
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

    // Convert tags string to array
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
      await apiService.products.create(productData);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <div className="product-form-card">
        <h1>Add New Product</h1>

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
                      <img src={preview} alt={`Preview ${index + 1}`} className="preview-image" />
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
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

