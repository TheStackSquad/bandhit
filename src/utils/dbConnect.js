

// src/utils/dbConnect.js
import mongoose from 'mongoose';

// Load environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Validate essential configuration
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Track connection status across module instances
let isConnected = false;

/**
 * Establishes and manages MongoDB connection
 * Returns a promise that resolves to the database connection
 */
async function dbConnect() {
  // Reuse existing connection if available
  if (isConnected) {
//    console.log('Using existing database connection');
    return;
  }

  try {
    // Connection options for stability and performance
    const connectionOptions = {
      bufferCommands: false,  // Disable command buffering
      maxPoolSize: 10,        // Limit concurrent connections
      serverSelectionTimeoutMS: 15000,  // Server selection timeout
      socketTimeoutMS: 15000,          // Socket operation timeout
      connectTimeoutMS: 15000,         // Initial connection timeout
    };

    // Attempt database connection
    const db = await mongoose.connect(MONGODB_URI, connectionOptions);
    
    isConnected = true;
  //  console.log('Database connected successfully');
    return db;

  } catch (error) {
    console.error('Database connection error:', error);
    throw error;  // Propagate error to caller
  }
}

// Set up connection event handlers
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  isConnected = false;  // Reset connection status on error
});

mongoose.connection.on('disconnected', () => {
//  console.log('MongoDB disconnected');
  isConnected = false;  // Reset connection status on disconnect
});

// Export the connection function for use in other modules
export default dbConnect;

