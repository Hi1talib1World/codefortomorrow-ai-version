
import mongoose from 'mongoose';

let isConnecting = false;

/**
 * @desc    Establishes a connection to the MongoDB database.
 *          Uses the connection string stored in the MONGO_URI environment variable.
 */
const connectDB = async () => {
  if (isConnecting) return;
  if (mongoose.connection.readyState === 1) return;

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn('⚠️ MONGO_URI is not defined in environment variables. Database connection skipped.');
    return;
  }

  isConnecting = true;
  try {
    // Attempt to connect to the database
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If the connection fails, log the error but don't exit the process
    // to allow the dev server to start and show instructions to the user.
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
  } finally {
    isConnecting = false;
  }
};

export default connectDB;
