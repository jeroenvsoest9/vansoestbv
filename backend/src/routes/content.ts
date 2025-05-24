import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Content } from '../models/Content';
import { AuthRequest, authenticate, checkRole } from '../middleware/auth';

const router = Router();

// Get all content
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, status, author, parent, limit = 10, page = 1 } = req.query;
    const content = await Content.findAll({
      type: type as string,
      status: status as string,
      author: author as string,
      parent: parent as string,
      limit: Number(limit),
      page: Number(page),
    });
    res.json(content);
  } catch (error: any) {
    console.error('Get content error:', error);
    res.status(500).json({
      error: 'Failed to get content',
      message: error.message,
    });
  }
});

// Get content by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(content);
  } catch (error: any) {
    console.error('Get content error:', error);
    res.status(500).json({
      error: 'Failed to get content',
      message: error.message,
    });
  }
});

// Create content
router.post(
  '/',
  [authenticate, checkRole(['admin', 'editor'])],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const content = await Content.create({
        ...req.body,
        author: req.user?.uid,
      });

      res.status(201).json(content);
    } catch (error: any) {
      console.error('Create content error:', error);
      res.status(500).json({
        error: 'Failed to create content',
        message: error.message,
      });
    }
  }
);

// Update content
router.put(
  '/:id',
  [authenticate, checkRole(['admin', 'editor'])],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const content = await Content.update(req.params.id, {
        ...req.body,
        updatedBy: req.user?.uid,
      });

      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }

      res.json(content);
    } catch (error: any) {
      console.error('Update content error:', error);
      res.status(500).json({
        error: 'Failed to update content',
        message: error.message,
      });
    }
  }
);

// Delete content
router.delete(
  '/:id',
  [authenticate, checkRole(['admin'])],
  async (req: AuthRequest, res: Response) => {
    try {
      const success = await Content.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Content not found' });
      }
      res.json({ message: 'Content deleted successfully' });
    } catch (error: any) {
      console.error('Delete content error:', error);
      res.status(500).json({
        error: 'Failed to delete content',
        message: error.message,
      });
    }
  }
);

// Get content by slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const content = await Content.findBySlug(req.params.slug);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res.json(content);
  } catch (error: any) {
    console.error('Get content error:', error);
    res.status(500).json({
      error: 'Failed to get content',
      message: error.message,
    });
  }
});

// Get recent content
router.get('/recent/:limit', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.params.limit) || 5;
    const content = await Content.getRecentContent(limit);
    res.json(content);
  } catch (error: any) {
    console.error('Get recent content error:', error);
    res.status(500).json({
      error: 'Failed to get recent content',
      message: error.message,
    });
  }
});

export default router;
