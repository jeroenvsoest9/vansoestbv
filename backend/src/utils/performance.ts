import { getPerformance, Performance, Trace } from 'firebase/performance';
import { app } from '../config/firebase';
import { FirestoreError } from './errors';

let performance: Performance | null = null;

export const initializePerformance = (): Performance => {
  if (!performance) {
    try {
      performance = getPerformance(app);
    } catch (error) {
      throw new FirestoreError(
        'Failed to initialize performance monitoring',
        'performance/initialization-failed',
        500
      );
    }
  }
  return performance;
};

export const createTrace = (name: string): Trace => {
  const performanceInstance = initializePerformance();
  return performanceInstance.trace(name);
};

export const measureOperation = async <T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> => {
  const trace = createTrace(name);
  trace.start();

  try {
    const result = await operation();
    trace.stop();
    return result;
  } catch (error) {
    trace.stop();
    throw error;
  }
};

export const measureFunction = <T extends (...args: any[]) => any>(name: string, fn: T): T => {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const trace = createTrace(name);
    trace.start();

    try {
      const result = await fn(...args);
      trace.stop();
      return result;
    } catch (error) {
      trace.stop();
      throw error;
    }
  }) as T;
};

export const addCustomAttribute = (
  trace: Trace,
  name: string,
  value: string | number | boolean
): void => {
  if (!trace) {
    throw new FirestoreError('Trace is required', 'invalid-argument', 400);
  }

  if (!name || typeof name !== 'string') {
    throw new FirestoreError('Attribute name must be a non-empty string', 'invalid-argument', 400);
  }

  if (value === undefined || value === null) {
    throw new FirestoreError(
      'Attribute value cannot be undefined or null',
      'invalid-argument',
      400
    );
  }

  trace.putAttribute(name, value.toString());
};

// New function to measure network performance
export const measureNetworkPerformance = async (
  url: string,
  method: string = 'GET'
): Promise<number> => {
  const trace = createTrace(`network_${method.toLowerCase()}_${url}`);
  trace.start();

  try {
    const startTime = performance.now();
    const response = await fetch(url, { method });
    const endTime = performance.now();

    trace.putAttribute('status', response.status.toString());
    trace.putAttribute('content_type', response.headers.get('content-type') || '');
    trace.putAttribute('content_length', response.headers.get('content-length') || '0');

    trace.stop();
    return endTime - startTime;
  } catch (error) {
    trace.stop();
    throw error;
  }
};
