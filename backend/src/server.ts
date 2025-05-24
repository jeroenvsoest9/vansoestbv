import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import logger from './config/logger';
import { errorHandler } from './middleware/error';

// Load environment variables
config();

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// Create Express app
const server = express();

// Middleware
server.use(cors());
server.use(helmet());
server.use(compression());
server.use(morgan('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import contentRoutes from './routes/content';
import userRoutes from './routes/users';
import settingsRoutes from './routes/settings';

server.use('/api/auth', authRoutes);
server.use('/api/projects', projectRoutes);
server.use('/api/content', contentRoutes);
server.use('/api/users', userRoutes);
server.use('/api/settings', settingsRoutes);

// Error handling middleware
server.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export { app, auth, db, storage, functions };
