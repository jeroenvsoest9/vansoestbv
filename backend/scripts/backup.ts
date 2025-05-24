import { adminDb, adminStorage } from '../src/config/firebase';
import * as fs from 'fs';
import * as path from 'path';

const BACKUP_DIR = path.join(__dirname, '../backups');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function backupFirestore() {
  const collections = ['users', 'content', 'settings', 'menus', 'invoices'];
  const backup: Record<string, any[]> = {};
  for (const name of collections) {
    const snapshot = await adminDb.collection(name).get();
    backup[name] = snapshot.docs.map(doc => doc.data());
  }
  const backupPath = path.join(BACKUP_DIR, `firestore-${timestamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  console.log(`Firestore backup: ${backupPath}`);
}

async function backupStorage() {
  const bucket = adminStorage.bucket();
  const [files] = await bucket.getFiles();
  const backupPath = path.join(BACKUP_DIR, `storage-${timestamp}`);
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }
  for (const file of files) {
    const dest = path.join(backupPath, file.name);
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    await file.download({ destination: dest });
  }
  console.log(`Storage backup: ${backupPath}`);
}

async function main() {
  await backupFirestore();
  await backupStorage();
  console.log('Backup compleet!');
}

main().then(() => process.exit(0)); 