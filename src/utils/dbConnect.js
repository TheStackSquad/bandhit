//src/utils/dbConnect.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
// console.log(MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in the environment variables');
}

let isConnected = false;

async function dbConnect() {
  if (isConnected) {
  //  console.log('Using existing database connection');
    return;
  }

  try {
  //  console.log('Connecting to MongoDB with URI:', MONGODB_URI);

    const connectionOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    };

    await mongoose.connect(MONGODB_URI, connectionOptions);
    isConnected = true;
  //  console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
//  console.log('MongoDB disconnected');
  isConnected = false;
});

export default dbConnect;
