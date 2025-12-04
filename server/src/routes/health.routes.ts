import { Router } from 'express';
import { sendSuccess } from '../utils/responseHandler';

const router = Router();

/**
 * Health check endpoint
 * GET /health
 */
router.get('/', (_req, res) => {
  return sendSuccess({
    res,
    message: 'Service is running 🚀',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }
  });
});

export default router;
