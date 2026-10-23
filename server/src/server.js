import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import resourceRoutes from './routes/resources.js';
import { requireAuth } from './middleware/auth.js';

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: allowedOrigin.split(',').map(value => value.trim()), credentials: false }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({
  status: 'ok',
  service: 'StayManager API',
  database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
}));

app.use('/api/auth', authRoutes);
app.use('/api', requireAuth, resourceRoutes);

app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
  res.status(status).json({ message: status === 500 ? 'Unexpected server error.' : error.message });
});

async function start() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || secret === 'replace-this-with-a-long-random-secret') {
    throw new Error('Set JWT_SECRET to a unique random value of at least 32 characters in server/.env.');
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required. Copy server/.env.example to server/.env and configure it.');
  await mongoose.connect(uri);
  app.listen(port, () => console.log(`StayManager API listening on http://localhost:${port}`));
}

start().catch(error => {
  console.error('Unable to start StayManager API:', error.message);
  process.exit(1);
});
