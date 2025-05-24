import { FirestoreError } from './errors';

export interface IndexField {
  fieldPath: string;
  order: 'ASCENDING' | 'DESCENDING';
}

export interface Index {
  collectionGroup: string;
  queryScope: 'COLLECTION' | 'COLLECTION_GROUP';
  fields: IndexField[];
}

export const validateIndex = (index: Index): void => {
  if (!index.collectionGroup || typeof index.collectionGroup !== 'string') {
    throw new FirestoreError(
      'Collection group must be a non-empty string',
      'invalid-argument',
      400
    );
  }

  if (!index.queryScope || !['COLLECTION', 'COLLECTION_GROUP'].includes(index.queryScope)) {
    throw new FirestoreError(
      'Query scope must be either COLLECTION or COLLECTION_GROUP',
      'invalid-argument',
      400
    );
  }

  if (!Array.isArray(index.fields) || index.fields.length === 0) {
    throw new FirestoreError('Index must have at least one field', 'invalid-argument', 400);
  }

  index.fields.forEach((field, index) => {
    if (!field.fieldPath || typeof field.fieldPath !== 'string') {
      throw new FirestoreError(
        `Field path at index ${index} must be a non-empty string`,
        'invalid-argument',
        400
      );
    }

    if (!field.order || !['ASCENDING', 'DESCENDING'].includes(field.order)) {
      throw new FirestoreError(
        `Field order at index ${index} must be either ASCENDING or DESCENDING`,
        'invalid-argument',
        400
      );
    }
  });
};

export const generateIndexes = (indexes: Index[]): Index[] => {
  indexes.forEach(validateIndex);

  return indexes.map((index) => ({
    collectionGroup: index.collectionGroup,
    queryScope: index.queryScope,
    fields: index.fields.map((field) => ({
      fieldPath: field.fieldPath,
      order: field.order,
    })),
  }));
};

export const generateCompositeIndexes = (indexes: Index[]): Index[] => {
  indexes.forEach(validateIndex);

  return indexes.map((index) => ({
    collectionGroup: index.collectionGroup,
    queryScope: index.queryScope,
    fields: index.fields.map((field) => ({
      fieldPath: field.fieldPath,
      order: field.order,
    })),
  }));
};
