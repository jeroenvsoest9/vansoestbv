import { Request, Response, NextFunction } from 'express';
import { FirebaseError } from 'firebase/app';
import logger from '../config/logger';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError | FirebaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error('Error:', {
    error: err,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Firebase Auth errors
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case 'auth/user-not-found':
        error = new AppError('User not found', 404);
        break;
      case 'auth/wrong-password':
        error = new AppError('Invalid credentials', 401);
        break;
      case 'auth/email-already-in-use':
        error = new AppError('Email already in use', 400);
        break;
      case 'auth/invalid-email':
        error = new AppError('Invalid email address', 400);
        break;
      case 'auth/weak-password':
        error = new AppError('Password is too weak', 400);
        break;
      case 'auth/operation-not-allowed':
        error = new AppError('Operation not allowed', 403);
        break;
      case 'auth/too-many-requests':
        error = new AppError('Too many requests, please try again later', 429);
        break;
      default:
        error = new AppError('Authentication error', 500);
    }
  }

  // Validation error
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors).map((val: any) => val.message);
    error = new AppError(message.join('. '), 400);
  }

  // Duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    error = new AppError(`Duplicate field value: ${field}. Please use another value`, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired. Please log in again', 401);
  }

  // Default error
  if (!(error instanceof AppError)) {
    error = new AppError('Something went wrong', 500);
  }

  // Send error response
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}; 