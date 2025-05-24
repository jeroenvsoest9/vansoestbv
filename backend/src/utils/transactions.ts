import { runTransaction, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FirestoreError } from './errors';

export interface TransactionOperation {
  type: 'get' | 'set' | 'update' | 'delete';
  path: string;
  data?: any;
}

export const validateTransactionOperation = (operation: TransactionOperation): void => {
  if (!operation.type || !['get', 'set', 'update', 'delete'].includes(operation.type)) {
    throw new FirestoreError('Invalid transaction operation type', 'invalid-argument', 400);
  }

  if (!operation.path || typeof operation.path !== 'string') {
    throw new FirestoreError(
      'Transaction operation path must be a non-empty string',
      'invalid-argument',
      400
    );
  }

  if (['set', 'update'].includes(operation.type) && !operation.data) {
    throw new FirestoreError(
      'Transaction operation data is required for set and update operations',
      'invalid-argument',
      400
    );
  }
};

export const executeTransaction = async (operations: TransactionOperation[]): Promise<any[]> => {
  operations.forEach(validateTransactionOperation);

  return runTransaction(db, async (transaction) => {
    const results: any[] = [];

    for (const operation of operations) {
      const docRef = doc(db, operation.path);

      switch (operation.type) {
        case 'get':
          const docSnap = await transaction.get(docRef);
          results.push(docSnap.exists() ? docSnap.data() : null);
          break;

        case 'set':
          transaction.set(docRef, operation.data);
          results.push(operation.data);
          break;

        case 'update':
          transaction.update(docRef, operation.data);
          results.push(operation.data);
          break;

        case 'delete':
          transaction.delete(docRef);
          results.push(null);
          break;
      }
    }

    return results;
  });
};

export const executeBatchTransaction = async (
  operations: TransactionOperation[],
  batchSize: number = 500
): Promise<any[]> => {
  operations.forEach(validateTransactionOperation);

  const batches: TransactionOperation[][] = [];
  for (let i = 0; i < operations.length; i += batchSize) {
    batches.push(operations.slice(i, i + batchSize));
  }

  const results: any[] = [];
  for (const batch of batches) {
    const batchResults = await executeTransaction(batch);
    results.push(...batchResults);
  }

  return results;
};
