/**
 * Analytics React Hooks
 * =====================
 * 
 * Comprehensive React hooks for analytics data management,
 * event tracking, and real-time metrics updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { analyticsAPI } from '../services/analyticsAPI';
import {
  AnalyticsEvent,
  PerformanceMetrics,
  UsageMetrics,
  ActivityLog,
  AnalyticsDashboard,
  TimePeriod,
  TrendData,
  AnalyticsInsight,
  AnalyticsConfig,
  AnalyticsFilters
} from '../types/analytics';

// ========================================
// ANALYTICS DASHBOARD HOOK
// ========================================

export function useAnalyticsDashboard(userId: string, timePeriod: TimePeriod = 'last_7_days') {
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await analyticsAPI.getDashboard(userId, timePeriod);
      if (response.success && response.data) {
        setDashboard(response.data);
        setError(null);
      } else {
        setError(response.error?.message || 'Failed to load analytics dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics dashboard');
    } finally {
      setLoading(false);
    }
  }, [userId, timePeriod]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard,
    loading,
    error,
    refetch: fetchDashboard
  };
}

// ========================================
// EVENT TRACKING HOOKS
// ========================================

export function useEventTracking(userId?: string) {
  const [isTracking, setIsTracking] = useState(false);
  const eventQueue = useRef<Omit<AnalyticsEvent, 'id' | 'timestamp'>[]>([]);
  const flushTimer = useRef<NodeJS.Timeout | null>(null);

  // Track a single event
  const trackEvent = useCallback(async (
    eventName: string,
    eventCategory: string = 'interaction',
    properties: Record<string, any> = {}
  ) => {
    if (!userId) return;

    const event: Omit<AnalyticsEvent, 'id' | 'timestamp'> = {
      user_id: userId,
      session_id: getSessionId(),
      event_type: 'user_action',
      event_name: eventName,
      event_category: eventCategory as any,
      properties,
      source: 'web_app',
      platform: 'web'
    };

    // Add to queue for batch processing
    eventQueue.current.push(event);
    
    // Schedule flush if not already scheduled
    if (!flushTimer.current) {
      flushTimer.current = setTimeout(flushEvents, 1000); // Flush after 1 second
    }
  }, [userId]);

  // Track page view
  const trackPageView = useCallback(async (path: string, additionalProps: Record<string, any> = {}) => {
    await trackEvent('page_view', 'navigation', {
      page_path: path,
      page_title: document.title,
      referrer: document.referrer,
      ...additionalProps
    });
  }, [trackEvent]);

  // Track user interaction
  const trackInteraction = useCallback(async (element: string, action: string, value?: any) => {
    await trackEvent(`${element}_${action}`, 'interaction', {
      element,
      action,
      value
    });
  }, [trackEvent]);

  // Track error
  const trackError = useCallback(async (error: Error, context: Record<string, any> = {}) => {
    if (!userId) return;

    await analyticsAPI.trackEvent({
      user_id: userId,
      session_id: getSessionId(),
      event_type: 'error_event',
      event_name: 'javascript_error',
      event_category: 'errors',
      properties: {
        error_message: error.message,
        error_stack: error.stack,
        error_name: error.name,
        ...context
      },
      source: 'web_app',
      platform: 'web'
    });
  }, [userId]);

  // Flush events to backend
  const flushEvents = useCallback(async () => {
    if (eventQueue.current.length === 0) return;

    setIsTracking(true);
    try {
      const events = [...eventQueue.current];
      eventQueue.current = [];
      
      if (events.length === 1) {
        await analyticsAPI.trackEvent(events[0]);
      } else {
        await analyticsAPI.trackEventsBatch(events);
      }
    } catch (err) {
      console.error('Failed to flush analytics events:', err);
    } finally {
      setIsTracking(false);
      if (flushTimer.current) {
        clearTimeout(flushTimer.current);
        flushTimer.current = null;
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (flushTimer.current) {
        clearTimeout(flushTimer.current);
        flushEvents();
      }
    };
  }, [flushEvents]);

  return {
    trackEvent,
    trackPageView,
    trackInteraction,
    trackError,
    flushEvents,
    isTracking,
    queueSize: eventQueue.current.length
  };
}

// ========================================
// PERFORMANCE METRICS HOOKS
// ========================================

export function usePerformanceMetrics(userId: string, timePeriod: TimePeriod = 'last_24_hours') {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const [metricsResponse, overviewResponse] = await Promise.all([
        analyticsAPI.getPerformanceMetrics(userId, timePeriod),
        analyticsAPI.getPerformanceOverview(userId, timePeriod)
      ]);

      if (metricsResponse.success && metricsResponse.data) {
        setMetrics(metricsResponse.data);
      }

      if (overviewResponse.success && overviewResponse.data) {
        setOverview(overviewResponse.data);
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load performance metrics');
    } finally {
      setLoading(false);
    }
  }, [userId, timePeriod]);

  // Submit current performance metrics
  const submitCurrentMetrics = useCallback(async () => {
    if (!userId) return;

    const performanceData = analyticsAPI.getPerformanceData();
    if (Object.keys(performanceData).length === 0) return;

    await analyticsAPI.submitPerformanceMetrics({
      user_id: userId,
      session_id: getSessionId(),
      ...performanceData
    } as any);
  }, [userId]);

  useEffect(() => {
    fetchMetrics();
    
    // Submit current metrics on mount
    submitCurrentMetrics();
  }, [fetchMetrics, submitCurrentMetrics]);

  return {
    metrics,
    overview,
    loading,
    error,
    refetch: fetchMetrics,
    submitCurrentMetrics
  };
}

// ========================================
// USAGE METRICS HOOKS
// ========================================

export function useUsageMetrics(userId: string, timePeriod: TimePeriod = 'last_30_days') {
  const [metrics, setMetrics] = useState<UsageMetrics[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsageData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const [metricsResponse, trendsResponse] = await Promise.all([
        analyticsAPI.getUsageMetrics(userId, timePeriod),
        analyticsAPI.getTrendData(userId, ['session_count', 'engagement_score', 'feature_usage'], timePeriod)
      ]);

      if (metricsResponse.success && metricsResponse.data) {
        setMetrics(metricsResponse.data);
      }

      if (trendsResponse.success && trendsResponse.data) {
        setTrends(trendsResponse.data);
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load usage metrics');
    } finally {
      setLoading(false);
    }
  }, [userId, timePeriod]);

  useEffect(() => {
    fetchUsageData();
  }, [fetchUsageData]);

  return {
    metrics,
    trends,
    loading,
    error,
    refetch: fetchUsageData
  };
}

// ========================================
// ACTIVITY LOGS HOOKS
// ========================================

export function useActivityLogs(
  userId: string,
  filters: AnalyticsFilters = {},
  page: number = 1,
  limit: number = 50
) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchActivities = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const [activitiesResponse, summaryResponse] = await Promise.all([
        analyticsAPI.getActivityLogs(userId, filters, page, limit),
        analyticsAPI.getActivitySummary(userId, 'last_7_days')
      ]);

      if (activitiesResponse.success && activitiesResponse.data) {
        setActivities(page === 1 ? activitiesResponse.data : prev => [...prev, ...activitiesResponse.data!]);
        setHasMore(activitiesResponse.pagination?.has_next || false);
      }

      if (summaryResponse.success && summaryResponse.data) {
        setSummary(summaryResponse.data);
      }

      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  }, [userId, filters, page, limit]);

  // Log new activity
  const logActivity = useCallback(async (
    activityType: string,
    description: string,
    details: any = {},
    category: string = 'user_action'
  ) => {
    if (!userId) return;

    await analyticsAPI.logActivity({
      user_id: userId,
      session_id: getSessionId(),
      activity_type: activityType as any,
      activity_category: category as any,
      description,
      details: {
        action: activityType,
        target: details.target || 'unknown',
        target_id: details.target_id,
        result: details.result || 'success',
        ...details
      },
      metadata: {
        ip_address: 'unknown',
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        location: undefined,
        request_id: generateRequestId()
      },
      severity: details.severity || 'info',
      tags: details.tags || []
    });
  }, [userId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    summary,
    loading,
    error,
    hasMore,
    refetch: fetchActivities,
    logActivity
  };
}

// ========================================
// ANALYTICS INSIGHTS HOOKS
// ========================================

export function useAnalyticsInsights(userId: string, timePeriod: TimePeriod = 'last_30_days') {
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await analyticsAPI.getInsights(userId, timePeriod);
      if (response.success && response.data) {
        setInsights(response.data);
        setError(null);
      } else {
        setError(response.error?.message || 'Failed to load insights');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  }, [userId, timePeriod]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    loading,
    error,
    refetch: fetchInsights
  };
}

// ========================================
// ANALYTICS CONFIGURATION HOOKS
// ========================================

export function useAnalyticsConfig(userId: string) {
  const [config, setConfig] = useState<AnalyticsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchConfig = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await analyticsAPI.getConfig(userId);
      if (response.success && response.data) {
        setConfig(response.data);
        setError(null);
      } else {
        setError(response.error?.message || 'Failed to load analytics configuration');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics configuration');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateConfig = useCallback(async (updates: Partial<AnalyticsConfig>) => {
    if (!userId || !config) return;

    setSaving(true);
    try {
      const response = await analyticsAPI.updateConfig(userId, updates);
      if (response.success && response.data) {
        setConfig(response.data);
        setError(null);
      } else {
        setError(response.error?.message || 'Failed to update configuration');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update configuration');
    } finally {
      setSaving(false);
    }
  }, [userId, config]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return {
    config,
    loading,
    error,
    saving,
    updateConfig,
    refetch: fetchConfig
  };
}

// ========================================
// REAL-TIME ANALYTICS HOOK
// ========================================

export function useRealTimeAnalytics(userId: string) {
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  const { trackEvent, trackPageView, trackInteraction } = useEventTracking(userId);

  useEffect(() => {
    if (!userId) return;

    // Initialize WebSocket connection for real-time updates
    const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:8080'}/analytics/realtime/${userId}`;
    
    try {
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        setIsConnected(true);
      };
      
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setRealTimeData(data);
        } catch (err) {
          console.error('Failed to parse real-time analytics data:', err);
        }
      };
      
      ws.current.onclose = () => {
        setIsConnected(false);
      };
      
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (err) {
      console.error('Failed to connect to analytics WebSocket:', err);
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userId]);

  return {
    realTimeData,
    isConnected,
    trackEvent,
    trackPageView,
    trackInteraction
  };
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ========================================
// AUTO-TRACKING HOOK
// ========================================

export function useAutoTracking(userId?: string) {
  const { trackPageView, trackError } = useEventTracking(userId);

  useEffect(() => {
    if (!userId) return;

    // Track initial page view
    trackPageView(window.location.pathname);

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackPageView(window.location.pathname, { visibility_change: true });
      }
    };

    // Track unhandled errors
    const handleError = (event: ErrorEvent) => {
      trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };

    // Track unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error(String(event.reason)), {
        type: 'unhandled_promise_rejection'
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [userId, trackPageView, trackError]);
}