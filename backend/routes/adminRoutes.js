const express = require('express');
const router = express.Router();
const seedData = require('../scripts/seedTestData');

// Admin route to seed database
// WARNING: This will delete all existing products and create new ones
// Use with caution! Consider adding authentication in production
router.post('/seed', async (req, res) => {
  await handleSeed(req, res);
});

// Also allow GET for easier browser access
router.get('/seed', async (req, res) => {
  await handleSeed(req, res);
});

async function handleSeed(req, res) {
  try {
    // Optional: Add a simple secret check (set SEED_SECRET in environment)
    const secret = req.query.secret || req.body.secret;
    const expectedSecret = process.env.SEED_SECRET || 'CHANGE_THIS_SECRET';
    
    if (secret !== expectedSecret) {
      return res.status(401).json({ 
        error: 'Unauthorized. Provide correct secret in query or body.',
        hint: 'Add ?secret=YOUR_SECRET to the URL or in request body'
      });
    }

    console.log('Starting seed process...');
    
    // Run the seed function
    const result = await seedData();
    
    res.json({ 
      success: true, 
      message: 'Database seeded successfully!',
      ...result
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ 
      error: 'Failed to seed database', 
      message: error.message 
    });
  }
});

module.exports = router;

