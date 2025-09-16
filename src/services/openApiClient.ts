/**
 * OpenAPI TypeScript Client Configuration
 * Generates type-safe API client from OpenAPI schema
 */

import createClient from 'openapi-fetch';
import type { paths } from './types/api';

// Create type-safe API client
export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication interceptor
api.use({
  async onRequest({ request }) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      request.headers.set('Authorization', Bearer ${token});
    }
    return request;
  },
  async onResponse({ response }) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return response;
  },
});

export default api;

// API versioning utilities
export const ApiVersions = {
  V1: '/api/v1',
  V2: '/api/v2',
  CURRENT: '/api/v1',
} as const;

export type ApiVersion = typeof ApiVersions[keyof typeof ApiVersions];

// Version-specific client factory
export function createVersionedClient(version: ApiVersion = ApiVersions.CURRENT) {
  return createClient<paths>({
    baseUrl: ${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'},
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
