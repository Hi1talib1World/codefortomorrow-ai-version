import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createServer as createViteServer } from 'vite';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import quizRoutes from './routes/quiz.routes';
import activityRoutes from './routes/activity.routes';
import messageRoutes from './routes/message.routes';
import openSourceRoutes from './routes/opensource.routes';
import adminRoutes from './routes/admin.routes';
import missionsRoutes from './routes/missions.routes';
import learningEventsRoutes from './routes/learningEvents.routes';
import agentsRoutes from './routes/agents.routes';
import { errorHandler } from './middleware/error.middleware';

// Load environment variables from .env file
dotenv.config();

// Safely resolve __dirname in environments where import.meta.url might be malformed (e.g. tsx with spaces in paths)
const _filename = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url.replace(/ /g, '%20'));
const _dirname = path.dirname(_filename);

async function startServer() {
  // Connect to the MongoDB database and block startup if the database cannot be reached.
  await connectDB();

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
    try {
      fs.appendFileSync('debug-requests.log', `${new Date().toISOString()} ${routingLine}\n`);
    } catch (err) {
      console.error('Failed to write debug-requests.log:', err);
    }
    
    // Attach subdomain to the request object for downstream routes/controllers if needed
    (req as any).subdomain = subdomain;
    
    next();
  });

  // Enable trust proxy for correct IP tracking behind reverse proxies (like Cloudflare or Nginx)
  app.set('trust proxy', 1);

  // Global rate limiter to protect the server from abuse (150 requests per 15 minutes per IP)
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  });

  // --- Core Middleware ---
  // Enable response compression (gzip/deflate)
  app.use(compression());
  // Enable Express to parse JSON formatted request bodies
  app.use(express.json());
  // Enable Express to parse cookies
  app.use(cookieParser());
  // Enable CORS with credentials support
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));

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
      "script-src-elem 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.googleusercontent.com https://*.posthog.com https://*.cloudinary.com https://pagead2.googlesyndication.com",
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
  app.use('/api', agentsRoutes);

  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5001';
  app.use(
    '/api/ai',
    createProxyMiddleware({
      target: aiServiceUrl,
      changeOrigin: true,
      pathRewrite: { '^/api/ai': '' },
      onError: (err, _req, res) => {
        console.error('AI proxy error:', err);
        res.status(502).json({ message: 'AI service is unavailable' });
      }
    })
  );

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
