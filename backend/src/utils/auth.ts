import { User as FirebaseUser } from 'firebase/auth';
import { User as AdminUser } from 'firebase-admin/auth';
import { FirestoreError } from './errors';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  customClaims?: Record<string, any>;
}

export const convertFirebaseUser = (user: FirebaseUser): AuthUser => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified
  };
};

export const convertAdminUser = (user: AdminUser): AuthUser => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    customClaims: user.customClaims
  };
};

export const validateAuthUser = (user: AuthUser): void => {
  if (!user.uid) {
    throw new FirestoreError('User ID is required', 'invalid-argument', 400);
  }

  if (!user.email) {
    throw new FirestoreError('Email is required', 'invalid-argument', 400);
  }

  if (typeof user.emailVerified !== 'boolean') {
    throw new FirestoreError('Email verification status is required', 'invalid-argument', 400);
  }
};

export const validateCustomClaims = (claims: Record<string, any>): void => {
  if (!claims || typeof claims !== 'object') {
    throw new FirestoreError('Custom claims must be an object', 'invalid-argument', 400);
  }

  for (const [key, value] of Object.entries(claims)) {
    if (typeof key !== 'string' || !key) {
      throw new FirestoreError('Custom claim key must be a non-empty string', 'invalid-argument', 400);
    }

    if (value === undefined || value === null) {
      throw new FirestoreError(`Custom claim value for ${key} cannot be undefined or null`, 'invalid-argument', 400);
    }
  }
}; 