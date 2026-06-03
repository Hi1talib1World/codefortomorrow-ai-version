
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoUri = process.env.MONGO_URI;
// If no URI or pointing to localhost, fall back to in‑memory MongoDB
if (!mongoUri || mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1')) {
  console.warn('⚠️ Using MongoMemoryServer fallback (no external DB).');
  const mongod = await MongoMemoryServer.create();
  mongoUri = mongod.getUri();
}

let isConnecting = false;

/**
 * @desc    Establishes a connection to the MongoDB database.
 *          Uses the connection string stored in the MONGO_URI environment variable.
 */
const connectDB = async () => {
  if (isConnecting) return;
  if (mongoose.connection.readyState === 1) return;

  // mongoUri is defined above with fallback logic
  console.log('MONGO_URI =', mongoUri);

  if (!mongoUri) {
    const message = 'MONGO_URI is not defined in environment variables. Database connection cannot be established.';
    console.error(`❌ ${message}`);
    throw new Error(message);
  }

  isConnecting = true;
  try {
    // Attempt to connect to the database
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      maxPoolSize: 100, // Increase connection pool size to 100 (default is 10)
      minPoolSize: 10,  // Keep a minimum of 10 connections alive
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      bufferCommands: false, // Don't buffer operations when disconnected — fail fast
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error(`❌ Error connecting to MongoDB: ${errorMessage}`);
    if (errorMessage.includes('IP isn\'t whitelisted') || errorMessage.includes('Could not connect to any servers')) {
      console.log('\n' + '='.repeat(80));
      console.log('🛠️  HOW TO FIX THIS ERROR:');
      console.log('1. Log in to your MongoDB Atlas dashboard (https://cloud.mongodb.com)');
      console.log('2. Go to "Network Access" in the left sidebar.');
      console.log('3. Click "Add IP Address".');
      console.log('4. Select "Allow Access From Anywhere" (0.0.0.0/0) for development,');
      console.log('   or add your current IP address.');
      console.log('5. Click "Confirm" and wait a minute for the changes to apply.');
      console.log('='.repeat(80) + '\n');
    }
    throw error;
  } finally {
    isConnecting = false;
  }
};

export default connectDB;
