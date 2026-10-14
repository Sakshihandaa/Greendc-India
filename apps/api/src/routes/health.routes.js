import { Router } from 'express';

const router = Router();
const startTime = Date.now();

/**
 * GET /api/health
 * Health check endpoint indicating service availability and uptime.
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'greendc-india-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000)
  });
});

export default router;
