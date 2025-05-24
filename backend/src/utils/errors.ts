import { FirebaseError } from 'firebase/app';

export class FirestoreError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500
  ) {
    super(message);
    this.name = 'FirestoreError';
  }
}

export const handleFirestoreError = (error: unknown): never => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'permission-denied':
        throw new FirestoreError('Permission denied', error.code, 403);
      case 'not-found':
        throw new FirestoreError('Document not found', error.code, 404);
      case 'already-exists':
        throw new FirestoreError('Document already exists', error.code, 409);
      case 'resource-exhausted':
        throw new FirestoreError('Resource exhausted', error.code, 429);
      case 'failed-precondition':
        throw new FirestoreError('Failed precondition', error.code, 400);
      case 'aborted':
        throw new FirestoreError('Operation aborted', error.code, 409);
      case 'out-of-range':
        throw new FirestoreError('Out of range', error.code, 400);
      case 'unimplemented':
        throw new FirestoreError('Not implemented', error.code, 501);
      case 'unavailable':
        throw new FirestoreError('Service unavailable', error.code, 503);
      case 'data-loss':
        throw new FirestoreError('Data loss', error.code, 500);
      case 'unauthenticated':
        throw new FirestoreError('Unauthenticated', error.code, 401);
      case 'internal':
        throw new FirestoreError('Internal error', error.code, 500);
      default:
        throw new FirestoreError(error.message, error.code);
    }
  }

  if (error instanceof Error) {
    throw new FirestoreError(error.message, 'unknown', 500);
  }

  throw new FirestoreError('Unknown error occurred', 'unknown', 500);
}; 