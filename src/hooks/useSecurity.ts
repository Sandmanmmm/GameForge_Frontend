/**
 * Security & Authentication React Hooks
 * ====================================
 * 
 * Custom React hooks for security and authentication operations.
 * Provides easy-to-use hooks for components to interact with security APIs.
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { securityAPI } from '../services/securityAPI';
import {
  AccessToken,
  UserSession,
  ApiKey,
  AuditLog,
  SecurityEvent,
  SecurityScan,
  RateLimit,
  SecurityMetrics,
  SecurityConfig,
  AuditLogFilter,
  SecurityEventFilter,
  CreateApiKeyRequest,
  CreateSecurityEventRequest,
  CreateSecurityScanRequest
} from '../types/security';

// ========================================
// ACCESS TOKENS HOOKS
// ========================================

export function useAccessTokens(userId?: string) {
  const [tokens, setTokens] = useState<AccessToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await securityAPI.getUserTokens(userId);
      if (response.success && response.data) {
        setTokens(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch tokens');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tokens');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const revokeToken = useCallback(async (tokenId: string) => {
    try {
      const response = await securityAPI.revokeToken(tokenId);
      if (response.success) {
        setTokens(prev => prev.filter(token => token.id !== tokenId));
        toast.success('Token revoked successfully');
      } else {
        toast.error(response.error?.message || 'Failed to revoke token');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to revoke token');
    }
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return {
    tokens,
    loading,
    error,
    revokeToken,
    refetch: fetchTokens
  };
}

// ========================================
// USER SESSIONS HOOKS
// ========================================

export function useUserSessions(userId?: string) {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await securityAPI.getUserSessions(userId);
      if (response.success && response.data) {
        setSessions(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch sessions');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const terminateSession = useCallback(async (sessionId: string, reason?: string) => {
    try {
      const response = await securityAPI.terminateSession(sessionId, reason);
      if (response.success) {
        setSessions(prev => prev.filter(session => session.id !== sessionId));
        toast.success('Session terminated successfully');
      } else {
        toast.error(response.error?.message || 'Failed to terminate session');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to terminate session');
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    terminateSession,
    refetch: fetchSessions
  };
}

// ========================================
// API KEYS HOOKS
// ========================================

export function useApiKeys(userId?: string) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKeys = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await securityAPI.getUserApiKeys(userId);
      if (response.success && response.data) {
        setApiKeys(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch API keys');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createApiKey = useCallback(async (request: CreateApiKeyRequest) => {
    try {
      const response = await securityAPI.createApiKey(request);
      if (response.success && response.data) {
        await fetchApiKeys(); // Refresh the list
        toast.success('API key created successfully');
        return response.data;
      } else {
        toast.error(response.error?.message || 'Failed to create API key');
        return null;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to create API key');
      return null;
    }
  }, [fetchApiKeys]);

  const revokeApiKey = useCallback(async (keyId: string) => {
    try {
      const response = await securityAPI.revokeApiKey(keyId);
      if (response.success) {
        setApiKeys(prev => prev.filter(key => key.id !== keyId));
        toast.success('API key revoked successfully');
      } else {
        toast.error(response.error?.message || 'Failed to revoke API key');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to revoke API key');
    }
  }, []);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  return {
    apiKeys,
    loading,
    error,
    createApiKey,
    revokeApiKey,
    refetch: fetchApiKeys
  };
}

// ========================================
// AUDIT LOGS HOOKS
// ========================================

export function useAuditLogs(filter: AuditLogFilter = {}) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await securityAPI.getAuditLogs(filter);
      if (response.success && response.data) {
        setAuditLogs(response.data.items);
        setTotalCount(response.data.total);
      } else {
        setError(response.error?.message || 'Failed to fetch audit logs');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return {
    auditLogs,
    loading,
    error,
    totalCount,
    refetch: fetchAuditLogs
  };
}

// ========================================
// SECURITY EVENTS HOOKS
// ========================================

export function useSecurityEvents(filter: SecurityEventFilter = {}) {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSecurityEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await securityAPI.getSecurityEvents(filter);
      if (response.success && response.data) {
        setSecurityEvents(response.data.items);
        setTotalCount(response.data.total);
      } else {
        setError(response.error?.message || 'Failed to fetch security events');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch security events');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const createSecurityEvent = useCallback(async (request: CreateSecurityEventRequest) => {
    try {
      const response = await securityAPI.createSecurityEvent(request);
      if (response.success) {
        await fetchSecurityEvents(); // Refresh the list
        return true;
      } else {
        console.error('Failed to create security event:', response.error?.message);
        return false;
      }
    } catch (err: any) {
      console.error('Failed to create security event:', err.message);
      return false;
    }
  }, [fetchSecurityEvents]);

  const resolveSecurityEvent = useCallback(async (eventId: string, resolutionNotes: string) => {
    try {
      const response = await securityAPI.resolveSecurityEvent(eventId, resolutionNotes);
      if (response.success) {
        setSecurityEvents(prev => 
          prev.map(event => 
            event.id === eventId 
              ? { ...event, resolved: true, resolution_notes: resolutionNotes }
              : event
          )
        );
        toast.success('Security event resolved successfully');
      } else {
        toast.error(response.error?.message || 'Failed to resolve security event');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to resolve security event');
    }
  }, []);

  useEffect(() => {
    fetchSecurityEvents();
  }, [fetchSecurityEvents]);

  return {
    securityEvents,
    loading,
    error,
    totalCount,
    createSecurityEvent,
    resolveSecurityEvent,
    refetch: fetchSecurityEvents
  };
}

// ========================================
// SECURITY SCANS HOOKS
// ========================================

export function useSecurityScans(userId?: string) {
  const [securityScans, setSecurityScans] = useState<SecurityScan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSecurityScans = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await securityAPI.getUserSecurityScans(userId);
      if (response.success && response.data) {
        setSecurityScans(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch security scans');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch security scans');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const startSecurityScan = useCallback(async (request: CreateSecurityScanRequest) => {
    try {
      const response = await securityAPI.startSecurityScan(request);
      if (response.success && response.data) {
        setSecurityScans(prev => [response.data!, ...prev]);
        toast.success('Security scan started successfully');
        return response.data;
      } else {
        toast.error(response.error?.message || 'Failed to start security scan');
        return null;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to start security scan');
      return null;
    }
  }, []);

  useEffect(() => {
    fetchSecurityScans();
  }, [fetchSecurityScans]);

  return {
    securityScans,
    loading,
    error,
    startSecurityScan,
    refetch: fetchSecurityScans
  };
}

// ========================================
// RATE LIMITS HOOKS
// ========================================

export function useRateLimits(userId?: string) {
  const [rateLimits, setRateLimits] = useState<RateLimit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRateLimits = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await securityAPI.getUserRateLimits(userId);
      if (response.success && response.data) {
        setRateLimits(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch rate limits');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rate limits');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const resetRateLimit = useCallback(async (resource: string) => {
    if (!userId) return;

    try {
      const response = await securityAPI.resetRateLimit(userId, resource);
      if (response.success) {
        await fetchRateLimits(); // Refresh the list
        toast.success('Rate limit reset successfully');
      } else {
        toast.error(response.error?.message || 'Failed to reset rate limit');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset rate limit');
    }
  }, [userId, fetchRateLimits]);

  useEffect(() => {
    fetchRateLimits();
  }, [fetchRateLimits]);

  return {
    rateLimits,
    loading,
    error,
    resetRateLimit,
    refetch: fetchRateLimits
  };
}

// ========================================
// SECURITY METRICS HOOKS
// ========================================

export function useSecurityMetrics() {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await securityAPI.getSecurityMetrics();
      if (response.success && response.data) {
        setMetrics(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch security metrics');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch security metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics
  };
}

// ========================================
// SECURITY CONFIG HOOKS
// ========================================

export function useSecurityConfig() {
  const [config, setConfig] = useState<SecurityConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await securityAPI.getSecurityConfig();
      if (response.success && response.data) {
        setConfig(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch security config');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch security config');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (updates: Partial<SecurityConfig>) => {
    try {
      const response = await securityAPI.updateSecurityConfig(updates);
      if (response.success && response.data) {
        setConfig(response.data);
        toast.success('Security configuration updated successfully');
        return true;
      } else {
        toast.error(response.error?.message || 'Failed to update security config');
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update security config');
      return false;
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return {
    config,
    loading,
    error,
    updateConfig,
    refetch: fetchConfig
  };
}