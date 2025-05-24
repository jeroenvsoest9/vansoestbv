const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { BlobServiceClient } = require("@azure/storage-blob");
const { MongoClient } = require("mongodb");
const moment = require("moment");

const BACKUP_DIR = path.join(__dirname, "../backups");
const DATE_FORMAT = "YYYY-MM-DD-HH-mm-ss";

// Azure Storage Configuration
const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = "backups";

// MongoDB Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || "van-soest-cms";

async function createBackupDirectory() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

async function backupMongoDB() {
  const timestamp = moment().format(DATE_FORMAT);
  const backupPath = path.join(BACKUP_DIR, `mongodb-${timestamp}.gz`);

  return new Promise((resolve, reject) => {
    const command = `mongodump --uri="${MONGODB_URI}" --archive="${backupPath}" --gzip`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`MongoDB backup failed: ${error.message}`);
        reject(error);
        return;
      }
      console.log(`MongoDB backup completed: ${backupPath}`);
      resolve(backupPath);
    });
  });
}

async function backupUploads() {
  const timestamp = moment().format(DATE_FORMAT);
  const backupPath = path.join(BACKUP_DIR, `uploads-${timestamp}.zip`);

  return new Promise((resolve, reject) => {
    const command = `cd ${path.join(__dirname, "../uploads")} && zip -r ${backupPath} .`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Uploads backup failed: ${error.message}`);
        reject(error);
        return;
      }
      console.log(`Uploads backup completed: ${backupPath}`);
      resolve(backupPath);
    });
  });
}

async function uploadToAzureStorage(filePath) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING,
  );
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

  const fileName = path.basename(filePath);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  const fileContent = fs.readFileSync(filePath);
  await blockBlobClient.upload(fileContent, fileContent.length);

  console.log(`Uploaded ${fileName} to Azure Storage`);
}

async function cleanupOldBackups() {
  const files = fs.readdirSync(BACKUP_DIR);
  const now = moment();

  files.forEach((file) => {
    const filePath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(filePath);
    const fileAge = moment.duration(now.diff(moment(stats.mtime)));

    // Delete backups older than 30 days
    if (fileAge.asDays() > 30) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old backup: ${file}`);
    }
  });
}

async function main() {
  try {
    await createBackupDirectory();

    // Create backups
    const mongoBackupPath = await backupMongoDB();
    const uploadsBackupPath = await backupUploads();

    // Upload to Azure Storage
    await uploadToAzureStorage(mongoBackupPath);
    await uploadToAzureStorage(uploadsBackupPath);

    // Cleanup old backups
    await cleanupOldBackups();

    console.log("Backup process completed successfully");
  } catch (error) {
    console.error("Backup process failed:", error);
    process.exit(1);
  }
}

// Run the backup process
main();
