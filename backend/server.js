const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/database');
const { errorHandler } = require('./middlewares/errorHandler');
const { notFound } = require('./middlewares/notFound');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (non-blocking)
connectDB().catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

// Middleware
// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || true  // Allow all in production if FRONTEND_URL not set (since we serve frontend from same server)
    : true,  // Allow all in development
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes (must come before frontend serving)
app.use('/api', require('./routes/index'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ message: 'Welcome to DOR API', status: 'ok' });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  // When running from backend directory, go up one level to root, then into frontend/dist
  const frontendPath = path.resolve(__dirname, '../frontend/dist');
  
  console.log(`Looking for frontend build at: ${frontendPath}`);
  console.log(`Current __dirname: ${__dirname}`);
  
  // Check if frontend build exists
  if (fs.existsSync(frontendPath)) {
    console.log(`✓ Serving frontend from: ${frontendPath}`);
    
    // Verify index.html exists
    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log(`✓ Found index.html at: ${indexPath}`);
    } else {
      console.warn(`⚠ index.html not found at: ${indexPath}`);
    }
    
    // Serve static files from frontend build
    app.use(express.static(frontendPath));
    
    // Serve index.html for all non-API routes (SPA routing)
    // This must be after API routes but before error handlers
    app.get('*', (req, res) => {
      // Don't serve frontend for API routes (shouldn't reach here due to route order, but safety check)
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ message: 'API route not found' });
      }
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  } else {
    console.error(`✗ Frontend build not found at: ${frontendPath}`);
    console.error('✗ Make sure frontend is built before starting the server');
    console.error('✗ Expected structure: root/frontend/dist/');
    app.get('/', (req, res) => {
      res.json({ 
        message: 'DOR API is running, but frontend build is missing',
        error: 'Frontend not built. Check build process.',
        expectedPath: frontendPath
      });
    });
  }
} else {
  // Development: return API message for root
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to DOR API - Development Mode' });
  });
}

// Error handling middleware (must be after all routes)
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`DOR server is running on port ${PORT}`);
});

