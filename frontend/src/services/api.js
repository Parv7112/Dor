// Use environment variable if set, otherwise use relative URL in production or localhost in development
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // In production (when served from same origin), use relative URL
  // In development, use localhost
  return import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Get server base URL (without /api) for constructing full URLs (e.g., for images)
export const getServerBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace('/api', '') || '';
  }
  // In production (when served from same origin), use empty string for relative URLs
  // This allows relative URLs to work correctly when frontend and backend are on same domain
  // In development, use localhost
  if (import.meta.env.PROD) {
    // In production, use relative URLs (empty string) so they work with same-origin serving
    return '';
  }
  return 'http://localhost:5000';
};

// Normalize image URL - extract relative path if it's a full URL
export const normalizeImageUrl = (url) => {
  if (!url) return null;
  // If it's already a relative path, return as is
  if (url.startsWith('/api/uploads/')) return url;
  // If it's a full URL, extract the relative path
  if (url.startsWith('http')) {
    const match = url.match(/\/api\/uploads\/[^/]+$/);
    return match ? match[0] : url;
  }
  return url;
};

// Get full image URL for display (handles both relative and absolute URLs)
// This ensures images work in both local and deployed environments
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If already a full URL (http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // For relative paths, construct URL based on environment
  const serverBaseUrl = getServerBaseUrl();
  
  // Ensure path starts with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // In production, serverBaseUrl is empty string, so return relative path
  // In development, prepend localhost
  if (serverBaseUrl) {
    return `${serverBaseUrl}${normalizedPath}`;
  }
  
  // In production, return relative path (works when frontend and backend are same origin)
  return normalizedPath;
};

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Response data
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// API service methods
export const apiService = {
  // GET request
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),

  // POST request
  post: (endpoint, data) => 
    apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // PUT request
  put: (endpoint, data) =>
    apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // DELETE request
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),

  // Auth endpoints
  auth: {
    register: (userData) => apiService.post('/auth/register', userData),
    login: (email, password) => apiService.post('/auth/login', { email, password }),
    getMe: () => apiService.get('/auth/me'),
  },

  // Product endpoints
  products: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiService.get(`/products${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id) => apiService.get(`/products/${id}`),
    create: (productData) => apiService.post('/products', productData),
    update: (id, productData) => apiService.put(`/products/${id}`, productData),
    delete: (id) => apiService.delete(`/products/${id}`),
    getMyProducts: () => apiService.get('/products/artisan/my-products'),
  },

  // Artisan endpoints
  artisans: {
    getAll: () => apiService.get('/artisans'),
    getById: (id) => apiService.get(`/artisans/${id}`),
  },

  // Upload endpoints
  upload: {
    image: async (file, requireAuth = false) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const token = getToken();
      const url = `${API_BASE_URL}/upload/image`;
      
      const headers = {};
      // Only add auth header if authentication is required and token exists
      if (requireAuth && token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      return data;
    },
    images: async (files) => {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });
      
      const token = getToken();
      const url = `${API_BASE_URL}/upload/images`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      return data;
    },
  },
};

export default apiService;

