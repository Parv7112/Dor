const User = require('../models/User');
const Product = require('../models/Product');

const artisanService = {
  async getAllArtisans() {
    const artisans = await User.find({ role: 'artisan' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get product count for each artisan
    const artisansWithCount = await Promise.all(
      artisans.map(async (artisan) => {
        const productCount = await Product.countDocuments({ 
          artisan: artisan._id,
          isActive: true 
        });
        return {
          ...artisan.toObject(),
          productCount,
        };
      })
    );

    return artisansWithCount;
  },

  async getArtisanById(artisanId) {
    const artisan = await User.findById(artisanId)
      .select('-password');

    if (!artisan || artisan.role !== 'artisan') {
      throw new Error('Artisan not found');
    }

    const products = await Product.find({ 
      artisan: artisanId,
      isActive: true 
    }).select('name price images category');

    return {
      ...artisan.toObject(),
      products,
    };
  },
};

module.exports = artisanService;

