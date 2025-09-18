/**
 * Security Dashboard Component
 * ===========================
 * 
 * Production-ready security dashboard that integrates with all security tables:
 * - Access tokens management
 * - Active sessions monitoring  
 * - API keys management
 * - Audit logs viewing
 * - Security events monitoring
 * - Security scans management
 * - Rate limits monitoring
 * - Security metrics overview
 */

import React, { useState, useContext } from 'react';
import { 
  Shield, 
  Key, 
  AlertTriangle, 
  Eye, 
  Clock, 
  Users,
  Plus,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import {
  useAccessTokens,
  useUserSessions,
  useApiKeys,
  useAuditLogs,
  useSecurityEvents,
  useSecurityScans,
  useRateLimits,
  useSecurityMetrics
} from '../hooks/useSecurity';
import {
  CreateApiKeyRequest,
  CreateSecurityScanRequest
} from '../types/security';

interface SecurityDashboardProps {
  onBack?: () => void;
}

export function SecurityDashboard({ onBack }: SecurityDashboardProps) {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [createApiKeyOpen, setCreateApiKeyOpen] = useState(false);
  const [createScanOpen, setCreateScanOpen] = useState(false);

  // Hooks for all security data
  const { metrics } = useSecurityMetrics();
  const { tokens, revokeToken } = useAccessTokens(user?.id);
  const { sessions, terminateSession } = useUserSessions(user?.id);
  const { apiKeys, createApiKey, revokeApiKey } = useApiKeys(user?.id);
  const { auditLogs } = useAuditLogs({ limit: 20 });
  const { securityEvents, resolveSecurityEvent } = useSecurityEvents({ limit: 20 });
  const { securityScans, startSecurityScan } = useSecurityScans(user?.id);
  const { rateLimits } = useRateLimits(user?.id);

  const handleCreateApiKey = async (data: CreateApiKeyRequest) => {
    const result = await createApiKey(data);
    if (result) {
      setCreateApiKeyOpen(false);
    }
  };

  const handleCreateScan = async (data: CreateSecurityScanRequest) => {
    const result = await startSecurityScan(data);
    if (result) {
      setCreateScanOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-500" />
              Security Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive security monitoring and management
            </p>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back to Dashboard
            </Button>
          )}
        </div>

        {/* Security Metrics Overview */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                    <p className="text-2xl font-bold">{metrics.active_sessions}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Failed Logins (24h)</p>
                    <p className="text-2xl font-bold">{metrics.failed_login_attempts_24h}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Security Events (24h)</p>
                    <p className="text-2xl font-bold">{metrics.security_events_24h}</p>
                  </div>
                  <Eye className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vulnerabilities</p>
                    <p className="text-2xl font-bold">{metrics.vulnerabilities_found}</p>
                  </div>
                  <Shield className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="apikeys">API Keys</TabsTrigger>
            <TabsTrigger value="events">Security Events</TabsTrigger>
            <TabsTrigger value="scans">Security Scans</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Security Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Recent Security Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {securityEvents.slice(0, 5).map((event) => (
                        <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(event.severity)}`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{event.description}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(event.created_at)}</p>
                          </div>
                          <Badge variant={event.resolved ? 'default' : 'destructive'}>
                            {event.resolved ? 'Resolved' : 'Open'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Rate Limits Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Rate Limits Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {rateLimits.map((limit) => (
                        <div key={limit.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium">{limit.resource}</p>
                            <p className="text-sm text-muted-foreground">
                              {limit.current_usage}/{limit.limit_value} ({limit.limit_type})
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`w-3 h-3 rounded-full ${limit.is_blocked ? 'bg-red-500' : 'bg-green-500'}`} />
                            <p className="text-xs text-muted-foreground mt-1">
                              {limit.is_blocked ? 'Blocked' : 'OK'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Active Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage your active login sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${session.is_active ? 'bg-green-500' : 'bg-gray-500'}`} />
                          <div>
                            <p className="font-medium">{session.device_name || 'Unknown Device'}</p>
                            <p className="text-sm text-muted-foreground">
                              {session.device_type} • {session.ip_address}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Last active: {formatDate(session.last_activity_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => terminateSession(session.id, 'User requested termination')}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Terminate
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Tokens Tab */}
          <TabsContent value="tokens" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Tokens</CardTitle>
                <CardDescription>View and manage your access tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tokens.map((token) => (
                    <div key={token.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{token.token_type}</Badge>
                          <div>
                            <p className="font-medium">Token {token.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              Expires: {formatDate(token.expires_at)}
                            </p>
                            {token.last_used_at && (
                              <p className="text-xs text-muted-foreground">
                                Last used: {formatDate(token.last_used_at)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => revokeToken(token.id)}
                        disabled={!token.is_active}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Revoke
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="apikeys" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage your API keys for programmatic access</CardDescription>
                </div>
                <Dialog open={createApiKeyOpen} onOpenChange={setCreateApiKeyOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New API Key</DialogTitle>
                      <DialogDescription>
                        Create a new API key for programmatic access to your account.
                      </DialogDescription>
                    </DialogHeader>
                    <CreateApiKeyForm onSubmit={handleCreateApiKey} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Key className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{apiKey.name}</p>
                            <p className="text-sm text-muted-foreground">{apiKey.description}</p>
                            <p className="text-xs text-muted-foreground">
                              Prefix: {apiKey.key_prefix}*** • Used {apiKey.usage_count} times
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={apiKey.is_active ? 'default' : 'secondary'}>
                          {apiKey.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => revokeApiKey(apiKey.id)}
                          disabled={!apiKey.is_active}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Revoke
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Events</CardTitle>
                <CardDescription>Monitor and manage security events</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {securityEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-4 p-4 rounded-lg border">
                        <div className={`w-4 h-4 rounded-full mt-1 ${getSeverityColor(event.severity)}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{event.event_type}</Badge>
                            <Badge variant={event.resolved ? 'default' : 'destructive'}>
                              {event.resolved ? 'Resolved' : 'Open'}
                            </Badge>
                          </div>
                          <p className="font-medium">{event.description}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatDate(event.created_at)} • {event.ip_address}
                          </p>
                          {event.resolution_notes && (
                            <p className="text-sm text-green-600 mt-2">
                              Resolution: {event.resolution_notes}
                            </p>
                          )}
                        </div>
                        {!event.resolved && (
                          <Button
                            size="sm"
                            onClick={() => {
                              const notes = prompt('Enter resolution notes:');
                              if (notes) {
                                resolveSecurityEvent(event.id, notes);
                              }
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Scans Tab */}
          <TabsContent value="scans" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Security Scans</CardTitle>
                  <CardDescription>View and initiate security scans</CardDescription>
                </div>
                <Dialog open={createScanOpen} onOpenChange={setCreateScanOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Start Scan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Start Security Scan</DialogTitle>
                      <DialogDescription>
                        Initiate a new security scan of your resources.
                      </DialogDescription>
                    </DialogHeader>
                    <CreateScanForm onSubmit={handleCreateScan} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityScans.map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{scan.scan_type}</Badge>
                          <Badge variant="outline">{scan.target_type}</Badge>
                          <div>
                            <p className="font-medium">Scan {scan.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              Started: {formatDate(scan.started_at)}
                            </p>
                            {scan.completed_at && (
                              <p className="text-xs text-muted-foreground">
                                Completed: {formatDate(scan.completed_at)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(scan.status)}>
                          {scan.status}
                        </Badge>
                        {scan.risk_score !== undefined && (
                          <Badge variant={scan.risk_score > 70 ? 'destructive' : scan.risk_score > 40 ? 'secondary' : 'default'}>
                            Risk: {scan.risk_score}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>View detailed audit trail of system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg border">
                        <div className={`w-3 h-3 rounded-full mt-2 ${log.success ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{log.action}</Badge>
                            <Badge variant="outline">{log.resource_type}</Badge>
                            <Badge variant={log.success ? 'default' : 'destructive'}>
                              {log.success ? 'Success' : 'Failed'}
                            </Badge>
                          </div>
                          <p className="font-medium">{log.resource_name || `${log.resource_type} ${log.resource_id}`}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(log.created_at)} • {log.ip_address}
                          </p>
                          {log.error_message && (
                            <p className="text-sm text-red-600 mt-1">Error: {log.error_message}</p>
                          )}
                        </div>
                        <Badge variant={log.risk_level === 'critical' ? 'destructive' : 'outline'}>
                          {log.risk_level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Helper components for forms
function CreateApiKeyForm({ onSubmit }: { onSubmit: (data: CreateApiKeyRequest) => void }) {
  const [formData, setFormData] = useState<CreateApiKeyRequest>({
    name: '',
    description: '',
    permissions: [],
    rate_limit: {
      requests_per_hour: 1000
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="My API Key"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="What will this API key be used for?"
        />
      </div>
      <div>
        <Label>Permissions</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['projects:read', 'projects:create', 'assets:read', 'assets:create'].map((permission) => (
            <div key={permission} className="flex items-center space-x-2">
              <Checkbox
                id={permission}
                checked={formData.permissions.includes(permission)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData(prev => ({ ...prev, permissions: [...prev.permissions, permission] }));
                  } else {
                    setFormData(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission) }));
                  }
                }}
              />
              <Label htmlFor={permission} className="text-sm">{permission}</Label>
            </div>
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full">Create API Key</Button>
    </form>
  );
}

function CreateScanForm({ onSubmit }: { onSubmit: (data: CreateSecurityScanRequest) => void }) {
  const [formData, setFormData] = useState<CreateSecurityScanRequest>({
    scan_type: 'vulnerability',
    target_type: 'user'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="scan_type">Scan Type</Label>
        <Select
          value={formData.scan_type}
          onValueChange={(value) => setFormData(prev => ({ ...prev, scan_type: value as any }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vulnerability">Vulnerability Scan</SelectItem>
            <SelectItem value="malware">Malware Scan</SelectItem>
            <SelectItem value="compliance">Compliance Check</SelectItem>
            <SelectItem value="penetration">Penetration Test</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="target_type">Target Type</Label>
        <Select
          value={formData.target_type}
          onValueChange={(value) => setFormData(prev => ({ ...prev, target_type: value as any }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User Account</SelectItem>
            <SelectItem value="project">Project</SelectItem>
            <SelectItem value="asset">Assets</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">Start Security Scan</Button>
    </form>
  );
}