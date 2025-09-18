/**
 * Organizations Dashboard Component
 * =================================
 * 
 * Basic functional dashboard for organizations management.
 * This is a simplified version that can be expanded as needed.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOrganizations } from '../hooks/useOrganizations';
import { CreateOrganizationRequest } from '../types/organizations';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Icons
import { Building2, Plus, AlertCircle, Users, Settings } from 'lucide-react';

interface OrganizationsDashboardProps {
  selectedOrganizationId?: string;
}

export function OrganizationsDashboard({ selectedOrganizationId }: OrganizationsDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrgId, setSelectedOrgId] = useState(selectedOrganizationId);
  const [createOrgDialogOpen, setCreateOrgDialogOpen] = useState(false);

  // Hooks for data management
  const { 
    organizations, 
    loading: orgsLoading, 
    error: orgsError,
    createOrganization,
    refresh: refreshOrganizations
  } = useOrganizations(user?.id || '');

  // Set default selected organization
  useEffect(() => {
    if (!selectedOrgId && organizations.length > 0) {
      setSelectedOrgId(organizations[0].id);
    }
  }, [organizations, selectedOrgId]);

  // Create Organization Dialog
  const CreateOrganizationDialog = () => {
    const [formData, setFormData] = useState<CreateOrganizationRequest>({
      name: '',
      description: '',
      organization_type: 'team'
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const newOrg = await createOrganization(formData);
      if (newOrg) {
        setCreateOrgDialogOpen(false);
        setSelectedOrgId(newOrg.id);
        setFormData({
          name: '',
          description: '',
          organization_type: 'team'
        });
      }
    };

    return (
      <Dialog open={createOrgDialogOpen} onOpenChange={setCreateOrgDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Organization
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Create a new organization to collaborate with your team on projects.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="org-name">Organization Name *</Label>
                <Input
                  id="org-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter organization name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="org-description">Description</Label>
                <Textarea
                  id="org-description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your organization"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="org-type">Organization Type</Label>
                <Select
                  value={formData.organization_type}
                  onValueChange={(value: any) => setFormData({ ...formData, organization_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="nonprofit">Non-profit</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setCreateOrgDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formData.name.trim()}>
                Create Organization
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  // Organization Overview Tab
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Organization Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Organizations
          </CardTitle>
          <CardDescription>
            Manage your organizations and switch between them
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {organizations.map((org) => (
              <Button
                key={org.id}
                variant={selectedOrgId === org.id ? "default" : "outline"}
                onClick={() => setSelectedOrgId(org.id)}
                className="flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                {org.name}
                <Badge variant={org.is_active ? 'default' : 'secondary'}>
                  {org.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </Button>
            ))}
          </div>
          <CreateOrganizationDialog />
        </CardContent>
      </Card>

      {/* Current Organization Details */}
      {selectedOrgId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {organizations.find(org => org.id === selectedOrgId)?.name}
                <Badge variant="default">
                  {organizations.find(org => org.id === selectedOrgId)?.tier}
                </Badge>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {organizations.find(org => org.id === selectedOrgId)?.organization_type}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Members</p>
                <p className="text-sm text-muted-foreground">
                  {organizations.find(org => org.id === selectedOrgId)?.member_count || 0}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Projects</p>
                <p className="text-sm text-muted-foreground">
                  {organizations.find(org => org.id === selectedOrgId)?.project_count || 0}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(organizations.find(org => org.id === selectedOrgId)?.created_at || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (orgsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading organizations...</p>
        </div>
      </div>
    );
  }

  if (orgsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">{orgsError}</p>
          <Button variant="outline" onClick={refreshOrganizations} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">
            Manage your organizations, teams, and collaborations
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members
              </CardTitle>
              <CardDescription>Member management coming soon...</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Member management features will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project Collaborations</CardTitle>
              <CardDescription>Project collaboration features coming soon...</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Project collaboration features will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>Settings and configuration coming soon...</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Organization settings will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OrganizationsDashboard;