import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { initializeApp as initializeAdminApp, cert, App } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage as getAdminStorage, Storage } from 'firebase-admin/storage';
import { getAuth as getAdminAuth, Auth } from 'firebase-admin/auth';
import logger from './logger';

// Firebase client configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase client
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Initialize Firebase Admin
let adminApp: App;
let adminDb: Firestore;
let adminStorage: Storage;
let adminAuth: Auth;

try {
  adminApp = initializeAdminApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  // Initialize services
  adminDb = getAdminFirestore(adminApp);
  adminStorage = getAdminStorage(adminApp);
  adminAuth = getAdminAuth(adminApp);

  // Configure Firestore settings
  adminDb.settings({
    ignoreUndefinedProperties: true,
  });

  logger.info('Firebase Admin initialized successfully');
} catch (error) {
  logger.error('Firebase Admin initialization error:', error);
  process.exit(1);
}

export { adminDb, adminStorage, adminAuth };

// Firestore collections
export const collections = {
  users: 'users',
  content: 'content',
  settings: 'settings',
  menus: 'menus',
  invoices: 'invoices',
} as const;

// Firestore indexes
export const indexes = {
  users: {
    email: ['email', 'asc'],
    username: ['username', 'asc'],
  },
  content: {
    type: ['type', 'asc', 'status', 'asc'],
    author: ['author', 'asc', 'createdAt', 'desc'],
  },
  invoices: {
    status: ['status', 'asc', 'createdAt', 'desc'],
    user: ['userId', 'asc', 'createdAt', 'desc'],
  },
} as const;
