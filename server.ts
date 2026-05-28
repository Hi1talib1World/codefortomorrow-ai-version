
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import quizRoutes from './routes/quiz.routes';
import activityRoutes from './routes/activity.routes';
import messageRoutes from './routes/message.routes';
import aiRoutes from './routes/ai.routes';
import openSourceRoutes from './routes/opensource.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middleware/error.middleware';

// Load environment variables from .env file
dotenv.config();

// Safely resolve __dirname in environments where import.meta.url might be malformed (e.g. tsx with spaces in paths)
const _filename = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url.replace(/ /g, '%20'));
const _dirname = path.dirname(_filename);

async function startServer() {
  // Connect to the MongoDB database
  // We don't await it here to avoid blocking server startup if DB is down or unconfigured
  connectDB();

  // Initialize the Express application
  const app: express.Application = express();

  // Enable trust proxy for correct IP tracking behind reverse proxies (like Cloudflare or Nginx)
  app.set('trust proxy', 1);

  // Global rate limiter to protect the server from abuse (150 requests per 15 minutes per IP)
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  });

  // Stricter rate limiter for authentication routes (15 attempts per 15 minutes per IP)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login or registration attempts, please try again after 15 minutes',
  });

  // --- Core Middleware ---
  // Enable response compression (gzip/deflate)
  app.use(compression());
  // Enable Express to parse JSON formatted request bodies
  app.use(express.json());
  // Enable Express to parse cookies
  app.use(cookieParser());

  // Apply rate limiters
  app.use('/api', globalLimiter);
  app.use('/api/auth', authLimiter);

  // --- API Routes ---
  // Health check for database connection
  app.get('/api/health', async (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.json({
      status: isConnected ? 'ok' : 'error',
      database: isConnected ? 'connected' : 'disconnected'
    });
  });

  // Retry database connection
  app.post('/api/health/retry', async (req, res) => {
    await connectDB();
    const isConnected = mongoose.connection.readyState === 1;
    res.json({
      status: isConnected ? 'ok' : 'error',
      database: isConnected ? 'connected' : 'disconnected'
    });
  });

  // Mount the authentication routes under the /api/auth prefix
  app.use('/api/auth', authRoutes);
  // Mount the user-related routes under the /api/users prefix
  app.use('/api/users', userRoutes);
  // Mount the quiz-related routes under the /api/quizzes prefix
  app.use('/api/quizzes', quizRoutes);
  // Mount the activity-related routes under the /api/activities prefix
  app.use('/api/activities', activityRoutes);
  // Mount the message-related routes under the /api/messages prefix
  app.use('/api/messages', messageRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/opensource', openSourceRoutes);
  app.use('/api/admin', adminRoutes);

  // --- Vite Middleware or Static Files ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      configFile: false, // Explicitly tell Vite NOT to load the config file dynamically
      plugins: [
        (await import('@vitejs/plugin-react')).default(),
        (await import('@tailwindcss/vite')).default(),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
        'process.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || ''),
      },
      resolve: {
        alias: {
          '@': path.resolve(_dirname, '.'),
        }
      }
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built static files with 1 day cache-control headers
    const distPath = path.resolve(_dirname, 'dist');
    app.use(express.static(distPath, {
      maxAge: '1d',
      etag: true
    }));

    // Fallback to index.html for SPA routing
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // --- Global Error Handler ---
  // This middleware must be the LAST one added to the app.
  app.use(errorHandler);

  // --- Server Initialization ---
  const PORT = 3000;

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
