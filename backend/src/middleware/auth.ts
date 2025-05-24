import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { AppError } from './error';
import logger from '../config/logger';

interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    
    // Get user role from Firestore
    const userDoc = await getFirestore()
      .collection('users')
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      throw new AppError('User not found', 404);
    }

    const userData = userDoc.data();
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      role: userData?.role || 'user'
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    next(new AppError('Authentication failed', 401));
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

export const requireAdmin = requireRole(['admin']);
export const requireEditor = requireRole(['admin', 'editor']); 