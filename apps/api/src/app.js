import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.routes.js';
import simulationsRouter from './routes/simulations.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // Basic security and parsing middleware
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
  }));

  // Limit JSON body size to prevent payload abuse
  app.use(express.json({ limit: '100kb' }));

  // API Routes
  app.use('/api', healthRouter);
  app.use('/api/simulations', simulationsRouter);

  // Fallback 404 handler
  app.use(notFoundHandler);

  // Centralized error handler
  app.use(errorHandler);

  return app;
}

const app = createApp();
export default app;
