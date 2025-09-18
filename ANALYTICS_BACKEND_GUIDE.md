# Analytics API Backend Implementation Guide

This guide provides complete implementation details for the analytics API endpoints required by the GameForge frontend analytics system.

## Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Implementation Examples](#implementation-examples)
6. [Security Considerations](#security-considerations)
7. [Performance Optimization](#performance-optimization)

## Overview

The analytics system tracks four main types of data:
- **Analytics Events**: User interactions, system events, and business events
- **Performance Metrics**: Page load times, web vitals, and performance data
- **Usage Metrics**: Session data, feature usage, and engagement metrics
- **Activity Logs**: Detailed activity tracking and audit trails

## Database Schema

### 1. Analytics Events Table

```sql
CREATE TABLE analytics_events (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    session_id VARCHAR(36) NOT NULL,
    event_type ENUM('user_action', 'system_event', 'performance_event', 'error_event', 'business_event', 'engagement_event') NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_category ENUM('navigation', 'interaction', 'content', 'marketplace', 'projects', 'assets', 'authentication', 'settings', 'performance', 'errors') NOT NULL,
    properties JSON,
    timestamp TIMESTAMP NOT NULL,
    source ENUM('web_app', 'mobile_app', 'desktop_app', 'api', 'webhook', 'system') NOT NULL,
    platform ENUM('web', 'mobile', 'desktop', 'tablet', 'unknown') NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    location JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_timestamp (user_id, timestamp),
    INDEX idx_event_type (event_type),
    INDEX idx_event_category (event_category),
    INDEX idx_session (session_id)
);
```

### 2. Performance Metrics Table

```sql
CREATE TABLE performance_metrics (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    session_id VARCHAR(36) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    page_load_time INT NOT NULL,
    time_to_first_byte INT NOT NULL,
    first_contentful_paint INT NOT NULL,
    largest_contentful_paint INT NOT NULL,
    cumulative_layout_shift DECIMAL(5,3) NOT NULL,
    first_input_delay INT NOT NULL,
    total_blocking_time INT NOT NULL,
    memory_usage JSON,
    network_info JSON,
    device_info JSON,
    custom_metrics JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_timestamp (user_id, timestamp),
    INDEX idx_performance_score (page_load_time, first_contentful_paint)
);
```

### 3. Usage Metrics Table

```sql
CREATE TABLE usage_metrics (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    session_count INT NOT NULL DEFAULT 0,
    total_session_duration INT NOT NULL DEFAULT 0,
    average_session_duration INT NOT NULL DEFAULT 0,
    page_views INT NOT NULL DEFAULT 0,
    unique_pages_visited INT NOT NULL DEFAULT 0,
    features_used JSON,
    engagement_score DECIMAL(5,2) NOT NULL DEFAULT 0,
    retention_data JSON,
    conversion_data JSON,
    user_flow JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_date (user_id, date),
    INDEX idx_user_date (user_id, date),
    INDEX idx_engagement (engagement_score)
);
```

### 4. Activity Logs Table

```sql
CREATE TABLE activity_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    session_id VARCHAR(36) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    activity_type ENUM('user_action', 'system_action', 'api_call', 'data_change', 'authentication', 'authorization', 'error', 'warning', 'info') NOT NULL,
    activity_category ENUM('account', 'projects', 'assets', 'marketplace', 'collaboration', 'settings', 'security', 'payment', 'integration', 'system') NOT NULL,
    description TEXT NOT NULL,
    details JSON,
    metadata JSON,
    severity ENUM('critical', 'error', 'warning', 'info', 'debug', 'trace') NOT NULL,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_timestamp (user_id, timestamp),
    INDEX idx_activity_type (activity_type),
    INDEX idx_severity (severity),
    INDEX idx_session (session_id)
);
```

## API Endpoints

### 1. Analytics Events Endpoints

#### POST /analytics/events
Track a single analytics event.

**Request Body:**
```json
{
  "user_id": "string",
  "session_id": "string",
  "event_type": "user_action",
  "event_name": "button_click",
  "event_category": "interaction",
  "properties": {
    "button_id": "create_project",
    "page": "/dashboard"
  },
  "source": "web_app",
  "platform": "web",
  "user_agent": "Mozilla/5.0...",
  "ip_address": "192.168.1.1",
  "location": {
    "country": "US",
    "region": "CA",
    "city": "San Francisco",
    "timezone": "America/Los_Angeles"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "event_id": "uuid"
  },
  "metadata": {
    "timestamp": "2025-09-18T10:30:00Z",
    "request_id": "req_123",
    "processing_time": 45
  }
}
```

#### POST /analytics/events/batch
Track multiple events in a single request.

**Request Body:**
```json
{
  "events": [
    {
      "user_id": "string",
      "session_id": "string",
      "event_type": "user_action",
      "event_name": "page_view",
      "event_category": "navigation",
      "properties": {
        "page": "/dashboard"
      },
      "source": "web_app",
      "platform": "web"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "processed_count": 5,
    "failed_count": 0
  }
}
```

#### GET /analytics/events
Get analytics events with filtering.

**Query Parameters:**
- `user_id` (optional): Filter by user ID
- `event_type` (optional): Filter by event type
- `event_category` (optional): Filter by event category
- `start_date` (optional): Start date for filtering
- `end_date` (optional): End date for filtering
- `page` (default: 1): Page number
- `limit` (default: 50): Number of results per page

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "user_123",
      "session_id": "session_456",
      "event_type": "user_action",
      "event_name": "button_click",
      "event_category": "interaction",
      "properties": {},
      "timestamp": "2025-09-18T10:30:00Z",
      "source": "web_app",
      "platform": "web"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 1000,
    "total_pages": 20,
    "has_next": true,
    "has_previous": false
  }
}
```

### 2. Performance Metrics Endpoints

#### POST /analytics/performance
Submit performance metrics.

**Request Body:**
```json
{
  "user_id": "string",
  "session_id": "string",
  "page_load_time": 1500,
  "time_to_first_byte": 200,
  "first_contentful_paint": 800,
  "largest_contentful_paint": 1200,
  "cumulative_layout_shift": 0.1,
  "first_input_delay": 50,
  "total_blocking_time": 100,
  "memory_usage": {
    "used_heap_size": 50000000,
    "total_heap_size": 100000000,
    "heap_size_limit": 200000000,
    "memory_usage_percentage": 50
  },
  "network_info": {
    "connection_type": "4g",
    "effective_type": "4g",
    "download_speed": 10,
    "upload_speed": 2,
    "latency": 50
  },
  "device_info": {
    "device_type": "desktop",
    "screen_resolution": "1920x1080",
    "viewport_size": "1200x800",
    "pixel_density": 2
  },
  "custom_metrics": {}
}
```

#### GET /analytics/performance/{user_id}
Get performance metrics for a user.

**Query Parameters:**
- `time_period` (default: "last_24_hours"): Time period for filtering

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "user_123",
      "session_id": "session_456",
      "timestamp": "2025-09-18T10:30:00Z",
      "page_load_time": 1500,
      "time_to_first_byte": 200,
      "first_contentful_paint": 800,
      "largest_contentful_paint": 1200,
      "cumulative_layout_shift": 0.1,
      "first_input_delay": 50,
      "total_blocking_time": 100,
      "memory_usage": {},
      "network_info": {},
      "device_info": {},
      "custom_metrics": {}
    }
  ]
}
```

#### GET /analytics/performance/{user_id}/overview
Get aggregated performance overview.

**Response:**
```json
{
  "success": true,
  "data": {
    "average_load_time": 1500,
    "performance_score": 85,
    "core_web_vitals": {
      "lcp": 1200,
      "fid": 50,
      "cls": 0.1
    },
    "slowest_pages": [
      {
        "page": "/dashboard",
        "average_load_time": 2000,
        "visits": 100
      }
    ],
    "performance_trends": [
      {
        "date": "2025-09-18",
        "average_load_time": 1500,
        "performance_score": 85
      }
    ],
    "issues": [
      {
        "type": "slow_page",
        "severity": "warning",
        "description": "Dashboard page loading slowly",
        "affected_users": 25
      }
    ]
  }
}
```

### 3. Usage Metrics Endpoints

#### POST /analytics/usage
Submit usage metrics.

**Request Body:**
```json
{
  "user_id": "string",
  "date": "2025-09-18",
  "session_count": 3,
  "total_session_duration": 7200,
  "average_session_duration": 2400,
  "page_views": 25,
  "unique_pages_visited": 8,
  "features_used": [
    {
      "feature_name": "project_creation",
      "category": "projects",
      "usage_count": 2,
      "total_time_spent": 300,
      "last_used": "2025-09-18T10:30:00Z",
      "proficiency_score": 0.7
    }
  ],
  "engagement_score": 8.5,
  "retention_data": {
    "is_new_user": false,
    "days_since_signup": 30,
    "days_since_last_visit": 1,
    "total_visits": 25,
    "retention_period": "weekly",
    "churn_risk_score": 0.2
  },
  "conversion_data": {
    "conversion_events": [],
    "funnel_stage": "activated",
    "conversion_rate": 0.8
  },
  "user_flow": [
    {
      "step_number": 1,
      "page_path": "/dashboard",
      "action": "page_view",
      "timestamp": "2025-09-18T10:30:00Z",
      "duration_on_step": 120,
      "exit_rate": 0.1
    }
  ]
}
```

#### GET /analytics/usage/{user_id}
Get usage metrics for a user.

#### GET /analytics/usage/{user_id}/trends
Get usage trends for specific metrics.

**Query Parameters:**
- `metric` (required): Metric name to get trends for
- `time_period` (default: "last_30_days"): Time period for trends

### 4. Activity Logs Endpoints

#### POST /analytics/activities
Log an activity.

**Request Body:**
```json
{
  "user_id": "string",
  "session_id": "string",
  "activity_type": "user_action",
  "activity_category": "projects",
  "description": "Created new project 'Game Demo'",
  "details": {
    "action": "create",
    "target": "project",
    "target_id": "project_123",
    "duration": 2000,
    "result": "success"
  },
  "metadata": {
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0...",
    "request_id": "req_456"
  },
  "severity": "info",
  "tags": ["project", "creation", "user_action"]
}
```

#### GET /analytics/activities/{user_id}
Get activity logs for a user.

#### GET /analytics/activities/{user_id}/summary
Get activity summary.

### 5. Dashboard & Aggregation Endpoints

#### GET /analytics/dashboard/{user_id}
Get comprehensive analytics dashboard.

**Query Parameters:**
- `time_period` (default: "last_7_days"): Time period for dashboard data

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "user_123",
    "time_period": "last_7_days",
    "overview": {
      "total_events": 1500,
      "unique_sessions": 25,
      "average_session_duration": 2400,
      "bounce_rate": 0.3,
      "engagement_score": 8.5,
      "top_events": [
        {
          "event_name": "page_view",
          "count": 500,
          "percentage": 33.3
        }
      ],
      "top_pages": [
        {
          "page": "/dashboard",
          "views": 200,
          "unique_views": 150
        }
      ]
    },
    "performance": {
      "average_load_time": 1500,
      "performance_score": 85,
      "core_web_vitals": {
        "lcp": 1200,
        "fid": 50,
        "cls": 0.1
      },
      "slowest_pages": [],
      "performance_trends": [],
      "issues": []
    },
    "usage": {
      "daily_active_users": 1,
      "session_frequency": 3.5,
      "feature_adoption_rate": 0.8,
      "most_used_features": [
        {
          "feature_name": "project_creation",
          "usage_count": 10,
          "users": 1
        }
      ],
      "user_segments": [
        {
          "segment": "power_user",
          "users": 1,
          "percentage": 100
        }
      ]
    },
    "activity": {
      "total_activities": 100,
      "activity_breakdown": [
        {
          "type": "user_action",
          "count": 80,
          "percentage": 80
        }
      ],
      "recent_activities": [
        {
          "id": "activity_123",
          "description": "Created new project",
          "timestamp": "2025-09-18T10:30:00Z",
          "severity": "info"
        }
      ]
    },
    "trends": [
      {
        "metric": "sessions",
        "current_value": 25,
        "previous_value": 20,
        "change_percentage": 25,
        "trend": "up",
        "time_series": [
          {
            "date": "2025-09-18",
            "value": 5
          }
        ]
      }
    ],
    "insights": [
      {
        "id": "insight_1",
        "type": "performance",
        "priority": "high",
        "title": "Page Load Time Improved",
        "description": "Average page load time decreased by 20% this week",
        "impact": "positive",
        "metric": "page_load_time",
        "change_percentage": -20,
        "trend": "down",
        "recommendations": [
          "Continue optimizing image sizes",
          "Consider implementing lazy loading"
        ],
        "created_at": "2025-09-18T10:30:00Z"
      }
    ],
    "last_updated": "2025-09-18T10:30:00Z"
  }
}
```

#### GET /analytics/insights/{user_id}
Get analytics insights.

#### GET /analytics/trends/{user_id}
Get trend data for multiple metrics.

#### GET /analytics/config/{user_id}
Get analytics configuration.

## Implementation Examples

### Node.js/Express Example

```javascript
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

// Track analytics event
app.post('/analytics/events', async (req, res) => {
  try {
    const eventId = uuidv4();
    const event = {
      id: eventId,
      ...req.body,
      timestamp: new Date().toISOString(),
      created_at: new Date()
    };

    // Save to database
    await saveAnalyticsEvent(event);

    res.json({
      success: true,
      data: {
        event_id: eventId
      },
      metadata: {
        timestamp: new Date().toISOString(),
        request_id: req.headers['x-request-id'] || uuidv4(),
        processing_time: Date.now() - req.startTime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
});

// Get dashboard data
app.get('/analytics/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { time_period = 'last_7_days' } = req.query;

    const dashboard = await generateDashboard(userId, time_period);

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'DASHBOARD_FAILED',
        message: error.message
      }
    });
  }
});

async function generateDashboard(userId, timePeriod) {
  // Calculate date range
  const dateRange = getDateRange(timePeriod);
  
  // Aggregate data from all tables
  const [overview, performance, usage, activity] = await Promise.all([
    getOverviewData(userId, dateRange),
    getPerformanceData(userId, dateRange),
    getUsageData(userId, dateRange),
    getActivityData(userId, dateRange)
  ]);

  // Generate insights
  const insights = await generateInsights(userId, dateRange);
  
  // Calculate trends
  const trends = await calculateTrends(userId, dateRange);

  return {
    user_id: userId,
    time_period: timePeriod,
    overview,
    performance,
    usage,
    activity,
    trends,
    insights,
    last_updated: new Date().toISOString()
  };
}
```

### Python/FastAPI Example

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import uuid

app = FastAPI()

class AnalyticsEvent(BaseModel):
    user_id: str
    session_id: str
    event_type: str
    event_name: str
    event_category: str
    properties: dict
    source: str
    platform: str

@app.post("/analytics/events")
async def track_event(event: AnalyticsEvent):
    try:
        event_id = str(uuid.uuid4())
        event_data = {
            "id": event_id,
            **event.dict(),
            "timestamp": datetime.utcnow().isoformat(),
            "created_at": datetime.utcnow()
        }
        
        # Save to database
        await save_analytics_event(event_data)
        
        return {
            "success": True,
            "data": {"event_id": event_id},
            "metadata": {
                "timestamp": datetime.utcnow().isoformat(),
                "request_id": str(uuid.uuid4()),
                "processing_time": 0
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/dashboard/{user_id}")
async def get_dashboard(user_id: str, time_period: str = "last_7_days"):
    try:
        dashboard = await generate_dashboard(user_id, time_period)
        return {"success": True, "data": dashboard}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## Security Considerations

1. **Authentication & Authorization**
   - Require valid JWT tokens for all endpoints
   - Ensure users can only access their own analytics data
   - Implement rate limiting for API endpoints

2. **Data Privacy**
   - Hash or anonymize sensitive data (IP addresses, user agents)
   - Implement data retention policies
   - Provide GDPR compliance features (data export, deletion)

3. **Input Validation**
   - Validate all input data types and ranges
   - Sanitize user-provided properties and metadata
   - Implement size limits for request payloads

4. **API Security**
   - Use HTTPS for all communications
   - Implement CORS policies
   - Add request signing for sensitive operations

## Performance Optimization

1. **Database Optimization**
   - Use appropriate indexes for common queries
   - Implement data partitioning by date
   - Use read replicas for analytics queries
   - Archive old data to separate tables

2. **Caching Strategy**
   - Cache dashboard data with Redis
   - Use CDN for static analytics reports
   - Implement query result caching

3. **Async Processing**
   - Use message queues for batch processing
   - Implement background jobs for aggregations
   - Process real-time metrics asynchronously

4. **Data Aggregation**
   - Pre-calculate daily/weekly/monthly summaries
   - Use materialized views for complex queries
   - Implement incremental aggregation updates

## Error Handling

All endpoints should return standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error context (optional)"
  }
}
```

Common error codes:
- `VALIDATION_ERROR`: Invalid input data
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMITED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Testing

1. **Unit Tests**
   - Test all endpoint handlers
   - Test data validation logic
   - Test aggregation functions

2. **Integration Tests**
   - Test complete API workflows
   - Test database interactions
   - Test caching behavior

3. **Performance Tests**
   - Load test analytics endpoints
   - Test with large datasets
   - Monitor query performance

4. **Data Quality Tests**
   - Validate aggregation accuracy
   - Test data consistency
   - Verify retention policies

This guide provides a complete foundation for implementing the analytics API backend that will support the GameForge frontend analytics dashboard.