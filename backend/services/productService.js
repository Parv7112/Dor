const Product = require('../models/Product');
const User = require('../models/User');

const productService = {
  async getAllProducts(filters = {}) {
    const { category, search, artisan, page = 1, limit = 12 } = filters;
    
    const query = { isActive: true };
    
    if (category) {
      query.category = new RegExp(category, 'i');
    }
    
    if (artisan) {
      query.artisan = artisan;
    }
    
    if (search) {
      // Use regex for partial matching in name, description, and tags
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { tags: { $in: [searchRegex] } },
        { artisanName: searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('artisan', 'name shopName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getProductById(productId) {
    const product = await Product.findById(productId)
      .populate('artisan', 'name shopName bio');
    
    if (!product || !product.isActive) {
      throw new Error('Product not found');
    }
    
    return product;
  },

  async createProduct(productData, artisanId) {
    const artisan = await User.findById(artisanId);
    if (!artisan) {
      throw new Error('Artisan not found');
    }

    const product = await Product.create({
      ...productData,
      artisan: artisanId,
      artisanName: artisan.name,
      artisanShopName: artisan.shopName,
    });

    return await Product.findById(product._id).populate('artisan', 'name shopName');
  },

  async updateProduct(productId, productData, artisanId) {
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if user owns the product
    if (product.artisan.toString() !== artisanId.toString()) {
      throw new Error('Not authorized to update this product');
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productData,
      {
        new: true,
        runValidators: true,
      }
    ).populate('artisan', 'name shopName');

    return updatedProduct;
  },

  async deleteProduct(productId, artisanId) {
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if user owns the product
    if (product.artisan.toString() !== artisanId.toString()) {
      throw new Error('Not authorized to delete this product');
    }

    await Product.findByIdAndDelete(productId);
    return { message: 'Product deleted successfully' };
  },

  async getProductsByArtisan(artisanId) {
    const products = await Product.find({ artisan: artisanId })
      .sort({ createdAt: -1 });
    return products;
  },
};

module.exports = productService;

