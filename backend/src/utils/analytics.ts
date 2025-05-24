import { getAnalytics, logEvent, Analytics } from 'firebase/analytics';
import { app } from '../config/firebase';
import { FirestoreError } from './errors';

let analytics: Analytics | null = null;

export const initializeAnalytics = (): Analytics => {
  if (!analytics) {
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      throw new FirestoreError(
        'Failed to initialize analytics',
        'analytics/initialization-failed',
        500
      );
    }
  }
  return analytics;
};

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, any>;
}

export const validateAnalyticsEvent = (event: AnalyticsEvent): void => {
  if (!event.name || typeof event.name !== 'string') {
    throw new FirestoreError('Event name must be a non-empty string', 'invalid-argument', 400);
  }

  if (event.params && typeof event.params !== 'object') {
    throw new FirestoreError('Event parameters must be an object', 'invalid-argument', 400);
  }
};

export const logAnalyticsEvent = async (event: AnalyticsEvent): Promise<void> => {
  validateAnalyticsEvent(event);

  try {
    const analyticsInstance = initializeAnalytics();
    await logEvent(analyticsInstance, event.name, event.params);
  } catch (error) {
    throw new FirestoreError('Failed to log analytics event', 'analytics/logging-failed', 500);
  }
};

export const logPageView = async (pagePath: string, pageTitle: string): Promise<void> => {
  await logAnalyticsEvent({
    name: 'page_view',
    params: {
      page_path: pagePath,
      page_title: pageTitle,
    },
  });
};

export const logUserAction = async (
  action: string,
  category: string,
  label?: string,
  value?: number
): Promise<void> => {
  await logAnalyticsEvent({
    name: 'user_action',
    params: {
      action,
      category,
      label,
      value,
    },
  });
};

export const logError = async (error: Error, fatal: boolean = false): Promise<void> => {
  await logAnalyticsEvent({
    name: 'error',
    params: {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack,
      fatal,
    },
  });
};

// New function to track user engagement
export const logUserEngagement = async (
  engagementType: string,
  duration: number,
  metadata?: Record<string, any>
): Promise<void> => {
  await logAnalyticsEvent({
    name: 'user_engagement',
    params: {
      engagement_type: engagementType,
      duration,
      ...metadata,
    },
  });
};
