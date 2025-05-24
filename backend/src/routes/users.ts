import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import { AuthRequest, authenticate, checkRole } from '../middleware/auth';

const router = Router();

// Get all users (admin only)
router.get('/', [authenticate, checkRole(['admin'])], async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to get users',
      message: error.message,
    });
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user',
      message: error.message,
    });
  }
});

// Update user
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Only allow users to update their own profile unless they're an admin
    if (req.user?.uid !== req.params.id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this user' });
    }

    const user = await User.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Failed to update user',
      message: error.message,
    });
  }
});

// Delete user (admin only)
router.delete(
  '/:id',
  [authenticate, checkRole(['admin'])],
  async (req: AuthRequest, res: Response) => {
    try {
      const success = await User.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
      console.error('Delete user error:', error);
      res.status(500).json({
        error: 'Failed to delete user',
        message: error.message,
      });
    }
  }
);

export default router;
