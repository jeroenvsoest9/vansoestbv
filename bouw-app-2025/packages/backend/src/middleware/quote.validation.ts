import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AppError } from '@utils/errorHandler';

export const validateQuoteRequest = [
  // Customer validation
  body('customer.name').notEmpty().withMessage('Customer name is required'),
  body('customer.email').isEmail().withMessage('Valid email is required'),
  body('customer.phone').notEmpty().withMessage('Phone number is required'),
  
  // Project validation
  body('projectType').isIn(['renovatie', 'aanbouw', 'opbouw', 'verbouwing'])
    .withMessage('Invalid project type'),
  body('description').notEmpty().withMessage('Project description is required'),
  
  // Cost and duration validation
  body('estimatedCost').isNumeric().withMessage('Estimated cost must be a number'),
  body('estimatedDuration').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),

  // Handle validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }
    next();
  }
]; 