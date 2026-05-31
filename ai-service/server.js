import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

import logger from './utils/logger.js';
import requestLogger from './middleware/logger.middleware.js';
import errorHandler from './middleware/error.middleware.js';
import requestTimeout from './middleware/timeout.middleware.js';

import aiRouter from './routes/ai.routes.js';
import { startAiWorkers } from './workers/aiWorker.js';
import { startAiJobSubscriber } from './services/pubsubClient.js';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.AI_SERVICE_PORT || 5001;

// Global rate limiting (100 requests per 15 minutes per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests, please try again after 15 minutes',
      code: 'TOO_MANY_REQUESTS'
    }
  }
});

// Middlewares
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(requestTimeout(30000));
app.use(requestLogger);
app.use(globalLimiter);

// AI Router mount
app.use('/api/ai', aiRouter);

// Health Check Endpoints
app.get('/health', (_req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: isDbConnected ? 'ok' : 'degraded',
    uptime: process.uptime(),
    dependencies: {
      db: isDbConnected ? 'up' : 'down',
      ai: 'ok'
    }
  });
});

app.get('/health/db', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const isConnected = dbState === 1;
  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? 'ok' : 'down',
    connectionState: states[dbState] || 'unknown',
  });
});

app.get('/health/ai', async (_req, res) => {
  const redisUrl = process.env.REDIS_URL;
  let redisStatus = 'disabled';
  if (redisUrl) {
    try {
      const client = new IORedis(redisUrl, { maxRetriesPerRequest: 1, enableOfflineQueue: false });
      await client.ping();
      redisStatus = 'connected';
      client.disconnect();
    } catch (err) {
      redisStatus = 'error: ' + err.message;
    }
  }
  const isOk = !redisUrl || redisStatus === 'connected';
  res.status(isOk ? 200 : 503).json({
    status: isOk ? 'ok' : 'degraded',
    redis: redisStatus,
  });
});

// Centralized error handler (must be last middleware)
app.use(errorHandler);

let server;

async function startServer() {
  logger.info('Starting AI microservice server...');
  await connectDB();
  logger.info('Database connection established.');

  server = app.listen(PORT, () => {
    logger.info(`AI microservice listening on http://localhost:${PORT}`);
    startAiWorkers();
    startAiJobSubscriber();
  });
}

// Global Exception/Rejection Handlers
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception details:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection details:', { reason });
  gracefulShutdown('unhandledRejection');
});

// Graceful Shutdown Handler
let isShuttingDown = false;
async function gracefulShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  logger.warn(`Shutdown signal received (${signal}). Closing system resources...`);

  const forceExitTimeout = setTimeout(() => {
    logger.error('Forcing shutdown due to timeout.');
    process.exit(1);
  }, 10000);

  try {
    if (server) {
      await new Promise((resolve) => {
        server.close(() => {
          logger.info('HTTP server closed.');
          resolve();
        });
      });
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      logger.info('MongoDB connection closed.');
    }

    logger.info('Graceful shutdown completed successfully.');
    clearTimeout(forceExitTimeout);
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}

// Listen to termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer().catch((err) => {
  logger.error('Failed to start AI service:', err);
  process.exit(1);
});
