/**
 * Security & Authentication API Service
 * ====================================
 * 
 * Production-ready API service for security and authentication operations.
 * Handles access tokens, sessions, API keys, audit logs, security events, 
 * security scans, and rate limits.
 * 
 * Features:
 * - Full CRUD operations for all security tables
 * - Type-safe interfaces
 * - Error handling and validation
 * - Audit logging integration
 * - Rate limiting awareness
 * - Security event tracking
 */

import { gameforgeAPI } from './api';
import {
  AccessToken,
  CreateAccessTokenRequest,
  AccessTokenResponse,
  UserSession,
  CreateSessionRequest,
  SessionActivity,
  ApiKey,
  CreateApiKeyRequest,
  ApiKeyResponse,
  AuditLog,
  CreateAuditLogRequest,
  AuditLogFilter,
  SecurityEvent,
  CreateSecurityEventRequest,
  SecurityEventFilter,
  SecurityScan,
  CreateSecurityScanRequest,
  RateLimit,
  RateLimitStatus,
  SecurityMetrics,
  SecurityConfig,
  PaginatedResponse,
  SecurityResponse
} from '../types/security';

class SecurityAPI {
  // ========================================
  // ACCESS TOKENS
  // ========================================

  /**
   * Create a new access token
   */
  async createAccessToken(request: CreateAccessTokenRequest): Promise<SecurityResponse<AccessTokenResponse>> {
    try {
      const response = await gameforgeAPI.post<AccessTokenResponse>('/security/tokens', request);
      return {
        success: true,
        data: response.data,
        security_context: {
          audit_logged: true,
          risk_assessed: true,
          scan_triggered: false
        }
      };
    } catch (error: any) {
      console.error('Failed to create access token:', error);
      return {
        success: false,
        error: {
          message: error.message || 'Failed to create access token',
          code: error.code || 'TOKEN_CREATION_FAILED'
        }
      };
    }
  }

  /**
   * Get user's access tokens
   */
  async getUserTokens(userId: string): Promise<SecurityResponse<AccessToken[]>> {
    try {
      const response = await gameforgeAPI.get<AccessToken[]>(`/security/tokens/user/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch user tokens',
          code: 'TOKEN_FETCH_FAILED'
        }
      };
    }
  }

  /**
   * Revoke an access token
   */
  async revokeToken(tokenId: string): Promise<SecurityResponse<void>> {
    try {
      await gameforgeAPI.delete(`/security/tokens/${tokenId}`);
      return {
        success: true,
        security_context: {
          audit_logged: true,
          risk_assessed: true,
          scan_triggered: false
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to revoke token',
          code: 'TOKEN_REVOCATION_FAILED'
        }
      };
    }
  }

  /**
   * Validate an access token
   */
  async validateToken(token: string): Promise<SecurityResponse<{ valid: boolean; user_id?: string }>> {
    try {
      const response = await gameforgeAPI.post<{ valid: boolean; user_id?: string }>('/security/tokens/validate', { token });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to validate token',
          code: 'TOKEN_VALIDATION_FAILED'
        }
      };
    }
  }

  // ========================================
  // USER SESSIONS
  // ========================================

  /**
   * Create a new user session
   */
  async createSession(request: CreateSessionRequest): Promise<SecurityResponse<UserSession>> {
    try {
      const response = await gameforgeAPI.post<UserSession>('/security/sessions', request);
      return {
        success: true,
        data: response.data,
        security_context: {
          audit_logged: true,
          risk_assessed: true,
          scan_triggered: false
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to create session',
          code: 'SESSION_CREATION_FAILED'
        }
      };
    }
  }

  /**
   * Get user's active sessions
   */
  async getUserSessions(userId: string): Promise<SecurityResponse<UserSession[]>> {
    try {
      const response = await gameforgeAPI.get<UserSession[]>(`/security/sessions/user/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch user sessions',
          code: 'SESSION_FETCH_FAILED'
        }
      };
    }
  }

  /**
   * Terminate a session
   */
  async terminateSession(sessionId: string, reason?: string): Promise<SecurityResponse<void>> {
    try {
      await gameforgeAPI.delete(`/security/sessions/${sessionId}`, { 
        body: reason ? { reason } : undefined 
      });
      return {
        success: true,
        security_context: {
          audit_logged: true,
          risk_assessed: true,
          scan_triggered: false
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to terminate session',
          code: 'SESSION_TERMINATION_FAILED'
        }
      };
    }
  }

  /**
   * Update session activity
   */
  async updateSessionActivity(sessionId: string, activity: SessionActivity): Promise<SecurityResponse<void>> {
    try {
      await gameforgeAPI.post(`/security/sessions/${sessionId}/activity`, activity);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to update session activity',
          code: 'SESSION_ACTIVITY_UPDATE_FAILED'
        }
      };
    }
  }

  // ========================================
  // API KEYS
  // ========================================

  /**
   * Create a new API key
   */
  async createApiKey(request: CreateApiKeyRequest): Promise<SecurityResponse<ApiKeyResponse>> {
    try {
      const response = await gameforgeAPI.post<ApiKeyResponse>('/security/api-keys', request);
      return {
        success: true,
        data: response.data,
        security_context: {
          audit_logged: true,
          risk_assessed: true,
          scan_triggered: false
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to create API key',
          code: 'API_KEY_CREATION_FAILED'
        }
      };
    }
  }

  /**
   * Get user's API keys
   */
  async getUserApiKeys(userId: string): Promise<SecurityResponse<ApiKey[]>> {
    try {
      const response = await gameforgeAPI.get<ApiKey[]>(`/security/api-keys/user/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch API keys',
          code: 'API_KEY_FETCH_FAILED'
        }
      };
    }
  }

  /**
   * Revoke an API key
   */
  async revokeApiKey(keyId: string): Promise<SecurityResponse<void>> {
    try {
      await gameforgeAPI.delete(`/security/api-keys/${keyId}`);
      return {
        success: true,
        security_context: {
          audit_logged: true,
          risk_assessed: true,
          scan_triggered: false
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to revoke API key',
          code: 'API_KEY_REVOCATION_FAILED'
        }
      };
    }
  }

  /**
   * Update API key permissions
   */
  async updateApiKeyPermissions(keyId: string, permissions: string[]): Promise<SecurityResponse<ApiKey>> {
    try {
      const response = await gameforgeAPI.patch<ApiKey>(`/security/api-keys/${keyId}`, { permissions });
      return {
        success: true,
        data: response.data,
        security_context: {
          audit_logged: true,
          risk_assessed: true,
          scan_triggered: false
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to update API key permissions',
          code: 'API_KEY_UPDATE_FAILED'
        }
      };
    }
  }

  // ========================================
  // AUDIT LOGS
  // ========================================

  /**
   * Create an audit log entry
   */
  async createAuditLog(request: CreateAuditLogRequest): Promise<SecurityResponse<AuditLog>> {
    try {
      const response = await gameforgeAPI.post<AuditLog>('/security/audit-logs', request);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to create audit log',
          code: 'AUDIT_LOG_CREATION_FAILED'
        }
      };
    }
  }

  /**
   * Get audit logs with filters
   */
  async getAuditLogs(filter: AuditLogFilter): Promise<SecurityResponse<PaginatedResponse<AuditLog>>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });

      const response = await gameforgeAPI.get<PaginatedResponse<AuditLog>>(`/security/audit-logs?${params}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch audit logs',
          code: 'AUDIT_LOG_FETCH_FAILED'
        }
      };
    }
  }

  // ========================================
  // SECURITY EVENTS
  // ========================================

  /**
   * Create a security event
   */
  async createSecurityEvent(request: CreateSecurityEventRequest): Promise<SecurityResponse<SecurityEvent>> {
    try {
      const response = await gameforgeAPI.post<SecurityEvent>('/security/events', request);
      return {
        success: true,
        data: response.data,
        security_context: {
          audit_logged: true,
          risk_assessed: true,
          scan_triggered: request.severity === 'critical'
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to create security event',
          code: 'SECURITY_EVENT_CREATION_FAILED'
        }
      };
    }
  }

  /**
   * Get security events with filters
   */
  async getSecurityEvents(filter: SecurityEventFilter): Promise<SecurityResponse<PaginatedResponse<SecurityEvent>>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });

      const response = await gameforgeAPI.get<PaginatedResponse<SecurityEvent>>(`/security/events?${params}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch security events',
          code: 'SECURITY_EVENT_FETCH_FAILED'
        }
      };
    }
  }

  /**
   * Resolve a security event
   */
  async resolveSecurityEvent(eventId: string, resolutionNotes: string): Promise<SecurityResponse<SecurityEvent>> {
    try {
      const response = await gameforgeAPI.patch<SecurityEvent>(`/security/events/${eventId}/resolve`, {
        resolution_notes: resolutionNotes
      });
      return {
        success: true,
        data: response.data,
        security_context: {
          audit_logged: true,
          risk_assessed: true,
          scan_triggered: false
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to resolve security event',
          code: 'SECURITY_EVENT_RESOLUTION_FAILED'
        }
      };
    }
  }

  // ========================================
  // SECURITY SCANS
  // ========================================

  /**
   * Start a security scan
   */
  async startSecurityScan(request: CreateSecurityScanRequest): Promise<SecurityResponse<SecurityScan>> {
    try {
      const response = await gameforgeAPI.post<SecurityScan>('/security/scans', request);
      return {
        success: true,
        data: response.data,
        security_context: {
          audit_logged: true,
          risk_assessed: true,
          scan_triggered: true
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to start security scan',
          code: 'SECURITY_SCAN_START_FAILED'
        }
      };
    }
  }

  /**
   * Get security scan results
   */
  async getSecurityScan(scanId: string): Promise<SecurityResponse<SecurityScan>> {
    try {
      const response = await gameforgeAPI.get<SecurityScan>(`/security/scans/${scanId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch security scan',
          code: 'SECURITY_SCAN_FETCH_FAILED'
        }
      };
    }
  }

  /**
   * Get user's security scans
   */
  async getUserSecurityScans(userId: string): Promise<SecurityResponse<SecurityScan[]>> {
    try {
      const response = await gameforgeAPI.get<SecurityScan[]>(`/security/scans/user/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch user security scans',
          code: 'USER_SECURITY_SCAN_FETCH_FAILED'
        }
      };
    }
  }

  // ========================================
  // RATE LIMITS
  // ========================================

  /**
   * Get rate limit status for a resource
   */
  async getRateLimitStatus(resource: string): Promise<SecurityResponse<RateLimitStatus>> {
    try {
      const response = await gameforgeAPI.get<RateLimitStatus>(`/security/rate-limits/${encodeURIComponent(resource)}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch rate limit status',
          code: 'RATE_LIMIT_STATUS_FETCH_FAILED'
        }
      };
    }
  }

  /**
   * Get all rate limits for a user
   */
  async getUserRateLimits(userId: string): Promise<SecurityResponse<RateLimit[]>> {
    try {
      const response = await gameforgeAPI.get<RateLimit[]>(`/security/rate-limits/user/${userId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch user rate limits',
          code: 'USER_RATE_LIMIT_FETCH_FAILED'
        }
      };
    }
  }

  /**
   * Reset rate limit for a user/resource
   */
  async resetRateLimit(userId: string, resource: string): Promise<SecurityResponse<void>> {
    try {
      await gameforgeAPI.post(`/security/rate-limits/reset`, { user_id: userId, resource });
      return {
        success: true,
        security_context: {
          audit_logged: true,
          risk_assessed: true,
          scan_triggered: false
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to reset rate limit',
          code: 'RATE_LIMIT_RESET_FAILED'
        }
      };
    }
  }

  // ========================================
  // SECURITY METRICS & CONFIG
  // ========================================

  /**
   * Get security metrics
   */
  async getSecurityMetrics(): Promise<SecurityResponse<SecurityMetrics>> {
    try {
      const response = await gameforgeAPI.get<SecurityMetrics>('/security/metrics');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch security metrics',
          code: 'SECURITY_METRICS_FETCH_FAILED'
        }
      };
    }
  }

  /**
   * Get security configuration
   */
  async getSecurityConfig(): Promise<SecurityResponse<SecurityConfig>> {
    try {
      const response = await gameforgeAPI.get<SecurityConfig>('/security/config');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch security config',
          code: 'SECURITY_CONFIG_FETCH_FAILED'
        }
      };
    }
  }

  /**
   * Update security configuration
   */
  async updateSecurityConfig(config: Partial<SecurityConfig>): Promise<SecurityResponse<SecurityConfig>> {
    try {
      const response = await gameforgeAPI.patch<SecurityConfig>('/security/config', config);
      return {
        success: true,
        data: response.data,
        security_context: {
          audit_logged: true,
          risk_assessed: true,
          scan_triggered: false
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to update security config',
          code: 'SECURITY_CONFIG_UPDATE_FAILED'
        }
      };
    }
  }
}

// Export singleton instance
export const securityAPI = new SecurityAPI();
export default securityAPI;