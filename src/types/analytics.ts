/**
 * Analytics Type Definitions
 * ==========================
 * 
 * Comprehensive types for analytics_events, performance_metrics, 
 * usage_metrics, and activity_logs with external API integration
 */

// ========================================
// CORE ANALYTICS TYPES
// ========================================

export interface AnalyticsEvent {
  id: string;
  user_id: string;
  session_id: string;
  event_type: EventType;
  event_name: string;
  event_category: EventCategory;
  properties: Record<string, any>;
  timestamp: string;
  source: EventSource;
  platform: Platform;
  user_agent?: string;
  ip_address?: string;
  location?: GeolocationData;
}

export type EventType = 
  | 'user_action'
  | 'system_event'
  | 'performance_event'
  | 'error_event'
  | 'business_event'
  | 'engagement_event';

export type EventCategory = 
  | 'navigation'
  | 'interaction'
  | 'content'
  | 'marketplace'
  | 'projects'
  | 'assets'
  | 'authentication'
  | 'settings'
  | 'performance'
  | 'errors';

export type EventSource = 
  | 'web_app'
  | 'mobile_app'
  | 'desktop_app'
  | 'api'
  | 'webhook'
  | 'system';

export type Platform = 
  | 'web'
  | 'mobile'
  | 'desktop'
  | 'tablet'
  | 'unknown';

export interface GeolocationData {
  country: string;
  region: string;
  city: string;
  timezone: string;
  latitude?: number;
  longitude?: number;
}

// ========================================
// PERFORMANCE METRICS
// ========================================

export interface PerformanceMetrics {
  id: string;
  user_id: string;
  session_id: string;
  timestamp: string;
  page_load_time: number;
  time_to_first_byte: number;
  first_contentful_paint: number;
  largest_contentful_paint: number;
  cumulative_layout_shift: number;
  first_input_delay: number;
  total_blocking_time: number;
  memory_usage: MemoryMetrics;
  network_info: NetworkMetrics;
  device_info: DeviceMetrics;
  custom_metrics: Record<string, number>;
}

export interface MemoryMetrics {
  used_heap_size: number;
  total_heap_size: number;
  heap_size_limit: number;
  memory_usage_percentage: number;
}

export interface NetworkMetrics {
  connection_type: string;
  effective_type: string;
  download_speed: number;
  upload_speed: number;
  latency: number;
  packet_loss?: number;
}

export interface DeviceMetrics {
  device_type: string;
  screen_resolution: string;
  viewport_size: string;
  pixel_density: number;
  cpu_cores?: number;
  gpu_info?: string;
  battery_level?: number;
  is_low_power_mode?: boolean;
}

// ========================================
// USAGE METRICS
// ========================================

export interface UsageMetrics {
  id: string;
  user_id: string;
  date: string;
  session_count: number;
  total_session_duration: number;
  average_session_duration: number;
  page_views: number;
  unique_pages_visited: number;
  features_used: FeatureUsage[];
  engagement_score: number;
  retention_data: RetentionData;
  conversion_data: ConversionData;
  user_flow: UserFlowData[];
}

export interface FeatureUsage {
  feature_name: string;
  category: string;
  usage_count: number;
  total_time_spent: number;
  last_used: string;
  proficiency_score: number;
}

export interface RetentionData {
  is_new_user: boolean;
  days_since_signup: number;
  days_since_last_visit: number;
  total_visits: number;
  retention_period: string;
  churn_risk_score: number;
}

export interface ConversionData {
  conversion_events: ConversionEvent[];
  funnel_stage: string;
  conversion_rate: number;
  time_to_conversion?: number;
  conversion_value?: number;
}

export interface ConversionEvent {
  event_name: string;
  timestamp: string;
  value?: number;
  properties: Record<string, any>;
}

export interface UserFlowData {
  step_number: number;
  page_path: string;
  action: string;
  timestamp: string;
  duration_on_step: number;
  exit_rate: number;
}

// ========================================
// ACTIVITY LOGS
// ========================================

export interface ActivityLog {
  id: string;
  user_id: string;
  session_id: string;
  timestamp: string;
  activity_type: ActivityType;
  activity_category: ActivityCategory;
  description: string;
  details: ActivityDetails;
  metadata: ActivityMetadata;
  severity: LogSeverity;
  tags: string[];
}

export type ActivityType = 
  | 'user_action'
  | 'system_action'
  | 'api_call'
  | 'data_change'
  | 'authentication'
  | 'authorization'
  | 'error'
  | 'warning'
  | 'info';

export type ActivityCategory = 
  | 'account'
  | 'projects'
  | 'assets'
  | 'marketplace'
  | 'collaboration'
  | 'settings'
  | 'security'
  | 'payment'
  | 'integration'
  | 'system';

export type LogSeverity = 
  | 'critical'
  | 'error'
  | 'warning'
  | 'info'
  | 'debug'
  | 'trace';

export interface ActivityDetails {
  action: string;
  target: string;
  target_id?: string;
  old_value?: any;
  new_value?: any;
  duration?: number;
  result: 'success' | 'failure' | 'partial';
  error_message?: string;
  stack_trace?: string;
}

export interface ActivityMetadata {
  ip_address: string;
  user_agent: string;
  referrer?: string;
  location?: GeolocationData;
  request_id?: string;
  correlation_id?: string;
  parent_activity_id?: string;
}

// ========================================
// ANALYTICS AGGREGATION TYPES
// ========================================

export interface AnalyticsDashboard {
  user_id: string;
  time_period: TimePeriod;
  overview: AnalyticsOverview;
  performance: PerformanceOverview;
  usage: UsageOverview;
  activity: ActivityOverview;
  trends: TrendData[];
  insights: AnalyticsInsight[];
  last_updated: string;
}

export type TimePeriod = 
  | 'last_hour'
  | 'last_24_hours'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'last_year'
  | 'custom';

export interface AnalyticsOverview {
  total_events: number;
  unique_sessions: number;
  average_session_duration: number;
  bounce_rate: number;
  engagement_score: number;
  top_events: EventSummary[];
  top_pages: PageSummary[];
}

export interface PerformanceOverview {
  average_load_time: number;
  performance_score: number;
  core_web_vitals: CoreWebVitals;
  slowest_pages: PagePerformance[];
  performance_trends: PerformanceTrend[];
  issues: PerformanceIssue[];
}

export interface UsageOverview {
  daily_active_users: number;
  feature_adoption: FeatureAdoption[];
  user_journeys: UserJourney[];
  retention_rates: RetentionRate[];
  conversion_funnels: ConversionFunnel[];
}

export interface ActivityOverview {
  total_activities: number;
  activity_breakdown: ActivityBreakdown[];
  recent_activities: ActivityLog[];
  security_events: SecurityEvent[];
  system_health: SystemHealth;
}

export interface EventSummary {
  event_name: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PageSummary {
  page_path: string;
  views: number;
  unique_views: number;
  average_time: number;
  bounce_rate: number;
}

export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

export interface PagePerformance {
  page_path: string;
  average_load_time: number;
  performance_score: number;
  issues: string[];
}

export interface PerformanceTrend {
  date: string;
  average_load_time: number;
  performance_score: number;
  error_rate: number;
}

export interface PerformanceIssue {
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  affected_pages: string[];
  recommendation: string;
}

export interface FeatureAdoption {
  feature_name: string;
  adoption_rate: number;
  usage_trend: 'increasing' | 'decreasing' | 'stable';
  user_satisfaction: number;
}

export interface UserJourney {
  journey_name: string;
  completion_rate: number;
  average_duration: number;
  common_exit_points: string[];
  steps: UserJourneyStep[];
}

export interface UserJourneyStep {
  step_name: string;
  completion_rate: number;
  average_time: number;
  drop_off_rate: number;
}

export interface RetentionRate {
  period: string;
  new_users: number;
  returning_users: number;
  retention_percentage: number;
}

export interface ConversionFunnel {
  funnel_name: string;
  total_users: number;
  conversion_rate: number;
  steps: FunnelStep[];
}

export interface FunnelStep {
  step_name: string;
  users: number;
  conversion_rate: number;
  drop_off_rate: number;
}

export interface ActivityBreakdown {
  category: ActivityCategory;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface SecurityEvent {
  id: string;
  type: string;
  severity: LogSeverity;
  timestamp: string;
  description: string;
  resolved: boolean;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  error_rate: number;
  response_time: number;
  alerts: SystemAlert[];
}

export interface SystemAlert {
  id: string;
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: string;
}

export interface TrendData {
  metric: string;
  period: TimePeriod;
  data_points: DataPoint[];
  trend_direction: 'up' | 'down' | 'stable';
  percentage_change: number;
}

export interface DataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface AnalyticsInsight {
  id: string;
  type: 'opportunity' | 'issue' | 'achievement' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actions: InsightAction[];
  data_sources: string[];
}

export interface InsightAction {
  action: string;
  description: string;
  estimated_impact: string;
  effort_required: 'low' | 'medium' | 'high';
}

// ========================================
// API RESPONSE TYPES
// ========================================

export interface AnalyticsResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    request_id: string;
    processing_time: number;
  };
}

export interface AnalyticsPaginatedResponse<T> extends AnalyticsResponse<T> {
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

// ========================================
// ANALYTICS CONFIGURATION
// ========================================

export interface AnalyticsConfig {
  tracking_enabled: boolean;
  sample_rate: number;
  performance_monitoring: boolean;
  error_tracking: boolean;
  user_tracking: boolean;
  session_tracking: boolean;
  custom_events: boolean;
  data_retention_days: number;
  privacy_mode: boolean;
  excluded_events: string[];
  excluded_pages: string[];
}

export interface AnalyticsFilters {
  start_date?: string;
  end_date?: string;
  user_ids?: string[];
  event_types?: EventType[];
  event_categories?: EventCategory[];
  platforms?: Platform[];
  sources?: EventSource[];
  min_duration?: number;
  max_duration?: number;
  has_errors?: boolean;
  custom_filters?: Record<string, any>;
}