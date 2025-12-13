const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/database');
const Product = require('../models/Product');
const User = require('../models/User');

const userId = '693c4715ad4f3e3a24605fd8';

// Helper function to get image URL - uses existing uploads or placeholder
const getImageUrl = (filename) => {
  // Use existing uploaded images if available, otherwise use placeholder
  return `/api/uploads/${filename}`;
};

const testProducts = [
  {
    name: 'Traditional Kathputli Puppet Set',
    description: 'Authentic Rajasthani handcrafted wooden puppets featuring traditional characters. Each puppet is hand-painted with vibrant colors and intricate designs. Perfect for collectors and traditional art enthusiasts.',
    price: 2500,
    category: 'crafts',
    stock: 15,
    artisan: userId,
    artisanName: 'Parv Garg',
    artisanShopName: 'DOR',
    images: [
      {
        url: getImageUrl('image-1765558314800-825613998.png'),
        alt: 'Traditional Kathputli Puppet Set'
      }
    ],
    tags: ['puppets', 'traditional', 'handcrafted', 'wooden', 'kathputli'],
    isActive: true,
  },
  {
    name: 'Bandhani Silk Saree',
    description: 'Exquisite hand-tied Bandhani saree in vibrant colors. This traditional tie-dye technique creates beautiful patterns that are unique to Rajasthan. Made from premium silk fabric.',
    price: 8500,
    category: 'clothing',
    stock: 8,
    artisan: userId,
    artisanName: 'Parv Garg',
    artisanShopName: 'DOR',
    images: [
      {
        url: getImageUrl('image-1765635970800-360345278.png'),
        alt: 'Bandhani Silk Saree'
      }
    ],
    tags: ['saree', 'bandhani', 'silk', 'traditional', 'tie-dye'],
    isActive: true,
  },
  {
    name: 'Silver Kundan Necklace',
    description: 'Stunning handcrafted silver necklace with traditional Kundan work. Features intricate designs with semi-precious stones. A perfect blend of traditional Rajasthani craftsmanship and modern elegance.',
    price: 12000,
    category: 'jewelry',
    stock: 5,
    artisan: userId,
    artisanName: 'Parv Garg',
    artisanShopName: 'DOR',
    images: [
      {
        url: getImageUrl('image-1765636025710-312663870.jfif'),
        alt: 'Silver Kundan Necklace'
      }
    ],
    tags: ['jewelry', 'silver', 'kundan', 'necklace', 'traditional'],
    isActive: true,
  },
  {
    name: 'Blue Pottery Vase',
    description: 'Beautiful handcrafted blue pottery vase from Jaipur. This traditional art form uses a unique technique that creates stunning turquoise and blue glazed ceramics. Perfect for home decoration.',
    price: 3500,
    category: 'home',
    stock: 12,
    artisan: userId,
    artisanName: 'Parv Garg',
    artisanShopName: 'DOR',
    images: [
      {
        url: getImageUrl('image-1765636606473-348134202.jfif'),
        alt: 'Blue Pottery Vase'
      }
    ],
    tags: ['pottery', 'blue pottery', 'vase', 'home decor', 'jaipur'],
    isActive: true,
  },
  {
    name: 'Block Print Cotton Kurta',
    description: 'Comfortable and stylish cotton kurta with traditional block print designs. Hand-printed using wooden blocks with natural dyes. Perfect for casual wear with a traditional touch.',
    price: 1800,
    category: 'clothing',
    stock: 20,
    artisan: userId,
    artisanName: 'Parv Garg',
    artisanShopName: 'DOR',
    images: [
      {
        url: getImageUrl('image-1765635970800-360345278.png'),
        alt: 'Block Print Cotton Kurta'
      }
    ],
    tags: ['kurta', 'cotton', 'block print', 'traditional', 'casual'],
    isActive: true,
  },
  {
    name: 'Meenakari Silver Earrings',
    description: 'Elegant silver earrings with traditional Meenakari enamel work. Features intricate designs with vibrant colors. A beautiful piece of traditional Rajasthani jewelry.',
    price: 4500,
    category: 'jewelry',
    stock: 10,
    artisan: userId,
    artisanName: 'Parv Garg',
    artisanShopName: 'DOR',
    images: [
      {
        url: getImageUrl('image-1765636025710-312663870.jfif'),
        alt: 'Meenakari Silver Earrings'
      }
    ],
    tags: ['earrings', 'silver', 'meenakari', 'enamel', 'traditional'],
    isActive: true,
  },
  {
    name: 'Miniature Painting - Royal Court Scene',
    description: 'Exquisite miniature painting depicting a royal court scene. Hand-painted on paper using traditional techniques. A beautiful piece of Rajasthani art that captures the essence of royal heritage.',
    price: 5500,
    category: 'art',
    stock: 6,
    artisan: userId,
    artisanName: 'Parv Garg',
    artisanShopName: 'DOR',
    images: [
      {
        url: getImageUrl('image-1765558314800-825613998.png'),
        alt: 'Miniature Painting - Royal Court Scene'
      }
    ],
    tags: ['painting', 'miniature', 'art', 'traditional', 'royal'],
    isActive: true,
  },
  {
    name: 'Terracotta Decorative Plates',
    description: 'Set of handcrafted terracotta decorative plates with traditional Rajasthani motifs. Perfect for wall decoration or serving. Made using traditional techniques passed down through generations.',
    price: 2200,
    category: 'home',
    stock: 18,
    artisan: userId,
    artisanName: 'Parv Garg',
    artisanShopName: 'DOR',
    images: [
      {
        url: getImageUrl('image-1765636606473-348134202.jfif'),
        alt: 'Terracotta Decorative Plates'
      }
    ],
    tags: ['terracotta', 'plates', 'decorative', 'traditional', 'home decor'],
    isActive: true,
  },
  {
    name: 'Traditional Puppet Show Set',
    description: 'Complete puppet show set with 5 traditional characters, strings, and stage setup. Perfect for cultural performances and traditional storytelling. Includes instruction manual.',
    price: 4500,
    category: 'crafts',
    stock: 7,
    artisan: userId,
    artisanName: 'Parv Garg',
    artisanShopName: 'DOR',
    images: [
      {
        url: getImageUrl('image-1765558314800-825613998.png'),
        alt: 'Traditional Puppet Show Set'
      }
    ],
    tags: ['puppets', 'set', 'traditional', 'performance', 'kathputli'],
    isActive: true,
  },
  {
    name: 'Handwoven Rajasthani Shawl',
    description: 'Luxurious handwoven shawl with traditional patterns. Made from premium wool with intricate designs. A perfect blend of warmth and style, ideal for winters.',
    price: 4200,
    category: 'clothing',
    stock: 14,
    artisan: userId,
    artisanName: 'Parv Garg',
    artisanShopName: 'DOR',
    images: [
      {
        url: getImageUrl('image-1765635970800-360345278.png'),
        alt: 'Handwoven Rajasthani Shawl'
      }
    ],
    tags: ['shawl', 'wool', 'handwoven', 'traditional', 'winter'],
    isActive: true,
  },
];

async function seedData() {
  try {
    // Connect to database
    await connectDB();
    console.log('✓ Connected to MongoDB');

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log(`⚠ User with ID ${userId} not found. Creating test user...`);
      const testUser = new User({
        _id: userId,
        name: 'Parv Garg',
        email: 'rajesh.kumar@rajasthaniheritage.com',
        password: 'Test123456', // Will be hashed automatically
        role: 'artisan',
        shopName: 'DOR',
        bio: 'Master craftsman specializing in traditional Rajasthani arts and crafts. With over 20 years of experience, I create authentic handcrafted products that preserve our rich cultural heritage.',
        phone: '+91 9876543210',
        address: {
          street: '123 Heritage Street',
          city: 'Jaipur',
          state: 'Rajasthan',
          zipCode: '302001',
          country: 'India',
        },
      });
      await testUser.save();
      console.log('✓ Test user created');
    } else {
      console.log(`✓ User found: ${user.name}`);
    }

    // Clear ALL existing products
    const deleted = await Product.deleteMany({});
    console.log(`✓ Deleted ${deleted.deletedCount} existing products from database`);

    // Insert test products
    const products = await Product.insertMany(testProducts);
    console.log(`✓ Created ${products.length} test products`);

    // Display summary
    console.log('\n📊 Test Data Summary:');
    console.log(`   User ID: ${userId}`);
    console.log(`   Products created: ${products.length}`);
    
    const categoryCounts = {};
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    
    console.log('\n   Products by category:');
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      console.log(`   - ${cat}: ${count} products`);
    });

    console.log('\n✅ Test data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    process.exit(1);
  }
}

// Run the seed function
seedData();

