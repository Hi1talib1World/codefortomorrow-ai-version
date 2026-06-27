import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import connectDB from './src/services/db/db';
import authRoutes from './src/api/auth/auth.routes';
import userRoutes from './src/api/users/user.routes';
import paymentRoutes from './src/api/users/payment.routes';
import quizRoutes from './src/api/courses/quiz.routes';
import activityRoutes from './src/api/courses/activity.routes';
import messageRoutes from './src/api/messages/message.routes';
import openSourceRoutes from './src/api/courses/opensource.routes';
import adminRoutes from './src/api/admin/admin.routes';
import missionsRoutes from './src/api/courses/missions.routes';
import learningEventsRoutes from './src/api/courses/learningEvents.routes';
import agentsRoutes from './src/api/ai/agents.routes';
import aiRoutes from './src/api/ai/ai.routes';
import notificationRoutes from './src/api/notifications/notification.routes';
import postRoutes from './src/api/posts/post.routes';
import { errorHandler } from './src/core/permissions/error.middleware';
import { initEventListeners } from './src/events/listeners/eventListeners';

// Load environment variables from .env file
dotenv.config();

// Safely resolve __dirname in environments where import.meta.url might be malformed (e.g. tsx with spaces in paths)
const _filename = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url.replace(/ /g, '%20'));
const _dirname = path.dirname(_filename);

const parseAllowedOrigins = () => {
  const configuredOrigins = (process.env.CLIENT_ORIGIN || process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configuredOrigins.length > 0) {
    return configuredOrigins;
  }

  return process.env.NODE_ENV === 'production'
    ? []
    : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'];
};

async function startServer() {
  // Connect to the MongoDB database and block startup if the database cannot be reached.
  await connectDB();

  // Initialize Event Bus listeners
  initEventListeners();

  // Initialize the Express application
  const app: express.Application = express();

  // --- Subdomain Routing Middleware ---
  app.use((req, res, next) => {
    const host = req.headers.host || '';
    const hostname = host.split(':')[0];
    
    // Identify subdomain under our local target palycofoto.club
    let subdomain = '';
    if (hostname.endsWith('.palycofoto.club')) {
      subdomain = hostname.replace('.palycofoto.club', '');
    }
    
    // Log host and path routing information
    const routingLine = `[Host Routing] Host: ${host} | Subdomain: ${subdomain || 'none'} | Path: ${req.path}`;
    console.log(routingLine);
    
    // Attach subdomain to the request object for downstream routes/controllers if needed
    (req as any).subdomain = subdomain;
    
    next();
  });

  // Enable trust proxy for correct IP tracking behind reverse proxies (like Cloudflare or Nginx)
  app.set('trust proxy', 1);

  // Global rate limiter to protect the server from abuse (150 requests per 15 minutes per IP)
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 150 : 10000, // relaxed limit in development
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  });

  // --- Core Middleware ---
  // Enable response compression (gzip/deflate)
  app.use(compression());
  // Enable Express to parse JSON formatted request bodies
  app.use(express.json({
    verify: (req: any, res, buf) => {
      if (req.originalUrl && req.originalUrl.startsWith('/api/payments/webhook')) {
        req.rawBody = buf;
      }
    }
  }));
  // Enable Express to parse cookies
  app.use(cookieParser());
  // Enable CORS with credentials support.
  // Automatically allows same-origin requests (frontend served from same host) and explicit CLIENT_ORIGINs.
  app.use(cors((req: any, callback: any) => {
    const origin = req.header('Origin');
    const allowedOrigins = parseAllowedOrigins();
    const host = req.get('host');
    
    // Check if same-origin (e.g. Origin is https://host or http://host)
    const isSameOrigin = origin && (origin === `https://${host}` || origin === `http://${host}`);
    
    if (!origin || isSameOrigin || allowedOrigins.includes(origin)) {
      callback(null, { origin: true, credentials: true });
    } else {
      callback(null, { origin: false });
    }
  }));

  // --- HTTP Security Headers ---
  // - Strict-Transport-Security (HSTS): Yes
  // - Content-Security-Policy (CSP): Yes
  // - X-Content-Type-Options: Yes (nosniff)
  // - X-Frame-Options: Yes (SAMEORIGIN)
  // - Referrer-Policy: Yes (strict-origin-when-cross-origin)
  // - Permissions-Policy: Yes (camera=(), microphone=(), geolocation=())
  // - Cross-Origin-Opener-Policy (COOP): Yes (same-origin)
  // - Cross-Origin-Resource-Policy (CORP): Yes (same-origin)
  // - Cross-Origin-Embedder-Policy (COEP): Yes (credentialless)
  app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://*.posthog.com https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://www.gstatic.com",
      "script-src-elem 'self' 'unsafe-inline' https://*.posthog.com https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.googleusercontent.com https://*.posthog.com https://*.cloudinary.com https://pagead2.googlesyndication.com https://ui-avatars.com https://via.placeholder.com",
      "connect-src 'self' ws: wss: https://*.googleapis.com https://*.firebaseio.com https://*.posthog.com https://*.heygen.com wss://*.heygen.com https://ep1.adtrafficquality.google",
      "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com https://*.heygen.com https://googleads.g.doubleclick.net",
      "media-src 'self' blob: data: https://*.heygen.com https://*.cloudinary.com",
      "object-src 'none'"
    ].join('; ');

    res.setHeader('Content-Security-Policy', cspDirectives);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');

    next();
  });

  // Apply rate limiters
  app.use('/api', globalLimiter);

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

  // Serve security.txt for vulnerability disclosures
  const serveSecurityTxt = (req: express.Request, res: express.Response) => {
    res.type('text/plain');
    res.send(
      "Contact: mailto:security@codefortomorrow.org\n" +
      "Expires: 2027-05-28T00:00:00.000Z\n" +
      "Preferred-Languages: en, fr, ar\n"
    );
  };
  app.get('/.well-known/security.txt', serveSecurityTxt);
  app.get('/security.txt', serveSecurityTxt);

  // Mount the authentication routes under the /api/auth prefix
  app.use('/api/auth', authRoutes);
  // Mount the user-related routes under the /api/users prefix
  app.use('/api/users', userRoutes);
  // Mount the payment-related routes under the /api/payments prefix
  app.use('/api/payments', paymentRoutes);
  // Mount the quiz-related routes under the /api/quizzes prefix
  app.use('/api/quizzes', quizRoutes);
  // Mount the activity-related routes under the /api/activities prefix
  app.use('/api/activities', activityRoutes);
  // Mount the message-related routes under the /api/messages prefix
  app.use('/api/messages', messageRoutes);
  app.use('/api/opensource', openSourceRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', missionsRoutes);
  app.use('/api', learningEventsRoutes);
  app.use('/api/agents', agentsRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/posts', postRoutes);

  // --- Vite Middleware or Static Files ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      configFile: false, // Explicitly tell Vite NOT to load the config file dynamically
      publicDir: path.resolve(_dirname, 'public'),
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

    // Fallback to index.html for SPA routing.
    app.use((req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // --- Global Error Handler ---
  // This middleware must be the LAST one added to the app.
  app.use(errorHandler);

  // --- Server Initialization ---
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
