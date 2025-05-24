import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, listAll, deleteObject } from 'firebase/storage';
import logger from '../src/config/logger';

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

async function clearFirestore() {
  try {
    const collections = ['users', 'content', 'settings', 'menus', 'invoices'];
    
    for (const collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    }
    
    logger.info('Firestore collections cleared successfully');
  } catch (error) {
    logger.error('Error clearing Firestore collections:', error);
    throw error;
  }
}

async function clearStorage() {
  try {
    const storageRef = ref(storage);
    const result = await listAll(storageRef);
    
    const deletePromises = result.items.map(itemRef => deleteObject(itemRef));
    await Promise.all(deletePromises);
    
    logger.info('Storage cleared successfully');
  } catch (error) {
    logger.error('Error clearing Storage:', error);
    throw error;
  }
}

async function initializeTestEnvironment() {
  try {
    logger.info('Initializing test environment...');
    
    // Clear Firestore collections
    await clearFirestore();
    
    // Clear Storage
    await clearStorage();
    
    logger.info('Test environment initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize test environment:', error);
    process.exit(1);
  }
}

// Run initialization
initializeTestEnvironment(); 