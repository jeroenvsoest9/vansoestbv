import { QueryConstraint } from 'firebase/firestore';

export const validateQueryConstraints = (constraints: QueryConstraint[]): void => {
  if (!Array.isArray(constraints)) {
    throw new Error('Query constraints must be an array');
  }

  constraints.forEach((constraint, index) => {
    if (!constraint) {
      throw new Error(`Invalid query constraint at index ${index}`);
    }
  });
};

export const validatePagination = (limit: number, offset: number): void => {
  if (typeof limit !== 'number' || limit < 1) {
    throw new Error('Limit must be a positive number');
  }

  if (typeof offset !== 'number' || offset < 0) {
    throw new Error('Offset must be a non-negative number');
  }
};

export const validateSort = (field: string, direction: 'asc' | 'desc'): void => {
  if (typeof field !== 'string' || !field) {
    throw new Error('Sort field must be a non-empty string');
  }

  if (direction !== 'asc' && direction !== 'desc') {
    throw new Error('Sort direction must be either "asc" or "desc"');
  }
};

export const validateFilter = (field: string, operator: string, value: any): void => {
  if (typeof field !== 'string' || !field) {
    throw new Error('Filter field must be a non-empty string');
  }

  if (typeof operator !== 'string' || !operator) {
    throw new Error('Filter operator must be a non-empty string');
  }

  if (value === undefined || value === null) {
    throw new Error('Filter value cannot be undefined or null');
  }
};
