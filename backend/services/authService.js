const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const authService = {
  async register(userData) {
    const { name, email, password, shopName, bio, phone, role, image } = userData;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      shopName,
      bio,
      phone,
      role: role || 'artisan',
      image,
    });

    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopName: user.shopName,
        bio: user.bio,
        phone: user.phone,
        image: user.image,
      },
    };
  },

  async login(email, password) {
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopName: user.shopName,
        bio: user.bio,
        phone: user.phone,
        image: user.image,
      },
    };
  },

  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
};

module.exports = authService;

