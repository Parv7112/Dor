const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Route modules
router.use('/auth', require('./authRoutes'));
router.use('/products', require('./productRoutes'));
router.use('/artisans', require('./artisanRoutes'));
router.use('/upload', require('./uploadRoutes'));

module.exports = router;

