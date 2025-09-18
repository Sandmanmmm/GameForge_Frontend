/**
 * Organizations & Collaboration Hooks
 * ===================================
 * 
 * Production-ready React hooks for organizations and collaboration features.
 * Provides state management, data fetching, and real-time updates for all organization operations.
 * 
 * Features:
 * - Organization management hooks
 * - Member management hooks  
 * - Invite system hooks
 * - Project collaboration hooks
 * - Real-time updates with caching
 * - Error handling and loading states
 * - Optimistic updates for better UX
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { organizationsAPI } from '../services/organizationsAPI';
import {
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  OrganizationMember,
  UpdateMemberRequest,
  OrganizationInvite,
  CreateInviteRequest,
  InviteResponse,
  ProjectCollaboration,
  AddCollaboratorRequest,
  UpdateCollaboratorRequest,
  ProjectInvite,
  CreateProjectInviteRequest,
  CollaborationStats,
  OrganizationFilter,
  MemberFilter,
  InviteFilter,
  CollaborationFilter,
  OrganizationUsage,
  CollaborationActivity,
  OrganizationPermissionMatrix,
  ProjectPermissionMatrix
} from '../types/organizations';

interface UseOrganizationsState {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface UseOrganizationMembersState {
  members: OrganizationMember[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface UseOrganizationInvitesState {
  invites: OrganizationInvite[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface UseProjectCollaboratorsState {
  collaborators: ProjectCollaboration[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface UseProjectInvitesState {
  invites: ProjectInvite[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// ========================================
// ORGANIZATIONS HOOKS
// ========================================

/**
 * Hook for managing user organizations
 */
export function useOrganizations(userId: string, filter?: OrganizationFilter) {
  const [state, setState] = useState<UseOrganizationsState>({
    organizations: [],
    loading: true,
    error: null,
    lastUpdated: null
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchOrganizations = useCallback(async () => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.getUserOrganizations(userId, filter);
      
      if (response.success && response.data) {
        setState({
          organizations: response.data,
          loading: false,
          error: null,
          lastUpdated: new Date()
        });
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to fetch organizations'
        }));
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to fetch organizations'
        }));
      }
    }
  }, [userId, filter]);

  const createOrganization = useCallback(async (request: CreateOrganizationRequest): Promise<Organization | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.createOrganization(request);
      
      if (response.success && response.data) {
        // Optimistically add to local state
        setState(prev => ({
          ...prev,
          organizations: [...prev.organizations, response.data!],
          loading: false,
          lastUpdated: new Date()
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to create organization'
        }));
        return null;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to create organization'
      }));
      return null;
    }
  }, []);

  const updateOrganization = useCallback(async (
    organizationId: string, 
    updates: UpdateOrganizationRequest
  ): Promise<Organization | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.updateOrganization(organizationId, updates);
      
      if (response.success && response.data) {
        // Update local state
        setState(prev => ({
          ...prev,
          organizations: prev.organizations.map(org => 
            org.id === organizationId ? response.data! : org
          ),
          loading: false,
          lastUpdated: new Date()
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to update organization'
        }));
        return null;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to update organization'
      }));
      return null;
    }
  }, []);

  const deleteOrganization = useCallback(async (organizationId: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.deleteOrganization(organizationId);
      
      if (response.success) {
        // Remove from local state
        setState(prev => ({
          ...prev,
          organizations: prev.organizations.filter(org => org.id !== organizationId),
          loading: false,
          lastUpdated: new Date()
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to delete organization'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to delete organization'
      }));
      return false;
    }
  }, []);

  const refresh = useCallback(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  useEffect(() => {
    fetchOrganizations();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchOrganizations]);

  return {
    ...state,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    refresh
  };
}

/**
 * Hook for managing single organization
 */
export function useOrganization(organizationId: string) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [usage, setUsage] = useState<OrganizationUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [orgResponse, usageResponse] = await Promise.all([
        organizationsAPI.getOrganization(organizationId),
        organizationsAPI.getOrganizationUsage(organizationId)
      ]);

      if (orgResponse.success && orgResponse.data) {
        setOrganization(orgResponse.data);
      } else {
        setError(orgResponse.error?.message || 'Failed to fetch organization');
      }

      if (usageResponse.success && usageResponse.data) {
        setUsage(usageResponse.data);
      }

      setLoading(false);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch organization');
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    if (organizationId) {
      fetchOrganization();
    }
  }, [organizationId, fetchOrganization]);

  return {
    organization,
    usage,
    loading,
    error,
    refresh: fetchOrganization
  };
}

// ========================================
// ORGANIZATION MEMBERS HOOKS
// ========================================

/**
 * Hook for managing organization members
 */
export function useOrganizationMembers(organizationId: string, filter?: MemberFilter) {
  const [state, setState] = useState<UseOrganizationMembersState>({
    members: [],
    loading: true,
    error: null,
    lastUpdated: null
  });

  const fetchMembers = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.getOrganizationMembers(organizationId, filter);
      
      if (response.success && response.data) {
        setState({
          members: response.data,
          loading: false,
          error: null,
          lastUpdated: new Date()
        });
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to fetch members'
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch members'
      }));
    }
  }, [organizationId, filter]);

  const updateMember = useCallback(async (
    userId: string, 
    updates: UpdateMemberRequest
  ): Promise<OrganizationMember | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.updateOrganizationMember(organizationId, userId, updates);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          members: prev.members.map(member => 
            member.user_id === userId ? response.data! : member
          ),
          loading: false,
          lastUpdated: new Date()
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to update member'
        }));
        return null;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to update member'
      }));
      return null;
    }
  }, [organizationId]);

  const removeMember = useCallback(async (userId: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.removeOrganizationMember(organizationId, userId);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          members: prev.members.filter(member => member.user_id !== userId),
          loading: false,
          lastUpdated: new Date()
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to remove member'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to remove member'
      }));
      return false;
    }
  }, [organizationId]);

  const refresh = useCallback(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    if (organizationId) {
      fetchMembers();
    }
  }, [fetchMembers]);

  return {
    ...state,
    updateMember,
    removeMember,
    refresh
  };
}

// ========================================
// ORGANIZATION INVITES HOOKS
// ========================================

/**
 * Hook for managing organization invites
 */
export function useOrganizationInvites(organizationId: string, filter?: InviteFilter) {
  const [state, setState] = useState<UseOrganizationInvitesState>({
    invites: [],
    loading: true,
    error: null,
    lastUpdated: null
  });

  const fetchInvites = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.getOrganizationInvites(organizationId, filter);
      
      if (response.success && response.data) {
        setState({
          invites: response.data,
          loading: false,
          error: null,
          lastUpdated: new Date()
        });
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to fetch invites'
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch invites'
      }));
    }
  }, [organizationId, filter]);

  const createInvite = useCallback(async (request: CreateInviteRequest): Promise<OrganizationInvite | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.createOrganizationInvite(organizationId, request);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          invites: [...prev.invites, response.data!],
          loading: false,
          lastUpdated: new Date()
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to create invite'
        }));
        return null;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to create invite'
      }));
      return null;
    }
  }, [organizationId]);

  const respondToInvite = useCallback(async (inviteResponse: InviteResponse): Promise<OrganizationMember | null> => {
    try {
      const response = await organizationsAPI.respondToOrganizationInvite(inviteResponse);
      
      if (response.success && response.data) {
        // Remove invite from local state if accepted
        if (inviteResponse.action === 'accept') {
          setState(prev => ({
            ...prev,
            invites: prev.invites.filter(invite => invite.token !== inviteResponse.token),
            lastUpdated: new Date()
          }));
        }
        return response.data;
      }
      return null;
    } catch (error: any) {
      return null;
    }
  }, []);

  const cancelInvite = useCallback(async (inviteId: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.cancelOrganizationInvite(organizationId, inviteId);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          invites: prev.invites.filter(invite => invite.id !== inviteId),
          loading: false,
          lastUpdated: new Date()
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to cancel invite'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to cancel invite'
      }));
      return false;
    }
  }, [organizationId]);

  const refresh = useCallback(() => {
    fetchInvites();
  }, [fetchInvites]);

  useEffect(() => {
    if (organizationId) {
      fetchInvites();
    }
  }, [fetchInvites]);

  return {
    ...state,
    createInvite,
    respondToInvite,
    cancelInvite,
    refresh
  };
}

// ========================================
// PROJECT COLLABORATION HOOKS
// ========================================

/**
 * Hook for managing project collaborators
 */
export function useProjectCollaborators(projectId: string, filter?: CollaborationFilter) {
  const [state, setState] = useState<UseProjectCollaboratorsState>({
    collaborators: [],
    loading: true,
    error: null,
    lastUpdated: null
  });

  const fetchCollaborators = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.getProjectCollaborators(projectId, filter);
      
      if (response.success && response.data) {
        setState({
          collaborators: response.data,
          loading: false,
          error: null,
          lastUpdated: new Date()
        });
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to fetch collaborators'
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch collaborators'
      }));
    }
  }, [projectId, filter]);

  const addCollaborator = useCallback(async (request: AddCollaboratorRequest): Promise<ProjectCollaboration | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.addProjectCollaborator(projectId, request);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          collaborators: [...prev.collaborators, response.data!],
          loading: false,
          lastUpdated: new Date()
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to add collaborator'
        }));
        return null;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to add collaborator'
      }));
      return null;
    }
  }, [projectId]);

  const updateCollaborator = useCallback(async (
    userId: string, 
    updates: UpdateCollaboratorRequest
  ): Promise<ProjectCollaboration | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.updateProjectCollaborator(projectId, userId, updates);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          collaborators: prev.collaborators.map(collaborator => 
            collaborator.user_id === userId ? response.data! : collaborator
          ),
          loading: false,
          lastUpdated: new Date()
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to update collaborator'
        }));
        return null;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to update collaborator'
      }));
      return null;
    }
  }, [projectId]);

  const removeCollaborator = useCallback(async (userId: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.removeProjectCollaborator(projectId, userId);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          collaborators: prev.collaborators.filter(collaborator => collaborator.user_id !== userId),
          loading: false,
          lastUpdated: new Date()
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to remove collaborator'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to remove collaborator'
      }));
      return false;
    }
  }, [projectId]);

  const refresh = useCallback(() => {
    fetchCollaborators();
  }, [fetchCollaborators]);

  useEffect(() => {
    if (projectId) {
      fetchCollaborators();
    }
  }, [fetchCollaborators]);

  return {
    ...state,
    addCollaborator,
    updateCollaborator,
    removeCollaborator,
    refresh
  };
}

// ========================================
// PROJECT INVITES HOOKS
// ========================================

/**
 * Hook for managing project invites
 */
export function useProjectInvites(projectId: string, filter?: InviteFilter) {
  const [state, setState] = useState<UseProjectInvitesState>({
    invites: [],
    loading: true,
    error: null,
    lastUpdated: null
  });

  const fetchInvites = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.getProjectInvites(projectId, filter);
      
      if (response.success && response.data) {
        setState({
          invites: response.data,
          loading: false,
          error: null,
          lastUpdated: new Date()
        });
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to fetch project invites'
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch project invites'
      }));
    }
  }, [projectId, filter]);

  const createInvite = useCallback(async (request: CreateProjectInviteRequest): Promise<ProjectInvite | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.createProjectInvite(projectId, request);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          invites: [...prev.invites, response.data!],
          loading: false,
          lastUpdated: new Date()
        }));
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to create project invite'
        }));
        return null;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to create project invite'
      }));
      return null;
    }
  }, [projectId]);

  const respondToInvite = useCallback(async (inviteResponse: InviteResponse): Promise<ProjectCollaboration | null> => {
    try {
      const response = await organizationsAPI.respondToProjectInvite(inviteResponse);
      
      if (response.success && response.data) {
        // Remove invite from local state if accepted
        if (inviteResponse.action === 'accept') {
          setState(prev => ({
            ...prev,
            invites: prev.invites.filter(invite => invite.token !== inviteResponse.token),
            lastUpdated: new Date()
          }));
        }
        return response.data;
      }
      return null;
    } catch (error: any) {
      return null;
    }
  }, []);

  const cancelInvite = useCallback(async (inviteId: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await organizationsAPI.cancelProjectInvite(projectId, inviteId);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          invites: prev.invites.filter(invite => invite.id !== inviteId),
          loading: false,
          lastUpdated: new Date()
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Failed to cancel project invite'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to cancel project invite'
      }));
      return false;
    }
  }, [projectId]);

  const refresh = useCallback(() => {
    fetchInvites();
  }, [fetchInvites]);

  useEffect(() => {
    if (projectId) {
      fetchInvites();
    }
  }, [fetchInvites]);

  return {
    ...state,
    createInvite,
    respondToInvite,
    cancelInvite,
    refresh
  };
}

// ========================================
// ANALYTICS & UTILITIES HOOKS
// ========================================

/**
 * Hook for collaboration statistics
 */
export function useCollaborationStats(userId?: string) {
  const [stats, setStats] = useState<CollaborationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await organizationsAPI.getCollaborationStats(userId);
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch collaboration stats');
      }
      setLoading(false);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch collaboration stats');
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats
  };
}

/**
 * Hook for collaboration activity feed
 */
export function useCollaborationActivity(
  organizationId?: string, 
  projectId?: string,
  limit: number = 20
) {
  const [activity, setActivity] = useState<CollaborationActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await organizationsAPI.getCollaborationActivity(organizationId, projectId, limit);
      
      if (response.success && response.data) {
        setActivity(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch collaboration activity');
      }
      setLoading(false);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch collaboration activity');
      setLoading(false);
    }
  }, [organizationId, projectId, limit]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return {
    activity,
    loading,
    error,
    refresh: fetchActivity
  };
}

/**
 * Hook for permission matrices
 */
export function usePermissionMatrices() {
  const [matrices, setMatrices] = useState<{
    organization: OrganizationPermissionMatrix | null;
    project: ProjectPermissionMatrix | null;
  }>({
    organization: null,
    project: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatrices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await organizationsAPI.getPermissionMatrices();
      
      if (response.success && response.data) {
        setMatrices({
          organization: response.data.organization,
          project: response.data.project
        });
      } else {
        setError(response.error?.message || 'Failed to fetch permission matrices');
      }
      setLoading(false);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch permission matrices');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatrices();
  }, [fetchMatrices]);

  return {
    ...matrices,
    loading,
    error,
    refresh: fetchMatrices
  };
}