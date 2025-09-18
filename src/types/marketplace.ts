/**
 * Marketplace Type Definitions
 * ===========================
 * 
 * Production-ready TypeScript interfaces for marketplace tables:
 * - marketplace_categories
 * - marketplace_items  
 * - marketplace_purchases
 * - marketplace_reviews
 * - ai_model_marketplace
 * 
 * These types enable AI model marketplace, asset purchasing, review systems,
 * and commercial transactions within the GameForge platform.
 */

// ========================================
// MARKETPLACE CATEGORIES
// ========================================

export interface MarketplaceCategory {
  id: string;
  name: string;
  description?: string;
  slug: string; // URL-friendly identifier
  icon_url?: string;
  parent_category_id?: string; // For hierarchical categories
  is_active: boolean;
  sort_order: number;
  metadata: {
    item_count: number;
    featured_items: string[]; // Array of item IDs
    tags: string[];
    content_rating: 'general' | 'teen' | 'mature' | 'adult';
  };
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parent_category_id?: string;
  icon_url?: string;
  sort_order?: number;
  metadata?: Partial<MarketplaceCategory['metadata']>;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  icon_url?: string;
  parent_category_id?: string;
  is_active?: boolean;
  sort_order?: number;
  metadata?: Partial<MarketplaceCategory['metadata']>;
}

// ========================================
// MARKETPLACE ITEMS
// ========================================

export type ItemType = 'ai_model' | 'asset_pack' | 'texture' | 'sound' | 'script' | 'tool' | 'template';
export type ItemStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'suspended' | 'archived';
export type PricingModel = 'free' | 'one_time' | 'subscription' | 'usage_based' | 'tiered';
export type LicenseType = 'personal' | 'commercial' | 'extended' | 'exclusive' | 'royalty_free';

export interface MarketplaceItem {
  id: string;
  seller_id: string;
  category_id: string;
  name: string;
  description: string;
  short_description?: string;
  item_type: ItemType;
  status: ItemStatus;
  
  // Media
  thumbnail_url: string;
  preview_images: string[];
  preview_video_url?: string;
  demo_url?: string; // Live demo or preview link
  
  // Pricing
  pricing_model: PricingModel;
  base_price: number; // In cents
  currency: string; // ISO currency code
  pricing_tiers?: {
    name: string;
    price: number;
    features: string[];
    usage_limits?: Record<string, number>;
  }[];
  
  // Licensing
  license_type: LicenseType;
  license_terms?: string;
  usage_rights: {
    commercial_use: boolean;
    modification_allowed: boolean;
    redistribution_allowed: boolean;
    attribution_required: boolean;
  };
  
  // Technical details
  file_size: number; // bytes
  file_formats: string[];
  supported_engines?: string[]; // Unity, Unreal, etc.
  system_requirements?: Record<string, string>;
  
  // Metrics
  download_count: number;
  view_count: number;
  rating_average: number; // 0-5 stars
  rating_count: number;
  
  // SEO & Discovery
  tags: string[];
  search_keywords: string[];
  content_rating: 'general' | 'teen' | 'mature' | 'adult';
  
  // Timestamps
  created_at: string;
  updated_at: string;
  published_at?: string;
  last_updated_at?: string;
  
  // Seller information (populated in responses)
  seller_name?: string;
  seller_avatar?: string;
  seller_rating?: number;
}

export interface CreateItemRequest {
  category_id: string;
  name: string;
  description: string;
  short_description?: string;
  item_type: ItemType;
  thumbnail_url: string;
  preview_images?: string[];
  preview_video_url?: string;
  demo_url?: string;
  pricing_model: PricingModel;
  base_price: number;
  currency?: string;
  pricing_tiers?: MarketplaceItem['pricing_tiers'];
  license_type: LicenseType;
  license_terms?: string;
  usage_rights: MarketplaceItem['usage_rights'];
  file_formats: string[];
  supported_engines?: string[];
  system_requirements?: Record<string, string>;
  tags: string[];
  search_keywords?: string[];
  content_rating: MarketplaceItem['content_rating'];
}

export interface UpdateItemRequest {
  category_id?: string;
  name?: string;
  description?: string;
  short_description?: string;
  thumbnail_url?: string;
  preview_images?: string[];
  preview_video_url?: string;
  demo_url?: string;
  pricing_model?: PricingModel;
  base_price?: number;
  pricing_tiers?: MarketplaceItem['pricing_tiers'];
  license_type?: LicenseType;
  license_terms?: string;
  usage_rights?: Partial<MarketplaceItem['usage_rights']>;
  file_formats?: string[];
  supported_engines?: string[];
  system_requirements?: Record<string, string>;
  tags?: string[];
  search_keywords?: string[];
  content_rating?: MarketplaceItem['content_rating'];
  status?: ItemStatus;
}

// ========================================
// MARKETPLACE PURCHASES
// ========================================

export type PurchaseStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export type PaymentMethod = 'credit_card' | 'paypal' | 'stripe' | 'credits' | 'subscription';

export interface MarketplacePurchase {
  id: string;
  buyer_id: string;
  seller_id: string;
  item_id: string;
  
  // Purchase details
  quantity: number;
  unit_price: number; // Price at time of purchase
  total_amount: number;
  currency: string;
  discount_amount?: number;
  tax_amount?: number;
  final_amount: number;
  
  // Payment
  payment_method: PaymentMethod;
  payment_processor_id?: string; // Stripe, PayPal transaction ID
  payment_status: PurchaseStatus;
  
  // License
  license_key?: string;
  license_type: LicenseType;
  license_expires_at?: string;
  download_limit?: number;
  downloads_used: number;
  
  // Metadata
  purchase_metadata?: {
    ip_address?: string;
    user_agent?: string;
    referrer?: string;
    promotional_code?: string;
  };
  
  // Timestamps
  created_at: string;
  updated_at: string;
  completed_at?: string;
  refunded_at?: string;
  
  // Related data (populated in responses)
  item_name?: string;
  item_thumbnail?: string;
  seller_name?: string;
  buyer_name?: string;
}

export interface CreatePurchaseRequest {
  item_id: string;
  quantity?: number;
  payment_method: PaymentMethod;
  promotional_code?: string;
  purchase_metadata?: MarketplacePurchase['purchase_metadata'];
}

export interface ProcessPaymentRequest {
  purchase_id: string;
  payment_token?: string; // From payment processor
  billing_address?: {
    name: string;
    email: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

// ========================================
// MARKETPLACE REVIEWS
// ========================================

export interface MarketplaceReview {
  id: string;
  item_id: string;
  reviewer_id: string;
  purchase_id?: string; // Only buyers can review
  
  // Review content
  rating: number; // 1-5 stars
  title?: string;
  content?: string;
  pros?: string[];
  cons?: string[];
  
  // Review metadata
  is_verified_purchase: boolean;
  helpful_count: number;
  total_votes: number; // For helpful ratio calculation
  
  // Moderation
  is_flagged: boolean;
  is_hidden: boolean;
  moderation_notes?: string;
  
  // Response from seller
  seller_response?: {
    content: string;
    created_at: string;
    updated_at?: string;
  };
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Related data (populated in responses)
  reviewer_name?: string;
  reviewer_avatar?: string;
  item_name?: string;
}

export interface CreateReviewRequest {
  item_id: string;
  purchase_id?: string;
  rating: number;
  title?: string;
  content?: string;
  pros?: string[];
  cons?: string[];
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  content?: string;
  pros?: string[];
  cons?: string[];
}

export interface ReviewResponse {
  content: string;
}

// ========================================
// AI MODEL MARKETPLACE
// ========================================

export type ModelType = 'text_generation' | 'image_generation' | 'audio_generation' | 'code_generation' | 'classification' | 'detection' | 'translation' | 'custom';
export type ModelFramework = 'tensorflow' | 'pytorch' | 'onnx' | 'huggingface' | 'openai' | 'custom';
export type ModelStatus = 'training' | 'ready' | 'deprecated' | 'maintenance';

export interface AIModelMarketplace {
  id: string;
  item_id: string; // Links to marketplace_items
  creator_id: string;
  
  // Model details
  model_name: string;
  model_version: string;
  model_type: ModelType;
  framework: ModelFramework;
  model_size: number; // In MB
  
  // API details
  api_endpoint?: string;
  api_documentation_url?: string;
  inference_cost_per_call: number; // In credits
  max_requests_per_minute: number;
  average_response_time_ms: number;
  
  // Model capabilities
  input_formats: string[];
  output_formats: string[];
  supported_languages?: string[];
  max_input_length?: number;
  training_data_description?: string;
  
  // Performance metrics
  accuracy_score?: number;
  benchmark_results?: Record<string, number>;
  training_dataset_size?: number;
  training_time_hours?: number;
  
  // Usage statistics
  total_api_calls: number;
  monthly_api_calls: number;
  active_users: number;
  
  // Configuration
  model_parameters?: Record<string, any>;
  default_settings?: Record<string, any>;
  customizable_parameters?: string[];
  
  // Status and availability
  status: ModelStatus;
  is_featured: boolean;
  availability_regions: string[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
  last_trained_at?: string;
  deprecated_at?: string;
}

export interface CreateAIModelRequest {
  item_id: string;
  model_name: string;
  model_version: string;
  model_type: ModelType;
  framework: ModelFramework;
  model_size: number;
  api_endpoint?: string;
  api_documentation_url?: string;
  inference_cost_per_call: number;
  max_requests_per_minute: number;
  input_formats: string[];
  output_formats: string[];
  supported_languages?: string[];
  max_input_length?: number;
  training_data_description?: string;
  model_parameters?: Record<string, any>;
  default_settings?: Record<string, any>;
  customizable_parameters?: string[];
  availability_regions?: string[];
}

export interface UpdateAIModelRequest {
  model_version?: string;
  api_endpoint?: string;
  api_documentation_url?: string;
  inference_cost_per_call?: number;
  max_requests_per_minute?: number;
  input_formats?: string[];
  output_formats?: string[];
  supported_languages?: string[];
  max_input_length?: number;
  training_data_description?: string;
  model_parameters?: Record<string, any>;
  default_settings?: Record<string, any>;
  customizable_parameters?: string[];
  status?: ModelStatus;
  availability_regions?: string[];
}

// ========================================
// SEARCH & FILTERING
// ========================================

export interface MarketplaceSearchRequest {
  query?: string;
  category_id?: string;
  item_type?: ItemType;
  pricing_model?: PricingModel;
  license_type?: LicenseType;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  tags?: string[];
  content_rating?: MarketplaceItem['content_rating'];
  seller_id?: string;
  sort_by?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'downloads' | 'newest' | 'oldest';
  limit?: number;
  offset?: number;
}

export interface CategoryFilter {
  parent_category_id?: string;
  is_active?: boolean;
  sort_by?: 'name' | 'sort_order' | 'item_count';
  sort_order?: 'asc' | 'desc';
}

export interface PurchaseFilter {
  buyer_id?: string;
  seller_id?: string;
  item_id?: string;
  status?: PurchaseStatus;
  payment_method?: PaymentMethod;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  sort_by?: 'created_at' | 'amount' | 'status';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ReviewFilter {
  item_id?: string;
  reviewer_id?: string;
  min_rating?: number;
  max_rating?: number;
  is_verified_purchase?: boolean;
  is_flagged?: boolean;
  is_hidden?: boolean;
  sort_by?: 'created_at' | 'rating' | 'helpful_count';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// ========================================
// ANALYTICS & METRICS
// ========================================

export interface MarketplaceAnalytics {
  total_items: number;
  total_sales: number;
  total_revenue: number;
  total_downloads: number;
  active_sellers: number;
  active_buyers: number;
  
  // Time-based metrics
  daily_sales: Array<{ date: string; sales: number; revenue: number }>;
  monthly_sales: Array<{ month: string; sales: number; revenue: number }>;
  
  // Category breakdown
  sales_by_category: Array<{
    category_id: string;
    category_name: string;
    sales: number;
    revenue: number;
  }>;
  
  // Top performers
  top_selling_items: Array<{
    item_id: string;
    item_name: string;
    sales: number;
    revenue: number;
  }>;
  
  top_sellers: Array<{
    seller_id: string;
    seller_name: string;
    items_count: number;
    total_sales: number;
    total_revenue: number;
  }>;
}

export interface SellerAnalytics {
  seller_id: string;
  total_items: number;
  published_items: number;
  total_sales: number;
  total_revenue: number;
  total_downloads: number;
  average_rating: number;
  total_reviews: number;
  
  // Performance metrics
  conversion_rate: number; // views to purchases
  customer_satisfaction: number;
  repeat_customer_rate: number;
  
  // Financial breakdown
  gross_revenue: number;
  platform_fees: number;
  net_revenue: number;
  pending_payouts: number;
  
  // Time-based data
  sales_trend: Array<{ date: string; sales: number; revenue: number }>;
  item_performance: Array<{
    item_id: string;
    item_name: string;
    views: number;
    sales: number;
    revenue: number;
    rating: number;
  }>;
}

// ========================================
// API RESPONSE TYPES
// ========================================

export interface MarketplaceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: Record<string, any>;
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

export interface MarketplacePaginatedResponse<T> extends MarketplaceResponse<T[]> {
  meta: {
    pagination: {
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
    timestamp: string;
  };
}

// ========================================
// UTILITY TYPES
// ========================================

export type ItemSortOptions = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'downloads' | 'newest' | 'oldest';
export type CategorySortOptions = 'name' | 'sort_order' | 'item_count';
export type PurchaseSortOptions = 'created_at' | 'amount' | 'status';
export type ReviewSortOptions = 'created_at' | 'rating' | 'helpful_count';