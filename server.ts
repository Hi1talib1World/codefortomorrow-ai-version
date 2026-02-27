
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middleware/error.middleware';

// Load environment variables from .env file
dotenv.config();

// Connect to the MongoDB database
connectDB();

// Initialize the Express application
const app: express.Application = express();

// --- Core Middleware ---
// Enable Express to parse JSON formatted request bodies
app.use(express.json());

// --- API Routes ---
// Mount the authentication routes under the /api/auth prefix
app.use('/api/auth', authRoutes);
// Mount the user-related routes under the /api/users prefix
app.use('/api/users', userRoutes);


// --- Global Error Handler ---
// This middleware must be the LAST one added to the app.
// It will catch any errors that are passed to `next()` in the controllers.
app.use(errorHandler);

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
