import { FirestoreError } from './errors';

export interface SecurityRule {
  allow: 'read' | 'write' | 'create' | 'update' | 'delete';
  if: string;
}

export const validateSecurityRule = (rule: SecurityRule): void => {
  if (!rule.allow || !['read', 'write', 'create', 'update', 'delete'].includes(rule.allow)) {
    throw new FirestoreError(
      'Invalid security rule allow value',
      'invalid-argument',
      400
    );
  }

  if (!rule.if || typeof rule.if !== 'string') {
    throw new FirestoreError(
      'Security rule condition must be a non-empty string',
      'invalid-argument',
      400
    );
  }
};

export const generateFirestoreRules = (rules: Record<string, SecurityRule[]>): string => {
  const validateRules = (rules: SecurityRule[]): void => {
    rules.forEach(validateSecurityRule);
  };

  const generateRuleBlock = (path: string, rules: SecurityRule[]): string => {
    validateRules(rules);
    return `
      match ${path} {
        ${rules.map(rule => `allow ${rule.allow}: if ${rule.if};`).join('\n        ')}
      }
    `;
  };

  return `
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        ${Object.entries(rules)
          .map(([path, pathRules]) => generateRuleBlock(path, pathRules))
          .join('\n        ')}
      }
    }
  `;
};

export const generateStorageRules = (rules: Record<string, SecurityRule[]>): string => {
  const validateRules = (rules: SecurityRule[]): void => {
    rules.forEach(validateSecurityRule);
  };

  const generateRuleBlock = (path: string, rules: SecurityRule[]): string => {
    validateRules(rules);
    return `
      match ${path} {
        ${rules.map(rule => `allow ${rule.allow}: if ${rule.if};`).join('\n        ')}
      }
    `;
  };

  return `
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        ${Object.entries(rules)
          .map(([path, pathRules]) => generateRuleBlock(path, pathRules))
          .join('\n        ')}
      }
    }
  `;
}; 