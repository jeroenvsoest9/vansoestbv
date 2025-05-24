import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export const convertDoc = <T>(doc: QueryDocumentSnapshot<DocumentData>): T => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
  } as T;
};

export const convertDocs = <T>(docs: QueryDocumentSnapshot<DocumentData>[]): T[] => {
  return docs.map((doc) => convertDoc<T>(doc));
};

export const convertTimestamp = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (timestamp.toDate) return timestamp.toDate();
  return new Date(timestamp);
};

export const convertToFirestore = (data: any): DocumentData => {
  const result: DocumentData = {};

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Date) {
      result[key] = value;
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) => convertToFirestore(item));
    } else if (value && typeof value === 'object') {
      result[key] = convertToFirestore(value);
    } else {
      result[key] = value;
    }
  }

  return result;
};
