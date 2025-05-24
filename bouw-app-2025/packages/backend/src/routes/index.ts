import { Express } from 'express';
import { Router } from 'express';
import { quoteRoutes } from './quote.routes';
import { projectRoutes } from './project.routes';
import { authRoutes } from './auth.routes';

export const setupRoutes = (app: Express) => {
  const router = Router();

  // Health check route
  router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // API routes
  router.use('/quotes', quoteRoutes);
  router.use('/projects', projectRoutes);
  router.use('/auth', authRoutes);

  // Apply routes to app
  app.use('/api', router);
}; 