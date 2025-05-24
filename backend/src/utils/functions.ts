import { getFunctions, httpsCallable, Functions, HttpsCallable } from 'firebase/functions';
import { app } from '../config/firebase';
import { FirestoreError } from './errors';

let functions: Functions | null = null;

export const initializeFunctions = (): Functions => {
  if (!functions) {
    try {
      functions = getFunctions(app);
    } catch (error) {
      throw new FirestoreError(
        'Failed to initialize functions',
        'functions/initialization-failed',
        500
      );
    }
  }
  return functions;
};

export const createFunction = <T = any, R = any>(name: string): HttpsCallable<T, R> => {
  const functionsInstance = initializeFunctions();
  return httpsCallable<T, R>(functionsInstance, name);
};

export const callFunction = async <T = any, R = any>(name: string, data?: T): Promise<R> => {
  const fn = createFunction<T, R>(name);

  try {
    const result = await fn(data);
    return result.data;
  } catch (error) {
    throw new FirestoreError('Failed to call function', 'functions/call-failed', 500);
  }
};

export interface FunctionOptions {
  timeout?: number;
  memory?: '128MB' | '256MB' | '512MB' | '1GB' | '2GB' | '4GB' | '8GB';
  region?: string;
  maxInstances?: number;
}

export const validateFunctionOptions = (options: FunctionOptions): void => {
  if (options.timeout && (typeof options.timeout !== 'number' || options.timeout < 0)) {
    throw new FirestoreError(
      'Function timeout must be a non-negative number',
      'invalid-argument',
      400
    );
  }

  if (
    options.memory &&
    !['128MB', '256MB', '512MB', '1GB', '2GB', '4GB', '8GB'].includes(options.memory)
  ) {
    throw new FirestoreError('Invalid function memory option', 'invalid-argument', 400);
  }

  if (options.region && typeof options.region !== 'string') {
    throw new FirestoreError('Function region must be a string', 'invalid-argument', 400);
  }

  if (
    options.maxInstances &&
    (typeof options.maxInstances !== 'number' || options.maxInstances < 1)
  ) {
    throw new FirestoreError(
      'Function max instances must be a positive number',
      'invalid-argument',
      400
    );
  }
};
