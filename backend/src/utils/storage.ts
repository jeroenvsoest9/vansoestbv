import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';
import { FirestoreError } from './errors';

export const uploadFile = async (
  path: string,
  file: File | Blob,
  metadata?: Record<string, string>
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file, { customMetadata: metadata });
    return await getDownloadURL(storageRef);
  } catch (error) {
    throw new FirestoreError(
      'Failed to upload file',
      'storage/upload-failed',
      500
    );
  }
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    throw new FirestoreError(
      'Failed to delete file',
      'storage/delete-failed',
      500
    );
  }
};

export const validateFilePath = (path: string): void => {
  if (!path || typeof path !== 'string') {
    throw new FirestoreError(
      'File path must be a non-empty string',
      'invalid-argument',
      400
    );
  }

  if (path.startsWith('/') || path.endsWith('/')) {
    throw new FirestoreError(
      'File path cannot start or end with a slash',
      'invalid-argument',
      400
    );
  }
};

export const validateFileType = (file: File | Blob, allowedTypes: string[]): void => {
  if (!file) {
    throw new FirestoreError(
      'File is required',
      'invalid-argument',
      400
    );
  }

  const type = file instanceof File ? file.type : file.type;
  if (!allowedTypes.includes(type)) {
    throw new FirestoreError(
      `File type ${type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      'invalid-argument',
      400
    );
  }
};

export const validateFileSize = (file: File | Blob, maxSize: number): void => {
  if (!file) {
    throw new FirestoreError(
      'File is required',
      'invalid-argument',
      400
    );
  }

  if (file.size > maxSize) {
    throw new FirestoreError(
      `File size exceeds maximum allowed size of ${maxSize} bytes`,
      'invalid-argument',
      400
    );
  }
}; 