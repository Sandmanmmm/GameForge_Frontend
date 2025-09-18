/**
 * Organizations & Collaboration API Service
 * ========================================
 * 
 * Production-ready API service for organizations and collaboration features.
 * Handles organizations, members, invites, project collaborations, and project invites.
 * 
 * Features:
 * - Complete CRUD operations for all organization tables
 * - Team collaboration management
 * - Project sharing and permissions
 * - Invite system with email notifications
 * - Role-based access control
 * - Organization usage tracking
 */

import { gameforgeAPI } from './api';
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
  OrganizationResponse,
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

class OrganizationsAPI {
  // ========================================
  // ORGANIZATIONS
  // ========================================

  /**
   * Create a new organization
   */
  async createOrganization(request: CreateOrganizationRequest): Promise<OrganizationResponse<Organization>> {
    try {
      const response = await gameforgeAPI.post<Organization>('/organizations', request);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      console.error('Failed to create organization:', error);
      return {
        success: false,
        error: {
          message: error.message || 'Failed to create organization',
          code: error.code || 'ORG_CREATION_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get user's organizations
   */
  async getUserOrganizations(userId: string, filter?: OrganizationFilter): Promise<OrganizationResponse<Organization[]>> {
    try {
      const params = new URLSearchParams();
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }

      const url = `/users/${userId}/organizations${params.toString() ? '?' + params.toString() : ''}`;
      const response = await gameforgeAPI.get<Organization[]>(url);
      
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch organizations',
          code: 'ORG_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get organization by ID
   */
  async getOrganization(organizationId: string): Promise<OrganizationResponse<Organization>> {
    try {
      const response = await gameforgeAPI.get<Organization>(`/organizations/${organizationId}`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch organization',
          code: 'ORG_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Update organization
   */
  async updateOrganization(organizationId: string, updates: UpdateOrganizationRequest): Promise<OrganizationResponse<Organization>> {
    try {
      const response = await gameforgeAPI.patch<Organization>(`/organizations/${organizationId}`, updates);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to update organization',
          code: 'ORG_UPDATE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Delete organization
   */
  async deleteOrganization(organizationId: string): Promise<OrganizationResponse<void>> {
    try {
      await gameforgeAPI.delete(`/organizations/${organizationId}`);
      return {
        success: true,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to delete organization',
          code: 'ORG_DELETE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get organization usage statistics
   */
  async getOrganizationUsage(organizationId: string): Promise<OrganizationResponse<OrganizationUsage>> {
    try {
      const response = await gameforgeAPI.get<OrganizationUsage>(`/organizations/${organizationId}/usage`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch organization usage',
          code: 'ORG_USAGE_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // ORGANIZATION MEMBERS
  // ========================================

  /**
   * Get organization members
   */
  async getOrganizationMembers(organizationId: string, filter?: MemberFilter): Promise<OrganizationResponse<OrganizationMember[]>> {
    try {
      const params = new URLSearchParams();
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }

      const url = `/organizations/${organizationId}/members${params.toString() ? '?' + params.toString() : ''}`;
      const response = await gameforgeAPI.get<OrganizationMember[]>(url);
      
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch organization members',
          code: 'MEMBERS_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Update organization member
   */
  async updateOrganizationMember(
    organizationId: string, 
    userId: string, 
    updates: UpdateMemberRequest
  ): Promise<OrganizationResponse<OrganizationMember>> {
    try {
      const response = await gameforgeAPI.patch<OrganizationMember>(
        `/organizations/${organizationId}/members/${userId}`, 
        updates
      );
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to update organization member',
          code: 'MEMBER_UPDATE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Remove organization member
   */
  async removeOrganizationMember(organizationId: string, userId: string): Promise<OrganizationResponse<void>> {
    try {
      await gameforgeAPI.delete(`/organizations/${organizationId}/members/${userId}`);
      return {
        success: true,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to remove organization member',
          code: 'MEMBER_REMOVE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // ORGANIZATION INVITES
  // ========================================

  /**
   * Create organization invite
   */
  async createOrganizationInvite(
    organizationId: string, 
    request: CreateInviteRequest
  ): Promise<OrganizationResponse<OrganizationInvite>> {
    try {
      const response = await gameforgeAPI.post<OrganizationInvite>(
        `/organizations/${organizationId}/invites`, 
        request
      );
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to create organization invite',
          code: 'INVITE_CREATION_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get organization invites
   */
  async getOrganizationInvites(
    organizationId: string, 
    filter?: InviteFilter
  ): Promise<OrganizationResponse<OrganizationInvite[]>> {
    try {
      const params = new URLSearchParams();
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }

      const url = `/organizations/${organizationId}/invites${params.toString() ? '?' + params.toString() : ''}`;
      const response = await gameforgeAPI.get<OrganizationInvite[]>(url);
      
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch organization invites',
          code: 'INVITES_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Respond to organization invite
   */
  async respondToOrganizationInvite(inviteResponse: InviteResponse): Promise<OrganizationResponse<OrganizationMember>> {
    try {
      const response = await gameforgeAPI.post<OrganizationMember>('/organizations/invites/respond', inviteResponse);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to respond to organization invite',
          code: 'INVITE_RESPONSE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Cancel organization invite
   */
  async cancelOrganizationInvite(organizationId: string, inviteId: string): Promise<OrganizationResponse<void>> {
    try {
      await gameforgeAPI.delete(`/organizations/${organizationId}/invites/${inviteId}`);
      return {
        success: true,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to cancel organization invite',
          code: 'INVITE_CANCEL_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // PROJECT COLLABORATIONS
  // ========================================

  /**
   * Get project collaborators
   */
  async getProjectCollaborators(
    projectId: string, 
    filter?: CollaborationFilter
  ): Promise<OrganizationResponse<ProjectCollaboration[]>> {
    try {
      const params = new URLSearchParams();
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }

      const url = `/projects/${projectId}/collaborators${params.toString() ? '?' + params.toString() : ''}`;
      const response = await gameforgeAPI.get<ProjectCollaboration[]>(url);
      
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch project collaborators',
          code: 'COLLABORATORS_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Add project collaborator
   */
  async addProjectCollaborator(
    projectId: string, 
    request: AddCollaboratorRequest
  ): Promise<OrganizationResponse<ProjectCollaboration>> {
    try {
      const response = await gameforgeAPI.post<ProjectCollaboration>(
        `/projects/${projectId}/collaborators`, 
        request
      );
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to add project collaborator',
          code: 'COLLABORATOR_ADD_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Update project collaborator
   */
  async updateProjectCollaborator(
    projectId: string, 
    userId: string, 
    updates: UpdateCollaboratorRequest
  ): Promise<OrganizationResponse<ProjectCollaboration>> {
    try {
      const response = await gameforgeAPI.patch<ProjectCollaboration>(
        `/projects/${projectId}/collaborators/${userId}`, 
        updates
      );
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to update project collaborator',
          code: 'COLLABORATOR_UPDATE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Remove project collaborator
   */
  async removeProjectCollaborator(projectId: string, userId: string): Promise<OrganizationResponse<void>> {
    try {
      await gameforgeAPI.delete(`/projects/${projectId}/collaborators/${userId}`);
      return {
        success: true,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to remove project collaborator',
          code: 'COLLABORATOR_REMOVE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // PROJECT INVITES
  // ========================================

  /**
   * Create project invite
   */
  async createProjectInvite(
    projectId: string, 
    request: CreateProjectInviteRequest
  ): Promise<OrganizationResponse<ProjectInvite>> {
    try {
      const response = await gameforgeAPI.post<ProjectInvite>(
        `/projects/${projectId}/invites`, 
        request
      );
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to create project invite',
          code: 'PROJECT_INVITE_CREATION_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get project invites
   */
  async getProjectInvites(
    projectId: string, 
    filter?: InviteFilter
  ): Promise<OrganizationResponse<ProjectInvite[]>> {
    try {
      const params = new URLSearchParams();
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }

      const url = `/projects/${projectId}/invites${params.toString() ? '?' + params.toString() : ''}`;
      const response = await gameforgeAPI.get<ProjectInvite[]>(url);
      
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch project invites',
          code: 'PROJECT_INVITES_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Respond to project invite
   */
  async respondToProjectInvite(inviteResponse: InviteResponse): Promise<OrganizationResponse<ProjectCollaboration>> {
    try {
      const response = await gameforgeAPI.post<ProjectCollaboration>('/projects/invites/respond', inviteResponse);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to respond to project invite',
          code: 'PROJECT_INVITE_RESPONSE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Cancel project invite
   */
  async cancelProjectInvite(projectId: string, inviteId: string): Promise<OrganizationResponse<void>> {
    try {
      await gameforgeAPI.delete(`/projects/${projectId}/invites/${inviteId}`);
      return {
        success: true,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to cancel project invite',
          code: 'PROJECT_INVITE_CANCEL_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // ANALYTICS & UTILITIES
  // ========================================

  /**
   * Get collaboration statistics
   */
  async getCollaborationStats(userId?: string): Promise<OrganizationResponse<CollaborationStats>> {
    try {
      const url = userId ? `/users/${userId}/collaboration-stats` : '/collaboration-stats';
      const response = await gameforgeAPI.get<CollaborationStats>(url);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch collaboration stats',
          code: 'STATS_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get collaboration activity feed
   */
  async getCollaborationActivity(
    organizationId?: string, 
    projectId?: string,
    limit: number = 20
  ): Promise<OrganizationResponse<CollaborationActivity[]>> {
    try {
      const params = new URLSearchParams();
      if (organizationId) params.append('organization_id', organizationId);
      if (projectId) params.append('project_id', projectId);
      params.append('limit', String(limit));

      const response = await gameforgeAPI.get<CollaborationActivity[]>(`/collaboration-activity?${params}`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch collaboration activity',
          code: 'ACTIVITY_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get permission matrices for roles
   */
  async getPermissionMatrices(): Promise<OrganizationResponse<{
    organization: OrganizationPermissionMatrix;
    project: ProjectPermissionMatrix;
  }>> {
    try {
      const response = await gameforgeAPI.get<{
        organization: OrganizationPermissionMatrix;
        project: ProjectPermissionMatrix;
      }>('/permissions/matrices');
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch permission matrices',
          code: 'PERMISSIONS_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }
}

// Export singleton instance
export const organizationsAPI = new OrganizationsAPI();
export default organizationsAPI;