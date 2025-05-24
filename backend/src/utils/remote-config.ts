import {
  getRemoteConfig,
  getValue,
  RemoteConfig,
  Value
} from 'firebase/remote-config';
import { app } from '../config/firebase';
import { FirestoreError } from './errors';

let remoteConfig: RemoteConfig | null = null;

export const initializeRemoteConfig = (): RemoteConfig => {
  if (!remoteConfig) {
    try {
      remoteConfig = getRemoteConfig(app);
      remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
    } catch (error) {
      throw new FirestoreError(
        'Failed to initialize remote config',
        'remote-config/initialization-failed',
        500
      );
    }
  }
  return remoteConfig;
};

export const getRemoteConfigValue = <T>(
  key: string,
  defaultValue: T
): T => {
  const remoteConfigInstance = initializeRemoteConfig();
  const value = getValue(remoteConfigInstance, key);

  if (!value || !value.asString()) {
    return defaultValue;
  }

  try {
    return JSON.parse(value.asString()) as T;
  } catch {
    return value.asString() as unknown as T;
  }
};

export const validateRemoteConfigValue = (value: Value): void => {
  if (!value) {
    throw new FirestoreError(
      'Remote config value is required',
      'invalid-argument',
      400
    );
  }

  if (!value.asString()) {
    throw new FirestoreError(
      'Remote config value must be a non-empty string',
      'invalid-argument',
      400
    );
  }
};

export const getRemoteConfigBoolean = (key: string, defaultValue: boolean = false): boolean => {
  return getRemoteConfigValue<boolean>(key, defaultValue);
};

export const getRemoteConfigNumber = (key: string, defaultValue: number = 0): number => {
  return getRemoteConfigValue<number>(key, defaultValue);
};

export const getRemoteConfigString = (key: string, defaultValue: string = ''): string => {
  return getRemoteConfigValue<string>(key, defaultValue);
};

export const getRemoteConfigObject = <T extends Record<string, any>>(
  key: string,
  defaultValue: T
): T => {
  return getRemoteConfigValue<T>(key, defaultValue);
}; 