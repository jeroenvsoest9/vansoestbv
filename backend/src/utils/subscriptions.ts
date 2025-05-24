import {
  collection,
  query,
  onSnapshot,
  QuerySnapshot,
  DocumentSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { buildQuery, QueryOptions } from './queries';

export interface SubscriptionCallback<T> {
  onNext?: (data: T[]) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export const subscribeToCollection = <T>(
  path: string,
  options: QueryOptions,
  callback: SubscriptionCallback<T>
): Unsubscribe => {
  const constraints = buildQuery(path, options);
  const q = query(collection(db, path), ...constraints);

  return onSnapshot(
    q,
    (snapshot: QuerySnapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];

      if (callback.onNext) {
        callback.onNext(data);
      }
    },
    (error: Error) => {
      if (callback.onError) {
        callback.onError(error);
      }
    },
    () => {
      if (callback.onComplete) {
        callback.onComplete();
      }
    }
  );
};

export const subscribeToDocument = <T>(
  path: string,
  callback: SubscriptionCallback<T>
): Unsubscribe => {
  const docRef = collection(db, path);

  return onSnapshot(
    docRef,
    (snapshot: DocumentSnapshot) => {
      const data = snapshot.exists()
        ? {
            id: snapshot.id,
            ...snapshot.data()
          }
        : null;

      if (callback.onNext) {
        callback.onNext(data ? [data] : []);
      }
    },
    (error: Error) => {
      if (callback.onError) {
        callback.onError(error);
      }
    },
    () => {
      if (callback.onComplete) {
        callback.onComplete();
      }
    }
  );
};

export const createSubscriptionManager = () => {
  const subscriptions: Unsubscribe[] = [];

  return {
    subscribe: (unsubscribe: Unsubscribe) => {
      subscriptions.push(unsubscribe);
      return () => {
        const index = subscriptions.indexOf(unsubscribe);
        if (index > -1) {
          subscriptions.splice(index, 1);
        }
      };
    },
    unsubscribeAll: () => {
      subscriptions.forEach(unsubscribe => unsubscribe());
      subscriptions.length = 0;
    }
  };
}; 