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
// Check NODE_ENV explicitly and log it
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${process.env.PORT}`);

const fs = require('fs');
// Try multiple possible paths for frontend build
const possiblePaths = [
  path.resolve(__dirname, '../frontend/dist'),  // From backend/ to root/frontend/dist
  path.resolve(process.cwd(), 'frontend/dist'), // From current working directory
  path.resolve(__dirname, '../../frontend/dist'), // Alternative path
];

let frontendPath = null;
for (const testPath of possiblePaths) {
  if (fs.existsSync(testPath) && fs.existsSync(path.join(testPath, 'index.html'))) {
    frontendPath = testPath;
    console.log(`✓ Found frontend build at: ${frontendPath}`);
    break;
  } else {
    console.log(`✗ Checked path (not found): ${testPath}`);
  }
}

if (frontendPath) {
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
  console.log(`✓ Frontend will be served for all non-API routes`);
} else {
  console.error('✗ Frontend build not found in any of the expected locations');
  console.error('✗ Checked paths:', possiblePaths);
  console.error('✗ Current working directory:', process.cwd());
  console.error('✗ __dirname:', __dirname);
  
  // Still serve API, but show error message for root
  app.get('/', (req, res) => {
    res.json({ 
      message: 'DOR API is running, but frontend build is missing',
      error: 'Frontend not built. Check build process.',
      checkedPaths: possiblePaths,
      nodeEnv: process.env.NODE_ENV
    });
  });
}

// Error handling middleware (must be after all routes)
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`DOR server is running on port ${PORT}`);
});

