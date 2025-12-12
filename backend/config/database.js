const mongoose = require('mongoose');

let retryCount = 0;
let isConnecting = false;
let isConnected = false;
const MAX_RETRIES = 10;
const RETRY_DELAY = 5000; // 5 seconds

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  console.log(mongoURI, 'mongoURI');
  // Configure mongoose connection options
  mongoose.set('strictQuery', false);
  
  // Set up event handlers once
  if (!mongoose.connection.listeners('error').length) {
    mongoose.connection.on('error', (err) => {
      if (isConnected) {
        console.error('MongoDB connection error:', err.message);
      }
    });

    mongoose.connection.on('disconnected', () => {
      if (isConnected) {
        isConnected = false;
        console.log('MongoDB disconnected. Attempting to reconnect...');
        if (!isConnecting) {
          retryCount = 0;
          connectWithRetry();
        }
      }
    });

    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      retryCount = 0;
      console.log('✓ MongoDB reconnected');
    });
  }

  const connectWithRetry = async () => {
    if (isConnecting) return;
    
    isConnecting = true;
    
    try {
      // Close existing connection if any
      if (mongoose.connection.readyState === 1) {
        isConnected = true;
        isConnecting = false;
        return true;
      }

      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      const host = conn.connection.host || 'localhost';
      console.log(`✓ MongoDB Connected: ${host}`);
      
      isConnected = true;
      retryCount = 0;
      isConnecting = false;
      
      return true;
    } catch (error) {
      isConnecting = false;
      retryCount++;
      
      if (retryCount < MAX_RETRIES) {
        console.log(`✗ MongoDB connection attempt ${retryCount} failed. Retrying in ${RETRY_DELAY / 1000} seconds...`);
        console.log(`  Error: ${error.message}`);
        setTimeout(() => {
          if (!isConnected) {
            connectWithRetry();
          }
        }, RETRY_DELAY);
      } else {
        console.error(`✗ Failed to connect to MongoDB after ${MAX_RETRIES} attempts`);
        console.error('Please make sure MongoDB is running and accessible.');
        console.error('You can start MongoDB with: mongod (or your system service)');
        console.error('Or use MongoDB Atlas: Update MONGODB_URI in your .env file');
        console.error('Server will continue running. MongoDB connection will retry when available.');
        // Don't exit - allow server to continue running
        return false;
      }
    }
  };

  // Graceful shutdown
  if (!process.listenerCount('SIGINT')) {
    process.on('SIGINT', async () => {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to app termination');
      }
      process.exit(0);
    });
  }

  // Initial connection attempt
  return await connectWithRetry();
};

module.exports = connectDB;

