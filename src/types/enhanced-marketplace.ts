/**
 * Enhanced Marketplace Type Definitions
 * ====================================
 * 
 * Steam Workshop / Unity Asset Store / itch.io Hybrid Design
 * Comprehensive type definitions for a scalable developer ecosystem marketplace
 */

import { MarketplaceItem, MarketplaceCategory, MarketplacePurchase, MarketplaceReview } from './marketplace';

// ========================================
// ENHANCED ASSET TYPES
// ========================================

export type AssetType = 
  | '3d_model' | 'texture' | 'material' | 'animation' 
  | 'ui_kit' | 'font' | 'icon_pack'
  | 'audio_music' | 'audio_sfx' | 'audio_voice'
  | 'code_snippet' | 'script' | 'plugin' | 'tool'
  | 'ai_model' | 'ai_prompt' | 'ai_workflow'
  | 'template_scene' | 'template_project' | 'template_game'
  | 'shader' | 'vfx' | 'particle_system';

export type CompatibilityEngine = 
  | 'unity' | 'unreal' | 'godot' | 'gamemaker' | 'construct'
  | 'blender' | 'maya' | 'max' | 'photoshop' | 'substance'
  | 'web' | 'mobile' | 'desktop' | 'vr' | 'ar';

export type LicenseModel = 
  | 'free' | 'personal' | 'commercial' | 'extended' | 'exclusive'
  | 'royalty_free' | 'creative_commons' | 'open_source' | 'custom';

// ========================================
// ENHANCED MARKETPLACE ITEM
// ========================================

export interface EnhancedMarketplaceItem extends MarketplaceItem {
  // Enhanced media and previews
  media: {
    thumbnail: string;
    screenshots: string[];
    videos: {
      url: string;
      type: 'demo' | 'tutorial' | 'preview';
      duration?: number;
    }[];
    three_d_preview?: {
      model_url: string;
      viewer_config: Record<string, any>;
    };
    interactive_demo?: {
      url: string;
      embedded: boolean;
    };
  };

  // Enhanced metadata
  asset_details: {
    type: AssetType;
    sub_type?: string;
    file_size_mb: number;
    file_count: number;
    formats: string[];
    polycount?: number; // For 3D models
    texture_resolution?: string; // e.g., "1024x1024", "2K", "4K"
    animation_length?: number; // seconds
    audio_length?: number; // seconds
    code_language?: string[]; // For scripts
  };

  // Compatibility matrix
  compatibility: {
    engines: CompatibilityEngine[];
    platforms: ('windows' | 'mac' | 'linux' | 'ios' | 'android' | 'web')[];
    minimum_versions: Record<string, string>;
    render_pipelines?: ('built_in' | 'urp' | 'hdrp')[];
  };

  // Enhanced licensing
  licensing: {
    type: LicenseModel;
    commercial_use: boolean;
    modification_allowed: boolean;
    redistribution_allowed: boolean;
    attribution_required: boolean;
    resale_allowed: boolean;
    source_included: boolean;
    custom_terms?: string;
    usage_limits?: {
      max_projects?: number;
      max_copies?: number;
      territory_restrictions?: string[];
    };
  };

  // Versioning
  versioning: {
    current_version: string;
    version_history: {
      version: string;
      release_date: string;
      changelog: string;
      download_url: string;
      file_size_mb: number;
    }[];
    update_policy: 'automatic' | 'manual' | 'subscription';
  };

  // Enhanced metrics
  analytics: {
    views: number;
    downloads: number;
    purchases: number;
    favorites: number;
    rating: {
      average: number;
      count: number;
      distribution: Record<1 | 2 | 3 | 4 | 5, number>;
    };
    trending_score: number;
    quality_score: number;
  };

  // SEO and discovery
  discovery: {
    tags: string[];
    keywords: string[];
    categories: string[];
    featured_in: ('homepage' | 'category' | 'trending' | 'new' | 'sale')[];
    recommended_for: AssetType[];
    similar_items?: string[];
  };

  // Creator information
  creator: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    rating: number;
    total_assets: number;
    join_date: string;
    bio?: string;
    website?: string;
    social_links?: Record<string, string>;
  };

  // Integration features
  integration: {
    one_click_import: boolean;
    auto_setup: boolean;
    documentation_url?: string;
    tutorial_url?: string;
    support_email?: string;
    forum_url?: string;
  };
}

// ========================================
// CREATOR PROFILE SYSTEM
// ========================================

export interface CreatorProfile {
  id: string;
  user_id: string;
  
  // Basic info
  display_name: string;
  bio: string;
  avatar_url: string;
  banner_url?: string;
  location?: string;
  website?: string;
  
  // Social links
  social_links: {
    twitter?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    discord?: string;
  };
  
  // Creator status
  verified: boolean;
  pro_creator: boolean;
  badges: ('top_seller' | 'rising_star' | 'verified' | 'quality_creator' | 'community_favorite')[];
  
  // Statistics
  stats: {
    total_assets: number;
    total_downloads: number;
    total_revenue: number;
    average_rating: number;
    follower_count: number;
    join_date: string;
    last_active: string;
  };
  
  // Portfolio
  featured_assets: string[]; // Asset IDs
  categories_focus: AssetType[];
  specialties: string[];
  
  created_at: string;
  updated_at: string;
}

// ========================================
// MARKETPLACE COLLECTIONS
// ========================================

export interface MarketplaceCollection {
  id: string;
  creator_id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  asset_ids: string[];
  is_public: boolean;
  is_featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// ========================================
// ENHANCED REVIEW SYSTEM
// ========================================

export interface EnhancedReview extends MarketplaceReview {
  // Enhanced review content
  title: string;
  pros: string[];
  cons: string[];
  media_attachments?: {
    images: string[];
    videos: string[];
  };
  
  // Review context
  purchase_verified: boolean;
  usage_duration: 'less_than_week' | 'week_to_month' | 'month_to_year' | 'over_year';
  project_type?: string;
  recommended: boolean;
  
  // Community interaction
  helpful_votes: number;
  total_votes: number;
  creator_response?: {
    content: string;
    date: string;
  };
  
  // Moderation
  flagged: boolean;
  moderation_status: 'pending' | 'approved' | 'hidden' | 'removed';
}

// ========================================
// MARKETPLACE HOMEPAGE DATA
// ========================================

export interface MarketplaceHomepage {
  featured_banner: {
    title: string;
    description: string;
    image_url: string;
    cta_text: string;
    cta_url: string;
  };
  
  sections: {
    featured_assets: {
      title: string;
      items: EnhancedMarketplaceItem[];
    };
    trending_assets: {
      title: string;
      items: EnhancedMarketplaceItem[];
    };
    new_releases: {
      title: string;
      items: EnhancedMarketplaceItem[];
    };
    top_creators: {
      title: string;
      creators: CreatorProfile[];
    };
    categories_spotlight: {
      title: string;
      categories: (MarketplaceCategory & { featured_item: EnhancedMarketplaceItem })[];
    };
    sale_items: {
      title: string;
      items: (EnhancedMarketplaceItem & { discount_percentage: number })[];
    };
  };
}

// ========================================
// SEARCH AND FILTERING
// ========================================

export interface AdvancedSearchFilters {
  // Basic filters
  query?: string;
  category_ids?: string[];
  asset_types?: AssetType[];
  price_range?: {
    min: number;
    max: number;
  };
  license_types?: LicenseModel[];
  
  // Compatibility filters
  engines?: CompatibilityEngine[];
  platforms?: string[];
  render_pipelines?: string[];
  
  // Quality filters
  min_rating?: number;
  verified_creators_only?: boolean;
  has_demo?: boolean;
  has_source?: boolean;
  
  // Popularity filters
  min_downloads?: number;
  trending_only?: boolean;
  featured_only?: boolean;
  
  // Technical filters
  max_file_size_mb?: number;
  file_formats?: string[];
  poly_count_range?: {
    min: number;
    max: number;
  };
  
  // Sorting
  sort_by?: 'relevance' | 'newest' | 'price_low' | 'price_high' | 'rating' | 'downloads' | 'trending';
  sort_order?: 'asc' | 'desc';
  
  // Pagination
  page?: number;
  limit?: number;
}

export interface SearchResults {
  items: EnhancedMarketplaceItem[];
  total_count: number;
  page: number;
  limit: number;
  has_more: boolean;
  facets: {
    categories: { id: string; name: string; count: number }[];
    asset_types: { type: AssetType; count: number }[];
    price_ranges: { min: number; max: number; count: number }[];
    engines: { engine: CompatibilityEngine; count: number }[];
  };
}

// ========================================
// PURCHASING WORKFLOW
// ========================================

export interface CartItem {
  asset_id: string;
  license_type: LicenseModel;
  price: number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    code?: string;
  };
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  currency: string;
  expires_at: string;
}

export interface PurchaseResult {
  purchase_id: string;
  items: {
    asset_id: string;
    download_url: string;
    license_key: string;
    expires_at?: string;
  }[];
  receipt_url: string;
  success: boolean;
  integration_actions?: {
    auto_import_available: boolean;
    import_instructions?: string;
  };
}

// ========================================
// CREATOR ANALYTICS
// ========================================

export interface CreatorAnalytics {
  overview: {
    total_revenue: number;
    total_sales: number;
    total_downloads: number;
    average_rating: number;
    asset_count: number;
  };
  
  revenue_by_period: {
    period: string;
    revenue: number;
    sales_count: number;
  }[];
  
  top_assets: {
    asset_id: string;
    name: string;
    revenue: number;
    downloads: number;
    rating: number;
  }[];
  
  audience_insights: {
    top_countries: { country: string; percentage: number }[];
    buyer_segments: { segment: string; percentage: number }[];
    popular_use_cases: { use_case: string; percentage: number }[];
  };
  
  performance_metrics: {
    conversion_rate: number;
    refund_rate: number;
    customer_satisfaction: number;
    repeat_customer_rate: number;
  };
}

// ========================================
// MODERATION SYSTEM
// ========================================

export interface ModerationQueue {
  id: string;
  item_type: 'asset' | 'review' | 'creator_profile';
  item_id: string;
  reason: 'new_submission' | 'user_report' | 'automated_flag' | 'policy_violation';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'requires_changes';
  assigned_moderator?: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface QualityMetrics {
  asset_id: string;
  automated_checks: {
    file_integrity: boolean;
    malware_scan: boolean;
    content_policy: boolean;
    technical_quality: number; // 0-100 score
  };
  community_feedback: {
    report_count: number;
    quality_votes: number;
    verified_downloads: number;
  };
  overall_score: number; // 0-100
}