/**
 * Organizations & Collaboration Type Definitions
 * ============================================
 * 
 * Production-ready TypeScript interfaces for organization and collaboration tables:
 * - organizations
 * - organization_members
 * - organization_invites
 * - project_collaborations
 * - project_invites
 * 
 * These types enable team collaboration, project sharing, and organizational management.
 */

// ========================================
// ORGANIZATIONS
// ========================================

export interface Organization {
  id: string;
  name: string;
  description?: string;
  slug: string; // URL-friendly identifier
  logo_url?: string;
  website_url?: string;
  organization_type: 'company' | 'team' | 'educational' | 'nonprofit' | 'personal';
  tier: 'free' | 'starter' | 'professional' | 'enterprise';
  settings: OrganizationSettings;
  billing_info?: {
    billing_email: string;
    tax_id?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      postal_code: string;
    };
  };
  created_by: string; // user_id of creator
  created_at: string;
  updated_at: string;
  is_active: boolean;
  member_count: number;
  project_count: number;
  storage_used: number; // bytes
  storage_limit: number; // bytes
}

export interface OrganizationSettings {
  visibility: 'public' | 'private' | 'invite_only';
  allow_public_projects: boolean;
  require_2fa: boolean;
  default_project_permissions: ProjectPermission[];
  max_collaborators_per_project: number;
  allowed_domains?: string[]; // Email domains for auto-join
  integration_settings: {
    github_enabled: boolean;
    slack_webhook_url?: string;
    discord_webhook_url?: string;
  };
  security_settings: {
    ip_whitelist?: string[];
    session_timeout_minutes: number;
    require_approval_for_invites: boolean;
  };
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
  organization_type: Organization['organization_type'];
  settings?: Partial<OrganizationSettings>;
  billing_info?: Organization['billing_info'];
}

export interface UpdateOrganizationRequest {
  name?: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  settings?: Partial<OrganizationSettings>;
  billing_info?: Organization['billing_info'];
}

// ========================================
// ORGANIZATION MEMBERS
// ========================================

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrganizationRole;
  permissions: OrganizationPermission[];
  title?: string; // Job title within organization
  department?: string;
  joined_at: string;
  invited_by?: string; // user_id who invited them
  last_active_at?: string;
  is_active: boolean;
  notification_preferences: {
    email_notifications: boolean;
    project_updates: boolean;
    security_alerts: boolean;
    billing_updates: boolean;
  };
  // Populated fields (from joins)
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  organization?: Pick<Organization, 'id' | 'name' | 'slug'>;
}

export type OrganizationRole = 
  | 'owner'
  | 'admin'
  | 'manager'
  | 'member'
  | 'viewer'
  | 'guest';

export type OrganizationPermission = 
  // Organization management
  | 'org:read'
  | 'org:update'
  | 'org:delete'
  | 'org:manage_billing'
  | 'org:manage_settings'
  
  // Member management
  | 'members:read'
  | 'members:invite'
  | 'members:update'
  | 'members:remove'
  | 'members:manage_roles'
  
  // Project management
  | 'projects:read'
  | 'projects:create'
  | 'projects:update'
  | 'projects:delete'
  | 'projects:manage_collaborators'
  | 'projects:manage_permissions'
  
  // Asset management
  | 'assets:read'
  | 'assets:create'
  | 'assets:update'
  | 'assets:delete'
  | 'assets:manage_permissions';

export interface UpdateMemberRequest {
  role?: OrganizationRole;
  permissions?: OrganizationPermission[];
  title?: string;
  department?: string;
  notification_preferences?: OrganizationMember['notification_preferences'];
}

// ========================================
// ORGANIZATION INVITES
// ========================================

export interface OrganizationInvite {
  id: string;
  organization_id: string;
  invited_email: string;
  invited_by: string; // user_id
  role: OrganizationRole;
  permissions: OrganizationPermission[];
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';
  token: string; // Secure token for invite acceptance
  expires_at: string;
  sent_at: string;
  responded_at?: string;
  created_at: string;
  
  // Populated fields
  organization?: Pick<Organization, 'id' | 'name' | 'logo_url'>;
  invited_by_user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateInviteRequest {
  invited_email: string;
  role: OrganizationRole;
  permissions?: OrganizationPermission[];
  message?: string;
  expires_in_days?: number; // Default: 7 days
}

export interface InviteResponse {
  action: 'accept' | 'decline';
  token: string;
}

// ========================================
// PROJECT COLLABORATIONS
// ========================================

export interface ProjectCollaboration {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  permissions: ProjectPermission[];
  added_by: string; // user_id who added them
  added_at: string;
  last_accessed_at?: string;
  is_active: boolean;
  access_level: 'read' | 'write' | 'admin';
  
  // Collaboration-specific settings
  can_invite_others: boolean;
  can_export_assets: boolean;
  can_delete_assets: boolean;
  notification_preferences: {
    asset_updates: boolean;
    project_changes: boolean;
    comments: boolean;
    mentions: boolean;
  };
  
  // Populated fields
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  project?: {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
  };
  added_by_user?: {
    id: string;
    name: string;
  };
}

export type ProjectRole = 
  | 'owner'
  | 'editor' 
  | 'contributor'
  | 'reviewer'
  | 'viewer';

export type ProjectPermission = 
  // Project access
  | 'project:read'
  | 'project:update'
  | 'project:delete'
  | 'project:export'
  
  // Asset permissions
  | 'assets:read'
  | 'assets:create'
  | 'assets:update'
  | 'assets:delete'
  | 'assets:upload'
  | 'assets:download'
  | 'assets:comment'
  
  // Collaboration permissions
  | 'collaborators:read'
  | 'collaborators:invite'
  | 'collaborators:remove'
  | 'collaborators:manage_permissions'
  
  // Advanced permissions
  | 'pipeline:read'
  | 'pipeline:update'
  | 'pipeline:execute'
  | 'settings:read'
  | 'settings:update';

export interface AddCollaboratorRequest {
  user_id: string;
  role: ProjectRole;
  permissions?: ProjectPermission[];
  access_level: ProjectCollaboration['access_level'];
  can_invite_others?: boolean;
  can_export_assets?: boolean;
  can_delete_assets?: boolean;
  message?: string;
}

export interface UpdateCollaboratorRequest {
  role?: ProjectRole;
  permissions?: ProjectPermission[];
  access_level?: ProjectCollaboration['access_level'];
  can_invite_others?: boolean;
  can_export_assets?: boolean;
  can_delete_assets?: boolean;
  notification_preferences?: ProjectCollaboration['notification_preferences'];
}

// ========================================
// PROJECT INVITES
// ========================================

export interface ProjectInvite {
  id: string;
  project_id: string;
  invited_email: string;
  invited_by: string; // user_id
  role: ProjectRole;
  permissions: ProjectPermission[];
  access_level: 'read' | 'write' | 'admin';
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'cancelled';
  token: string; // Secure token for invite acceptance
  expires_at: string;
  sent_at: string;
  responded_at?: string;
  created_at: string;
  
  // Populated fields
  project?: {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
    organization?: {
      id: string;
      name: string;
    };
  };
  invited_by_user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateProjectInviteRequest {
  invited_email: string;
  role: ProjectRole;
  permissions?: ProjectPermission[];
  access_level: ProjectInvite['access_level'];
  message?: string;
  expires_in_days?: number; // Default: 7 days
}

// ========================================
// COMMON RESPONSE TYPES
// ========================================

export interface OrganizationResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
    timestamp: string;
  };
}

export interface CollaborationStats {
  total_organizations: number;
  total_members: number;
  total_projects: number;
  total_collaborations: number;
  pending_invites: number;
  active_projects: number;
}

export interface OrganizationFilter {
  name?: string;
  organization_type?: Organization['organization_type'];
  tier?: Organization['tier'];
  is_active?: boolean;
  created_after?: string;
  created_before?: string;
  limit?: number;
  offset?: number;
  sort_by?: 'name' | 'created_at' | 'member_count' | 'project_count';
  sort_order?: 'asc' | 'desc';
}

export interface MemberFilter {
  organization_id?: string;
  role?: OrganizationRole;
  is_active?: boolean;
  department?: string;
  joined_after?: string;
  joined_before?: string;
  limit?: number;
  offset?: number;
  sort_by?: 'name' | 'joined_at' | 'last_active_at';
  sort_order?: 'asc' | 'desc';
}

export interface InviteFilter {
  organization_id?: string;
  project_id?: string;
  status?: OrganizationInvite['status'] | ProjectInvite['status'];
  invited_email?: string;
  expires_before?: string;
  limit?: number;
  offset?: number;
  sort_by?: 'sent_at' | 'expires_at';
  sort_order?: 'asc' | 'desc';
}

export interface CollaborationFilter {
  project_id?: string;
  user_id?: string;
  role?: ProjectRole;
  access_level?: ProjectCollaboration['access_level'];
  is_active?: boolean;
  added_after?: string;
  limit?: number;
  offset?: number;
  sort_by?: 'added_at' | 'last_accessed_at';
  sort_order?: 'asc' | 'desc';
}

// ========================================
// UTILITY TYPES
// ========================================

export type OrganizationPermissionMatrix = {
  [K in OrganizationRole]: OrganizationPermission[];
}

export type ProjectPermissionMatrix = {
  [K in ProjectRole]: ProjectPermission[];
}

export interface OrganizationUsage {
  storage_used: number;
  storage_limit: number;
  projects_used: number;
  projects_limit: number;
  members_used: number;
  members_limit: number;
  api_calls_this_month: number;
  api_calls_limit: number;
}

export interface CollaborationActivity {
  type: 'member_added' | 'member_removed' | 'role_changed' | 'project_shared' | 'invite_sent' | 'invite_accepted';
  actor: {
    id: string;
    name: string;
    email: string;
  };
  target?: {
    id: string;
    name: string;
    email?: string;
  };
  details: Record<string, any>;
  timestamp: string;
}