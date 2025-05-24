import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  getDocs,
  QueryConstraint,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { FirestoreError } from './errors';
import { validateQueryConstraints } from './validation';

export interface QueryOptions {
  where?: Array<[string, string, any]>;
  orderBy?: Array<[string, 'asc' | 'desc']>;
  limit?: number;
  startAfter?: DocumentSnapshot;
  endBefore?: DocumentSnapshot;
}

export const buildQuery = (path: string, options: QueryOptions): QueryConstraint[] => {
  const constraints: QueryConstraint[] = [];

  if (options.where) {
    options.where.forEach(([field, operator, value]) => {
      constraints.push(where(field, operator, value));
    });
  }

  if (options.orderBy) {
    options.orderBy.forEach(([field, direction]) => {
      constraints.push(orderBy(field, direction));
    });
  }

  if (options.limit) {
    constraints.push(limit(options.limit));
  }

  if (options.startAfter) {
    constraints.push(startAfter(options.startAfter));
  }

  if (options.endBefore) {
    constraints.push(endBefore(options.endBefore));
  }

  validateQueryConstraints(constraints);
  return constraints;
};

export const executeQuery = async <T>(
  path: string,
  options: QueryOptions
): Promise<{ data: T[]; lastDoc: DocumentSnapshot | null }> => {
  const constraints = buildQuery(path, options);
  const q = query(collection(db, path), ...constraints);
  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];

  const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

  return { data, lastDoc };
};

export const paginateQuery = async <T>(
  path: string,
  options: QueryOptions,
  pageSize: number = 10
): Promise<{
  data: T[];
  hasMore: boolean;
  lastDoc: DocumentSnapshot | null;
}> => {
  const paginatedOptions = {
    ...options,
    limit: pageSize + 1,
  };

  const { data, lastDoc } = await executeQuery<T>(path, paginatedOptions);
  const hasMore = data.length > pageSize;

  return {
    data: data.slice(0, pageSize),
    hasMore,
    lastDoc: hasMore ? lastDoc : null,
  };
};
