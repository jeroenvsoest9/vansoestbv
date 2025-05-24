import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Backup directory
const BACKUP_DIR = path.join(__dirname, "../backups");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function backupFirestore() {
  try {
    const backupPath = path.join(BACKUP_DIR, `firestore-${timestamp}.json`);
    const collections = ["users", "content", "settings", "menus", "invoices"];
    const backup: Record<string, any[]> = {};

    for (const collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      backup[collectionName] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    console.log(`Firestore backup completed: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error(`Firestore backup failed: ${error}`);
    throw error;
  }
}

async function backupStorage() {
  try {
    const backupPath = path.join(BACKUP_DIR, `storage-${timestamp}`);
    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }

    const storageRef = ref(storage);
    const result = await listAll(storageRef);

    for (const itemRef of result.items) {
      const filePath = path.join(backupPath, itemRef.fullPath);
      const dirPath = path.dirname(filePath);

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Download file
      const url = await getDownloadURL(itemRef);
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));
    }

    console.log(`Storage backup completed: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error(`Storage backup failed: ${error}`);
    throw error;
  }
}

async function createBackup() {
  try {
    console.log("Starting backup process...");

    // Backup Firestore data
    const firestoreBackupPath = await backupFirestore();

    // Backup Storage files
    const storageBackupPath = await backupStorage();

    // Create backup manifest
    const manifest = {
      timestamp,
      firestore: firestoreBackupPath,
      storage: storageBackupPath,
    };

    const manifestPath = path.join(BACKUP_DIR, `manifest-${timestamp}.json`);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log("Backup completed successfully!");
    console.log(`Manifest: ${manifestPath}`);
  } catch (error) {
    console.error("Backup failed:", error);
    process.exit(1);
  }
}

// Run backup
createBackup();
