
import mongoose from 'mongoose';

/**
 * @desc    Establishes a connection to the MongoDB database.
 *          Uses the connection string stored in the MONGO_URI environment variable.
 */
const connectDB = async () => {
  try {
    // Attempt to connect to the database
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If the connection fails, log the error and terminate the process
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    // Fix: Cast process to any to access exit in environments where it might not be typed correctly.
    (process as any).exit(1); // Exit with a non-zero status code to indicate failure
  }
};

export default connectDB;
