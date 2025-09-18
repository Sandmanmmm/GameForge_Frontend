/**
 * Analytics Dashboard Components
 * =============================
 * 
 * Comprehensive analytics dashboard for user profile with charts,
 * metrics, performance data, usage analytics, and activity feeds
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Icon imports
import { ChartLine } from '@phosphor-icons/react/dist/csr/ChartLine';
import { Activity, Timer, Users, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Eye, Settings } from 'lucide-react';

// UI Components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

// Analytics types and hooks
import { 
  useAnalyticsDashboard,
  usePerformanceMetrics,
  useUsageMetrics,
  useActivityLogs,
  useAnalyticsInsights
} from '../hooks/useAnalytics';
import { TimePeriod, ActivityLog, AnalyticsInsight } from '../types/analytics';

interface AnalyticsDashboardProps {
  userId: string;
  className?: string;
}

export function AnalyticsDashboard({ userId, className = '' }: AnalyticsDashboardProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('last_7_days');
  const [activeTab, setActiveTab] = useState('overview');

  const { dashboard, loading: dashboardLoading, error: dashboardError } = useAnalyticsDashboard(userId, timePeriod);
  const { metrics: performanceMetrics, overview: performanceOverview } = usePerformanceMetrics(userId, timePeriod);
  const { metrics: usageMetrics, trends: usageTrends } = useUsageMetrics(userId, timePeriod);
  const { activities, summary: activitySummary } = useActivityLogs(userId, {}, 1, 20);
  const { insights } = useAnalyticsInsights(userId, timePeriod);

  if (dashboardLoading) {
    return <AnalyticsLoadingState />;
  }

  if (dashboardError) {
    return <AnalyticsErrorState error={dashboardError} />;
  }

  return (
    <motion.div 
      className={`analytics-dashboard space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with Time Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your performance, usage, and activity metrics</p>
        </div>
        
        <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last_hour">Last Hour</SelectItem>
            <SelectItem value="last_24_hours">Last 24 Hours</SelectItem>
            <SelectItem value="last_7_days">Last 7 Days</SelectItem>
            <SelectItem value="last_30_days">Last 30 Days</SelectItem>
            <SelectItem value="last_90_days">Last 90 Days</SelectItem>
            <SelectItem value="last_year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Timer size={16} />
            Performance
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <ChartLine size={16} />
            Usage
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Clock size={16} />
            Activity
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Eye size={16} />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <OverviewTab dashboard={dashboard} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          <PerformanceTab 
            metrics={performanceMetrics} 
            overview={performanceOverview}
          />
        </TabsContent>

        <TabsContent value="usage" className="space-y-6 mt-6">
          <UsageTab 
            metrics={usageMetrics} 
            trends={usageTrends}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6 mt-6">
          <ActivityTab 
            activities={activities} 
            summary={activitySummary} 
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6 mt-6">
          <InsightsTab insights={insights} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

// ========================================
// OVERVIEW TAB COMPONENT
// ========================================

function OverviewTab({ dashboard }: { dashboard: any }) {
  if (!dashboard) return <div>No data available</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Key Metrics Cards */}
      <MetricCard
        title="Total Events"
        value={dashboard.overview?.total_events || 0}
        change={12.5}
        trend="up"
        icon={<Activity />}
        color="blue"
      />
      
      <MetricCard
        title="Active Sessions"
        value={dashboard.overview?.unique_sessions || 0}
        change={-3.2}
        trend="down"
        icon={<Users />}
        color="green"
      />
      
      <MetricCard
        title="Avg Session Time"
        value={`${Math.round((dashboard.overview?.average_session_duration || 0) / 60)}m`}
        change={8.1}
        trend="up"
        icon={<Timer />}
        color="purple"
      />
      
      <MetricCard
        title="Engagement Score"
        value={Math.round(dashboard.overview?.engagement_score || 0)}
        change={15.3}
        trend="up"
        icon={<TrendingUp />}
        color="orange"
      />

      {/* Charts Section */}
      <div className="col-span-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartLine size={20} />
              Event Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EventTrendsChart data={dashboard.trends || []} />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={20} />
              Top Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TopEventsList events={dashboard.overview?.top_events || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ========================================
// PERFORMANCE TAB COMPONENT
// ========================================

function PerformanceTab({ metrics, overview }: { 
  metrics: any[], 
  overview: any
}) {
  return (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Avg Load Time"
          value={`${Math.round(overview?.average_load_time || 0)}ms`}
          change={-5.2}
          trend="down"
          icon={<Timer />}
          color="green"
        />
        
        <MetricCard
          title="Performance Score"
          value={Math.round(overview?.performance_score || 0)}
          change={3.1}
          trend="up"
          icon={<TrendingUp />}
          color="blue"
        />
        
        <MetricCard
          title="Core Web Vitals"
          value="Good"
          change={0}
          trend="stable"
          icon={<CheckCircle />}
          color="green"
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Load Times</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadTimeChart data={metrics} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Core Web Vitals</CardTitle>
          </CardHeader>
          <CardContent>
            <WebVitalsChart vitals={overview?.core_web_vitals} />
          </CardContent>
        </Card>
      </div>

      {/* Performance Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle size={20} />
            Performance Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PerformanceIssuesList issues={overview?.issues || []} />
        </CardContent>
      </Card>
    </div>
  );
}

// ========================================
// USAGE TAB COMPONENT
// ========================================

function UsageTab({ metrics, trends }: { 
  metrics: any[], 
  trends: any[]
}) {
  const latestMetrics = metrics[0] || {};

  return (
    <div className="space-y-6">
      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Session Count"
          value={latestMetrics.session_count || 0}
          change={8.3}
          trend="up"
          icon={<Users />}
          color="blue"
        />
        
        <MetricCard
          title="Page Views"
          value={latestMetrics.page_views || 0}
          change={12.1}
          trend="up"
          icon={<Eye />}
          color="green"
        />
        
        <MetricCard
          title="Features Used"
          value={latestMetrics.features_used?.length || 0}
          change={-2.1}
          trend="down"
          icon={<Settings />}
          color="purple"
        />
        
        <MetricCard
          title="Engagement Score"
          value={Math.round(latestMetrics.engagement_score || 0)}
          change={15.7}
          trend="up"
          icon={<TrendingUp />}
          color="orange"
        />
      </div>

      {/* Usage Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usage Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <UsageTrendsChart trends={trends} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Adoption</CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureAdoptionChart features={latestMetrics.features_used || []} />
          </CardContent>
        </Card>
      </div>

      {/* User Journey */}
      <Card>
        <CardHeader>
          <CardTitle>User Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <UserJourneyFlow flow={latestMetrics.user_flow || []} />
        </CardContent>
      </Card>
    </div>
  );
}

// ========================================
// ACTIVITY TAB COMPONENT
// ========================================

function ActivityTab({ activities, summary }: { 
  activities: ActivityLog[], 
  summary: any 
}) {
  return (
    <div className="space-y-6">
      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Activities"
          value={summary?.total_activities || 0}
          change={5.2}
          trend="up"
          icon={<Activity />}
          color="blue"
        />
        
        <MetricCard
          title="Security Events"
          value={summary?.security_events?.length || 0}
          change={0}
          trend="stable"
          icon={<CheckCircle />}
          color="green"
        />
        
        <MetricCard
          title="System Health"
          value={summary?.system_health?.status || 'Unknown'}
          change={0}
          trend="stable"
          icon={<CheckCircle />}
          color="green"
        />
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={20} />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityTimeline activities={activities} />
        </CardContent>
      </Card>

      {/* Activity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityBreakdownChart breakdown={summary?.activity_breakdown || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityTrendsChart activities={activities} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ========================================
// INSIGHTS TAB COMPONENT
// ========================================

function InsightsTab({ insights }: { insights: AnalyticsInsight[] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
      
      {insights.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <Eye size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Insights Available</h3>
            <p>Analytics insights will appear here as more data is collected.</p>
          </div>
        </Card>
      )}
    </div>
  );
}

// ========================================
// UTILITY COMPONENTS
// ========================================

function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  color = 'blue' 
}: {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color?: string;
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
    green: 'text-green-600 bg-green-100 dark:bg-green-900/20',
    purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
    orange: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
    red: 'text-red-600 bg-red-100 dark:bg-red-900/20'
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
          
          <div className="flex items-center gap-1 text-sm">
            {trend === 'up' && <TrendingUp size={16} className="text-green-600" />}
            {trend === 'down' && <TrendingDown size={16} className="text-red-600" />}
            <span className={`font-medium ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {Math.abs(change)}%
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{title}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightCard({ insight }: { insight: AnalyticsInsight }) {
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      case 'issue': return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      case 'achievement': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
      case 'recommendation': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <Card className={`border-2 ${getInsightColor(insight.type)}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize">
            {insight.type}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {insight.impact} Impact
          </Badge>
        </div>
        <CardTitle className="text-lg">{insight.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {insight.description}
        </p>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Recommended Actions:</div>
          {insight.actions.map((action, index) => (
            <div key={index} className="text-sm text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-gray-200">
              {action.action}
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-500">Confidence: {insight.confidence}%</span>
          <Progress value={insight.confidence} className="w-20 h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

// Loading and Error States
function AnalyticsLoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AnalyticsErrorState({ error }: { error: string }) {
  return (
    <Card className="p-12 text-center">
      <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
      <h3 className="text-lg font-medium mb-2">Failed to Load Analytics</h3>
      <p className="text-gray-600 dark:text-gray-400">{error}</p>
      <Button className="mt-4" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </Card>
  );
}

// Chart components would be implemented here...
function EventTrendsChart({ data: _data }: { data: any[] }) {
  return <div>Event Trends Chart Placeholder</div>;
}

function TopEventsList({ events: _events }: { events: any[] }) {
  return <div>Top Events List Placeholder</div>;
}

function LoadTimeChart({ data: _data }: { data: any[] }) {
  return <div>Load Time Chart Placeholder</div>;
}

function WebVitalsChart({ vitals: _vitals }: { vitals: any }) {
  return <div>Web Vitals Chart Placeholder</div>;
}

function PerformanceIssuesList({ issues: _issues }: { issues: any[] }) {
  return <div>Performance Issues List Placeholder</div>;
}

function UsageTrendsChart({ trends: _trends }: { trends: any[] }) {
  return <div>Usage Trends Chart Placeholder</div>;
}

function FeatureAdoptionChart({ features: _features }: { features: any[] }) {
  return <div>Feature Adoption Chart Placeholder</div>;
}

function UserJourneyFlow({ flow: _flow }: { flow: any[] }) {
  return <div>User Journey Flow Placeholder</div>;
}

function ActivityTimeline({ activities }: { activities: ActivityLog[] }) {
  return (
    <ScrollArea className="h-96">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
            <div className="flex-1">
              <div className="font-medium">{activity.description}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(activity.timestamp).toLocaleString()}
              </div>
              <Badge variant="outline" className="mt-1 capitalize">
                {activity.activity_category}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function ActivityBreakdownChart({ breakdown: _breakdown }: { breakdown: any[] }) {
  return <div>Activity Breakdown Chart Placeholder</div>;
}

function ActivityTrendsChart({ activities: _activities }: { activities: ActivityLog[] }) {
  return <div>Activity Trends Chart Placeholder</div>;
}

export default AnalyticsDashboard;