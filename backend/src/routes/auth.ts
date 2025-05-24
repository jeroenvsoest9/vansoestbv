import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth, db } from '../config/database';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest, authenticate, checkRole } from '../middleware/auth';

const router = Router();

// Register new user
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;

      // Create user in Firebase Auth
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Generate JWT token
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      const token = jwt.sign(
        { uid: user.uid, email: user.email },
        secret,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          uid: user.uid,
          email: user.email,
          name
        }
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({
        error: 'Registration failed',
        message: error.message
      });
    }
  }
);

// Login user
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Sign in with Firebase Auth
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      // Generate JWT token
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      const token = jwt.sign(
        { uid: user.uid, email: user.email },
        secret,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          uid: user.uid,
          email: user.email,
          name: userData?.name,
          role: userData?.role
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(401).json({
        error: 'Login failed',
        message: error.message
      });
    }
  }
);

// Logout user
router.post('/logout', async (req: Request, res: Response) => {
  try {
    await signOut(auth);
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: error.message
    });
  }
});

// Reset password
router.post('/reset-password',
  [
    body('email').isEmail().normalizeEmail()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;
      await sendPasswordResetEmail(auth, email);

      res.json({ message: 'Password reset email sent' });
    } catch (error: any) {
      console.error('Password reset error:', error);
      res.status(400).json({
        error: 'Password reset failed',
        message: error.message
      });
    }
  }
);

// Update password
router.post('/update-password',
  [
    body('newPassword').isLength({ min: 6 })
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { newPassword } = req.body;
      const user = auth.currentUser;

      if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      await updatePassword(user, newPassword);

      res.json({ message: 'Password updated successfully' });
    } catch (error: any) {
      console.error('Password update error:', error);
      res.status(400).json({
        error: 'Password update failed',
        message: error.message
      });
    }
  }
);

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.uid || '');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user',
      message: error.message
    });
  }
});

// Update user profile
router.put('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const updates = req.body;
    const user = await User.update(req.user?.uid || '', updates);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Failed to update user',
      message: error.message
    });
  }
});

// Get all users (admin only)
router.get('/users', [authenticate, checkRole(['admin'])], async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error: any) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to get users',
      message: error.message
    });
  }
});

// Update user (admin only)
router.put('/users/:id', [authenticate, checkRole(['admin'])], async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Failed to update user',
      message: error.message
    });
  }
});

// Delete user (admin only)
router.delete('/users/:id', [authenticate, checkRole(['admin'])], async (req: AuthRequest, res: Response) => {
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
      message: error.message
    });
  }
});

export default router; 