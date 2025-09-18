/**
 * Analytics API Service
 * ====================
 * 
 * Complete API service for analytics_events, performance_metrics,
 * usage_metrics, and activity_logs with external backend integration
 */

import { gameforgeAPI } from './api';
import {
  AnalyticsEvent,
  PerformanceMetrics,
  UsageMetrics,
  ActivityLog,
  AnalyticsDashboard,
  AnalyticsResponse,
  AnalyticsPaginatedResponse,
  AnalyticsFilters,
  TimePeriod,
  EventType,
  ActivityType,
  TrendData,
  AnalyticsInsight,
  AnalyticsConfig
} from '../types/analytics';

class AnalyticsAPI {
  // ========================================
  // EVENT TRACKING
  // ========================================

  /**
   * Track a single analytics event
   */
  async trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<AnalyticsResponse<{ event_id: string }>> {
    try {
      const response = await gameforgeAPI.post('/analytics/events', {
        ...event,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: response.data as { event_id: string },
        metadata: {
          timestamp: new Date().toISOString(),
          request_id: response.headers?.['x-request-id'] || '',
          processing_time: Date.now() - Date.now() // Placeholder
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'UNKNOWN_ERROR',
          message: error.message || 'Failed to track event',
          details: error.response?.data
        }
      };
    }
  }

  /**
   * Track multiple events in batch
   */
  async trackEventsBatch(events: Omit<AnalyticsEvent, 'id' | 'timestamp'>[]): Promise<AnalyticsResponse<{ processed_count: number; failed_count: number }>> {
    try {
      const response = await gameforgeAPI.post('/analytics/events/batch', {
        events: events.map(event => ({
          ...event,
          timestamp: new Date().toISOString()
        }))
      });

      return {
        success: true,
        data: response.data as { processed_count: number; failed_count: number }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'BATCH_TRACKING_FAILED',
          message: error.message || 'Failed to track events batch'
        }
      };
    }
  }

  /**
   * Get analytics events with filtering
   */
  async getEvents(
    filters: AnalyticsFilters = {},
    page: number = 1,
    limit: number = 50
  ): Promise<AnalyticsPaginatedResponse<AnalyticsEvent[]>> {
    try {
      const response = await gameforgeAPI.get('/analytics/events', {
        params: { ...filters, page, limit }
      });

      return {
        success: true,
        data: response.data.data as AnalyticsEvent[],
        pagination: response.data.pagination,
        metadata: {
          timestamp: new Date().toISOString(),
          request_id: response.headers?.['x-request-id'] || '',
          processing_time: 0
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'EVENTS_FETCH_FAILED',
          message: error.message || 'Failed to fetch events'
        },
        pagination: {
          page: 1,
          per_page: limit,
          total: 0,
          total_pages: 0,
          has_next: false,
          has_previous: false
        }
      };
    }
  }

  // ========================================
  // PERFORMANCE METRICS
  // ========================================

  /**
   * Submit performance metrics
   */
  async submitPerformanceMetrics(metrics: Omit<PerformanceMetrics, 'id' | 'timestamp'>): Promise<AnalyticsResponse<{ metrics_id: string }>> {
    try {
      const response = await gameforgeAPI.post('/analytics/performance', {
        ...metrics,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: response.data as { metrics_id: string }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'PERFORMANCE_SUBMIT_FAILED',
          message: error.message || 'Failed to submit performance metrics'
        }
      };
    }
  }

  /**
   * Get performance metrics for a user
   */
  async getPerformanceMetrics(
    userId: string,
    timePeriod: TimePeriod = 'last_24_hours'
  ): Promise<AnalyticsResponse<PerformanceMetrics[]>> {
    try {
      const response = await gameforgeAPI.get(`/analytics/performance/${userId}`, {
        params: { time_period: timePeriod }
      });

      return {
        success: true,
        data: response.data as PerformanceMetrics[]
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'PERFORMANCE_FETCH_FAILED',
          message: error.message || 'Failed to fetch performance metrics'
        }
      };
    }
  }

  /**
   * Get aggregated performance overview
   */
  async getPerformanceOverview(
    userId: string,
    timePeriod: TimePeriod = 'last_7_days'
  ): Promise<AnalyticsResponse<any>> {
    try {
      const response = await gameforgeAPI.get(`/analytics/performance/${userId}/overview`, {
        params: { time_period: timePeriod }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'PERFORMANCE_OVERVIEW_FAILED',
          message: error.message || 'Failed to fetch performance overview'
        }
      };
    }
  }

  // ========================================
  // USAGE METRICS
  // ========================================

  /**
   * Submit usage metrics
   */
  async submitUsageMetrics(metrics: Omit<UsageMetrics, 'id'>): Promise<AnalyticsResponse<{ metrics_id: string }>> {
    try {
      const response = await gameforgeAPI.post('/analytics/usage', metrics);

      return {
        success: true,
        data: response.data as { metrics_id: string }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'USAGE_SUBMIT_FAILED',
          message: error.message || 'Failed to submit usage metrics'
        }
      };
    }
  }

  /**
   * Get usage metrics for a user
   */
  async getUsageMetrics(
    userId: string,
    timePeriod: TimePeriod = 'last_30_days'
  ): Promise<AnalyticsResponse<UsageMetrics[]>> {
    try {
      const response = await gameforgeAPI.get(`/analytics/usage/${userId}`, {
        params: { time_period: timePeriod }
      });

      return {
        success: true,
        data: response.data as UsageMetrics[]
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'USAGE_FETCH_FAILED',
          message: error.message || 'Failed to fetch usage metrics'
        }
      };
    }
  }

  /**
   * Get usage trends
   */
  async getUsageTrends(
    userId: string,
    metric: string,
    timePeriod: TimePeriod = 'last_30_days'
  ): Promise<AnalyticsResponse<TrendData>> {
    try {
      const response = await gameforgeAPI.get(`/analytics/usage/${userId}/trends`, {
        params: { metric, time_period: timePeriod }
      });

      return {
        success: true,
        data: response.data as TrendData
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'USAGE_TRENDS_FAILED',
          message: error.message || 'Failed to fetch usage trends'
        }
      };
    }
  }

  // ========================================
  // ACTIVITY LOGS
  // ========================================

  /**
   * Log an activity
   */
  async logActivity(activity: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<AnalyticsResponse<{ activity_id: string }>> {
    try {
      const response = await gameforgeAPI.post('/analytics/activities', {
        ...activity,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: response.data as { activity_id: string }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'ACTIVITY_LOG_FAILED',
          message: error.message || 'Failed to log activity'
        }
      };
    }
  }

  /**
   * Get activity logs for a user
   */
  async getActivityLogs(
    userId: string,
    filters: AnalyticsFilters = {},
    page: number = 1,
    limit: number = 50
  ): Promise<AnalyticsPaginatedResponse<ActivityLog[]>> {
    try {
      const response = await gameforgeAPI.get(`/analytics/activities/${userId}`, {
        params: { ...filters, page, limit }
      });

      return {
        success: true,
        data: response.data.data as ActivityLog[],
        pagination: response.data.pagination
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'ACTIVITY_LOGS_FAILED',
          message: error.message || 'Failed to fetch activity logs'
        },
        pagination: {
          page: 1,
          per_page: limit,
          total: 0,
          total_pages: 0,
          has_next: false,
          has_previous: false
        }
      };
    }
  }

  /**
   * Get activity summary
   */
  async getActivitySummary(
    userId: string,
    timePeriod: TimePeriod = 'last_7_days'
  ): Promise<AnalyticsResponse<any>> {
    try {
      const response = await gameforgeAPI.get(`/analytics/activities/${userId}/summary`, {
        params: { time_period: timePeriod }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'ACTIVITY_SUMMARY_FAILED',
          message: error.message || 'Failed to fetch activity summary'
        }
      };
    }
  }

  // ========================================
  // DASHBOARD & AGGREGATIONS
  // ========================================

  /**
   * Get comprehensive analytics dashboard
   */
  async getDashboard(
    userId: string,
    timePeriod: TimePeriod = 'last_7_days'
  ): Promise<AnalyticsResponse<AnalyticsDashboard>> {
    try {
      const response = await gameforgeAPI.get(`/analytics/dashboard/${userId}`, {
        params: { time_period: timePeriod }
      });

      return {
        success: true,
        data: response.data as AnalyticsDashboard
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'DASHBOARD_FAILED',
          message: error.message || 'Failed to fetch analytics dashboard'
        }
      };
    }
  }

  /**
   * Get analytics insights
   */
  async getInsights(
    userId: string,
    timePeriod: TimePeriod = 'last_30_days'
  ): Promise<AnalyticsResponse<AnalyticsInsight[]>> {
    try {
      const response = await gameforgeAPI.get(`/analytics/insights/${userId}`, {
        params: { time_period: timePeriod }
      });

      return {
        success: true,
        data: response.data as AnalyticsInsight[]
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'INSIGHTS_FAILED',
          message: error.message || 'Failed to fetch analytics insights'
        }
      };
    }
  }

  /**
   * Get trend data for multiple metrics
   */
  async getTrendData(
    userId: string,
    metrics: string[],
    timePeriod: TimePeriod = 'last_30_days'
  ): Promise<AnalyticsResponse<TrendData[]>> {
    try {
      const response = await gameforgeAPI.get(`/analytics/trends/${userId}`, {
        params: { metrics: metrics.join(','), time_period: timePeriod }
      });

      return {
        success: true,
        data: response.data as TrendData[]
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'TRENDS_FAILED',
          message: error.message || 'Failed to fetch trend data'
        }
      };
    }
  }

  // ========================================
  // CONFIGURATION & SETTINGS
  // ========================================

  /**
   * Get analytics configuration
   */
  async getConfig(userId: string): Promise<AnalyticsResponse<AnalyticsConfig>> {
    try {
      const response = await gameforgeAPI.get(`/analytics/config/${userId}`);

      return {
        success: true,
        data: response.data as AnalyticsConfig
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'CONFIG_FAILED',
          message: error.message || 'Failed to fetch analytics configuration'
        }
      };
    }
  }

  /**
   * Update analytics configuration
   */
  async updateConfig(
    userId: string,
    config: Partial<AnalyticsConfig>
  ): Promise<AnalyticsResponse<AnalyticsConfig>> {
    try {
      const response = await gameforgeAPI.put(`/analytics/config/${userId}`, config);

      return {
        success: true,
        data: response.data as AnalyticsConfig
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.response?.status?.toString() || 'CONFIG_UPDATE_FAILED',
          message: error.message || 'Failed to update analytics configuration'
        }
      };
    }
  }

  // ========================================
  // REAL-TIME TRACKING HELPERS
  // ========================================

  /**
   * Quick event tracking for common actions
   */
  async quickTrack(eventName: string, properties: Record<string, any> = {}, userId?: string): Promise<void> {
    if (!userId) return; // Don't track if no user

    await this.trackEvent({
      user_id: userId,
      session_id: this.getCurrentSessionId(),
      event_type: 'user_action',
      event_name: eventName,
      event_category: 'interaction',
      properties,
      source: 'web_app',
      platform: 'web'
    });
  }

  /**
   * Track page view
   */
  async trackPageView(path: string, userId?: string, additionalProps: Record<string, any> = {}): Promise<void> {
    if (!userId) return;

    await this.trackEvent({
      user_id: userId,
      session_id: this.getCurrentSessionId(),
      event_type: 'user_action',
      event_name: 'page_view',
      event_category: 'navigation',
      properties: {
        page_path: path,
        page_title: document.title,
        referrer: document.referrer,
        ...additionalProps
      },
      source: 'web_app',
      platform: 'web'
    });
  }

  /**
   * Track error events
   */
  async trackError(error: Error, userId?: string, context: Record<string, any> = {}): Promise<void> {
    if (!userId) return;

    await this.trackEvent({
      user_id: userId,
      session_id: this.getCurrentSessionId(),
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
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  private getCurrentSessionId(): string {
    // Get or create session ID
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Collect basic performance metrics
   */
  getPerformanceData(): Partial<PerformanceMetrics> {
    if (!window.performance) return {};

    const navigation = window.performance.getEntriesByType('navigation')[0] as any;
    const paint = window.performance.getEntriesByType('paint');

    return {
      page_load_time: navigation?.loadEventEnd - navigation?.navigationStart || 0,
      time_to_first_byte: navigation?.responseStart - navigation?.requestStart || 0,
      first_contentful_paint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      memory_usage: (window.performance as any).memory ? {
        used_heap_size: (window.performance as any).memory.usedJSHeapSize,
        total_heap_size: (window.performance as any).memory.totalJSHeapSize,
        heap_size_limit: (window.performance as any).memory.jsHeapSizeLimit,
        memory_usage_percentage: ((window.performance as any).memory.usedJSHeapSize / (window.performance as any).memory.jsHeapSizeLimit) * 100
      } : {
        used_heap_size: 0,
        total_heap_size: 0,
        heap_size_limit: 0,
        memory_usage_percentage: 0
      },
      device_info: {
        device_type: this.getDeviceType(),
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        pixel_density: window.devicePixelRatio || 1
      },
      network_info: {
        connection_type: (navigator as any).connection?.type || 'unknown',
        effective_type: (navigator as any).connection?.effectiveType || 'unknown',
        download_speed: (navigator as any).connection?.downlink || 0,
        upload_speed: 0, // Not available in browser
        latency: (navigator as any).connection?.rtt || 0
      }
    };
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }
}

// Export singleton instance
export const analyticsAPI = new AnalyticsAPI();