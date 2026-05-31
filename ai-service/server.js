import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRouter from './routes/ai.routes.js';
import { startAiWorkers } from './workers/aiWorker.js';
import { startAiJobSubscriber } from './services/pubsubClient.js';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.AI_SERVICE_PORT || 5001;

app.use(cors());
app.use(express.json());
app.use('/api/ai', aiRouter);

app.get('/health', (_req, res) => {
  res.json({ service: 'ai-service', status: 'ok' });
});

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`AI microservice listening on http://localhost:${PORT}`);
    startAiWorkers();
    startAiJobSubscriber();
  });
}

startServer().catch((err) => {
  console.error('Failed to start AI service:', err);
  process.exit(1);
});
