/**
 * Security & Authentication Type Definitions
 * ===========================================
 * 
 * Production-ready TypeScript interfaces for security-related database tables:
 * - access_tokens
 * - user_sessions  
 * - api_keys
 * - audit_logs
 * - security_events
 * - security_scans
 * - rate_limits
 * 
 * These types ensure type safety and proper integration with the backend API.
 */

// ========================================
// ACCESS TOKENS
// ========================================

export interface AccessToken {
  id: string;
  user_id: string;
  token_hash: string;
  token_type: 'bearer' | 'refresh' | 'api' | 'temporary';
  scope?: string[];
  expires_at: string;
  created_at: string;
  updated_at: string;
  revoked_at?: string;
  last_used_at?: string;
  client_id?: string;
  client_name?: string;
  ip_address?: string;
  user_agent?: string;
  is_active: boolean;
}

export interface CreateAccessTokenRequest {
  user_id: string;
  token_type: AccessToken['token_type'];
  scope?: string[];
  expires_in?: number; // seconds
  client_id?: string;
  client_name?: string;
}

export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string[];
}

// ========================================
// USER SESSIONS
// ========================================

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  device_id?: string;
  device_name?: string;
  device_type?: 'web' | 'mobile' | 'desktop' | 'api';
  ip_address: string;
  user_agent?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  expires_at: string;
  logout_at?: string;
  logout_reason?: 'user_logout' | 'session_timeout' | 'security_logout' | 'admin_logout';
}

export interface CreateSessionRequest {
  user_id: string;
  device_name?: string;
  device_type?: UserSession['device_type'];
  ip_address: string;
  user_agent?: string;
  remember_me?: boolean;
}

export interface SessionActivity {
  session_id: string;
  activity_type: 'login' | 'page_view' | 'api_call' | 'logout';
  activity_data?: Record<string, any>;
  timestamp: string;
  ip_address: string;
}

// ========================================
// API KEYS
// ========================================

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  key_prefix: string; // First 8 chars for identification
  key_hash: string;
  permissions: string[];
  rate_limit?: {
    requests_per_minute?: number;
    requests_per_hour?: number;
    requests_per_day?: number;
  };
  allowed_ips?: string[];
  allowed_domains?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_used_at?: string;
  expires_at?: string;
  usage_count: number;
}

export interface CreateApiKeyRequest {
  name: string;
  description?: string;
  permissions: string[];
  rate_limit?: ApiKey['rate_limit'];
  allowed_ips?: string[];
  allowed_domains?: string[];
  expires_in_days?: number;
}

export interface ApiKeyResponse {
  api_key: string;
  key_info: Omit<ApiKey, 'key_hash'>;
}

// ========================================
// AUDIT LOGS
// ========================================

export interface AuditLog {
  id: string;
  user_id?: string;
  session_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  resource_name?: string;
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  metadata?: Record<string, any>;
  ip_address: string;
  user_agent?: string;
  success: boolean;
  error_message?: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export interface CreateAuditLogRequest {
  action: string;
  resource_type: string;
  resource_id?: string;
  resource_name?: string;
  changes?: AuditLog['changes'];
  metadata?: Record<string, any>;
  success: boolean;
  error_message?: string;
  risk_level: AuditLog['risk_level'];
}

export interface AuditLogFilter {
  user_id?: string;
  action?: string;
  resource_type?: string;
  risk_level?: AuditLog['risk_level'];
  start_date?: string;
  end_date?: string;
  success?: boolean;
  limit?: number;
  offset?: number;
}

// ========================================
// SECURITY EVENTS
// ========================================

export interface SecurityEvent {
  id: string;
  user_id?: string;
  session_id?: string;
  event_type: 
    | 'login_attempt'
    | 'login_success'
    | 'login_failure'
    | 'password_change'
    | 'account_lockout'
    | 'suspicious_activity'
    | 'rate_limit_exceeded'
    | 'unauthorized_access'
    | 'data_breach_attempt'
    | 'malware_detected'
    | 'brute_force_attack';
  severity: 'info' | 'warning' | 'error' | 'critical';
  description: string;
  details?: Record<string, any>;
  ip_address: string;
  user_agent?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
  created_at: string;
}

export interface CreateSecurityEventRequest {
  user_id?: string;
  session_id?: string;
  event_type: SecurityEvent['event_type'];
  severity: SecurityEvent['severity'];
  description: string;
  details?: Record<string, any>;
  ip_address: string;
  user_agent?: string;
}

export interface SecurityEventFilter {
  user_id?: string;
  event_type?: SecurityEvent['event_type'];
  severity?: SecurityEvent['severity'];
  resolved?: boolean;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

// ========================================
// SECURITY SCANS
// ========================================

export interface SecurityScan {
  id: string;
  scan_type: 'vulnerability' | 'malware' | 'compliance' | 'penetration' | 'code_analysis';
  target_type: 'user' | 'project' | 'asset' | 'system' | 'api';
  target_id?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  scan_duration?: number; // seconds
  findings: SecurityFinding[];
  risk_score: number; // 0-100
  recommendations?: string[];
  metadata?: Record<string, any>;
  created_by?: string;
  created_at: string;
}

export interface SecurityFinding {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  evidence?: Record<string, any>;
  remediation?: string;
  cve_id?: string;
  cvss_score?: number;
  false_positive: boolean;
  resolved: boolean;
  resolved_at?: string;
}

export interface CreateSecurityScanRequest {
  scan_type: SecurityScan['scan_type'];
  target_type: SecurityScan['target_type'];
  target_id?: string;
  metadata?: Record<string, any>;
}

// ========================================
// RATE LIMITS
// ========================================

export interface RateLimit {
  id: string;
  user_id?: string;
  api_key_id?: string;
  ip_address?: string;
  resource: string; // API endpoint or resource identifier
  limit_type: 'per_minute' | 'per_hour' | 'per_day' | 'per_month';
  limit_value: number;
  current_usage: number;
  reset_at: string;
  exceeded_count: number;
  first_exceeded_at?: string;
  last_exceeded_at?: string;
  is_blocked: boolean;
  blocked_until?: string;
  created_at: string;
  updated_at: string;
}

export interface RateLimitRule {
  id: string;
  resource: string;
  user_type?: 'basic_user' | 'premium_user' | 'ai_user' | 'admin' | 'super_admin';
  limits: {
    per_minute?: number;
    per_hour?: number;
    per_day?: number;
    per_month?: number;
  };
  enforcement_action: 'throttle' | 'block' | 'warn';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RateLimitStatus {
  resource: string;
  remaining: number;
  limit: number;
  reset_at: string;
  is_exceeded: boolean;
  retry_after?: number; // seconds
}

export interface CreateRateLimitRequest {
  resource: string;
  limit_type: RateLimit['limit_type'];
  limit_value: number;
}

// ========================================
// COMMON TYPES
// ========================================

export interface SecurityMetrics {
  active_sessions: number;
  failed_login_attempts_24h: number;
  security_events_24h: number;
  critical_security_events: number;
  blocked_ips: number;
  rate_limit_violations_24h: number;
  last_security_scan?: string;
  vulnerabilities_found: number;
}

export interface SecurityConfig {
  session_timeout: number; // minutes
  max_failed_attempts: number;
  lockout_duration: number; // minutes
  password_requirements: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_symbols: boolean;
  };
  api_rate_limits: Record<string, number>;
  security_scan_frequency: number; // hours
}

// ========================================
// API RESPONSE TYPES
// ========================================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface SecurityResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  security_context?: {
    audit_logged: boolean;
    risk_assessed: boolean;
    scan_triggered: boolean;
  };
}