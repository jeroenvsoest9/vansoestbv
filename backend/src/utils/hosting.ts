import { FirestoreError } from './errors';

export interface HostingConfig {
  public: string;
  ignore: string[];
  rewrites: RewriteRule[];
  redirects: RedirectRule[];
  headers: HeaderRule[];
}

export interface RewriteRule {
  source: string;
  destination: string;
  function?: string;
  region?: string;
}

export interface RedirectRule {
  source: string;
  destination: string;
  type?: 301 | 302 | 307 | 308;
}

export interface HeaderRule {
  source: string;
  headers: Array<{
    key: string;
    value: string;
  }>;
}

export const validateHostingConfig = (config: HostingConfig): void => {
  if (!config.public || typeof config.public !== 'string') {
    throw new FirestoreError(
      'Public directory must be a non-empty string',
      'invalid-argument',
      400
    );
  }

  if (!Array.isArray(config.ignore)) {
    throw new FirestoreError('Ignore patterns must be an array', 'invalid-argument', 400);
  }

  if (!Array.isArray(config.rewrites)) {
    throw new FirestoreError('Rewrite rules must be an array', 'invalid-argument', 400);
  }

  if (!Array.isArray(config.redirects)) {
    throw new FirestoreError('Redirect rules must be an array', 'invalid-argument', 400);
  }

  if (!Array.isArray(config.headers)) {
    throw new FirestoreError('Header rules must be an array', 'invalid-argument', 400);
  }
};

export const validateRewriteRule = (rule: RewriteRule): void => {
  if (!rule.source || typeof rule.source !== 'string') {
    throw new FirestoreError('Rewrite source must be a non-empty string', 'invalid-argument', 400);
  }

  if (!rule.destination && !rule.function) {
    throw new FirestoreError(
      'Rewrite must have either a destination or a function',
      'invalid-argument',
      400
    );
  }

  if (rule.function && typeof rule.function !== 'string') {
    throw new FirestoreError('Rewrite function must be a string', 'invalid-argument', 400);
  }

  if (rule.region && typeof rule.region !== 'string') {
    throw new FirestoreError('Rewrite region must be a string', 'invalid-argument', 400);
  }
};

export const validateRedirectRule = (rule: RedirectRule): void => {
  if (!rule.source || typeof rule.source !== 'string') {
    throw new FirestoreError('Redirect source must be a non-empty string', 'invalid-argument', 400);
  }

  if (!rule.destination || typeof rule.destination !== 'string') {
    throw new FirestoreError(
      'Redirect destination must be a non-empty string',
      'invalid-argument',
      400
    );
  }

  if (rule.type && ![301, 302, 307, 308].includes(rule.type)) {
    throw new FirestoreError('Invalid redirect type', 'invalid-argument', 400);
  }
};

export const validateHeaderRule = (rule: HeaderRule): void => {
  if (!rule.source || typeof rule.source !== 'string') {
    throw new FirestoreError('Header source must be a non-empty string', 'invalid-argument', 400);
  }

  if (!Array.isArray(rule.headers)) {
    throw new FirestoreError('Header rules must be an array', 'invalid-argument', 400);
  }

  rule.headers.forEach((header) => {
    if (!header.key || typeof header.key !== 'string') {
      throw new FirestoreError('Header key must be a non-empty string', 'invalid-argument', 400);
    }

    if (!header.value || typeof header.value !== 'string') {
      throw new FirestoreError('Header value must be a non-empty string', 'invalid-argument', 400);
    }
  });
};
