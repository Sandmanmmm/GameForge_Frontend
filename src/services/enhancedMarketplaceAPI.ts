/**
 * Enhanced Marketplace API Service
 * ===============================
 * 
 * Steam Workshop / Unity Asset Store / itch.io Hybrid API
 * Complete API service for scalable developer marketplace ecosystem
 */

import { gameforgeAPI } from './api';
import {
  EnhancedMarketplaceItem,
  CreatorProfile,
  MarketplaceCollection,
  EnhancedReview,
  MarketplaceHomepage,
  AdvancedSearchFilters,
  SearchResults,
  Cart,
  CartItem,
  PurchaseResult,
  CreatorAnalytics,
  LicenseModel
} from '../types/enhanced-marketplace';
import { MarketplaceResponse, MarketplacePaginatedResponse } from '../types/marketplace';

class EnhancedMarketplaceAPI {
  // ========================================
  // HOMEPAGE & DISCOVERY
  // ========================================

  /**
   * Get marketplace homepage data with featured content
   */
  async getHomepage(): Promise<MarketplaceResponse<MarketplaceHomepage>> {
    try {
      const response = await gameforgeAPI.get<MarketplaceHomepage>('/marketplace/homepage');
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch homepage data',
          code: 'HOMEPAGE_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get featured assets for homepage
   */
  async getFeaturedAssets(limit = 12): Promise<MarketplaceResponse<EnhancedMarketplaceItem[]>> {
    try {
      const response = await gameforgeAPI.get<EnhancedMarketplaceItem[]>(`/marketplace/featured?limit=${limit}`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch featured assets',
          code: 'FEATURED_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get trending assets
   */
  async getTrendingAssets(
    period: 'day' | 'week' | 'month' = 'week',
    limit = 12
  ): Promise<MarketplaceResponse<EnhancedMarketplaceItem[]>> {
    try {
      const response = await gameforgeAPI.get<EnhancedMarketplaceItem[]>(
        `/marketplace/trending?period=${period}&limit=${limit}`
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
          message: error.message || 'Failed to fetch trending assets',
          code: 'TRENDING_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // ADVANCED SEARCH & FILTERING
  // ========================================

  /**
   * Advanced search with comprehensive filtering
   */
  async searchAssets(filters: AdvancedSearchFilters): Promise<MarketplaceResponse<SearchResults>> {
    try {
      const response = await gameforgeAPI.post<SearchResults>('/marketplace/search', filters);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Search failed',
          code: 'SEARCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get search suggestions and autocomplete
   */
  async getSearchSuggestions(query: string): Promise<MarketplaceResponse<{
    assets: { id: string; name: string; thumbnail: string }[];
    creators: { id: string; name: string; avatar: string }[];
    tags: string[];
    categories: { id: string; name: string }[];
  }>> {
    try {
      const response = await gameforgeAPI.get(`/marketplace/search/suggestions?q=${encodeURIComponent(query)}`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to get suggestions',
          code: 'SUGGESTIONS_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // ASSET MANAGEMENT
  // ========================================

  /**
   * Get enhanced asset details
   */
  async getAsset(assetId: string): Promise<MarketplaceResponse<EnhancedMarketplaceItem>> {
    try {
      const response = await gameforgeAPI.get<EnhancedMarketplaceItem>(`/marketplace/assets/${assetId}`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch asset',
          code: 'ASSET_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get related/recommended assets
   */
  async getRelatedAssets(
    assetId: string,
    limit = 6
  ): Promise<MarketplaceResponse<EnhancedMarketplaceItem[]>> {
    try {
      const response = await gameforgeAPI.get<EnhancedMarketplaceItem[]>(
        `/marketplace/assets/${assetId}/related?limit=${limit}`
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
          message: error.message || 'Failed to fetch related assets',
          code: 'RELATED_ASSETS_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get asset download/preview links
   */
  async getAssetDownload(
    assetId: string,
    licenseType: LicenseModel
  ): Promise<MarketplaceResponse<{
    download_url: string;
    preview_url?: string;
    license_key: string;
    expires_at: string;
  }>> {
    try {
      const response = await gameforgeAPI.post(`/marketplace/assets/${assetId}/download`, {
        license_type: licenseType
      });
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to get download link',
          code: 'DOWNLOAD_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // CREATOR PROFILES & COMMUNITY
  // ========================================

  /**
   * Get creator profile
   */
  async getCreatorProfile(creatorId: string): Promise<MarketplaceResponse<CreatorProfile>> {
    try {
      const response = await gameforgeAPI.get<CreatorProfile>(`/marketplace/creators/${creatorId}`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch creator profile',
          code: 'CREATOR_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get creator's assets
   */
  async getCreatorAssets(
    creatorId: string,
    page = 1,
    limit = 20
  ): Promise<MarketplacePaginatedResponse<EnhancedMarketplaceItem[]>> {
    try {
      const response = await gameforgeAPI.get<{
        data: EnhancedMarketplaceItem[];
        pagination: any;
      }>(`/marketplace/creators/${creatorId}/assets?page=${page}&limit=${limit}`);
      
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch creator assets',
          code: 'CREATOR_ASSETS_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Follow/unfollow creator
   */
  async followCreator(creatorId: string, follow = true): Promise<MarketplaceResponse<{ following: boolean }>> {
    try {
      const response = await gameforgeAPI.post(`/marketplace/creators/${creatorId}/follow`, { follow });
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to update follow status',
          code: 'FOLLOW_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get top creators
   */
  async getTopCreators(
    period: 'month' | 'year' | 'all_time' = 'month',
    limit = 10
  ): Promise<MarketplaceResponse<CreatorProfile[]>> {
    try {
      const response = await gameforgeAPI.get<CreatorProfile[]>(
        `/marketplace/creators/top?period=${period}&limit=${limit}`
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
          message: error.message || 'Failed to fetch top creators',
          code: 'TOP_CREATORS_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // REVIEWS & RATINGS
  // ========================================

  /**
   * Get asset reviews
   */
  async getAssetReviews(
    assetId: string,
    page = 1,
    limit = 10,
    sort: 'newest' | 'oldest' | 'helpful' | 'rating_high' | 'rating_low' = 'helpful'
  ): Promise<MarketplacePaginatedResponse<EnhancedReview[]>> {
    try {
      const response = await gameforgeAPI.get(`/marketplace/assets/${assetId}/reviews`, {
        params: { page, limit, sort }
      });
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch reviews',
          code: 'REVIEWS_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Submit asset review
   */
  async submitReview(review: {
    asset_id: string;
    rating: number;
    title: string;
    content: string;
    pros: string[];
    cons: string[];
    recommended: boolean;
    usage_duration: string;
    project_type?: string;
  }): Promise<MarketplaceResponse<EnhancedReview>> {
    try {
      const response = await gameforgeAPI.post<EnhancedReview>('/marketplace/reviews', review);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to submit review',
          code: 'REVIEW_SUBMIT_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Vote on review helpfulness
   */
  async voteOnReview(
    reviewId: string,
    helpful: boolean
  ): Promise<MarketplaceResponse<{ helpful_votes: number; total_votes: number }>> {
    try {
      const response = await gameforgeAPI.post(`/marketplace/reviews/${reviewId}/vote`, { helpful });
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to vote on review',
          code: 'REVIEW_VOTE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // SHOPPING CART & PURCHASING
  // ========================================

  /**
   * Get user's cart
   */
  async getCart(): Promise<MarketplaceResponse<Cart>> {
    try {
      const response = await gameforgeAPI.get<Cart>('/marketplace/cart');
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch cart',
          code: 'CART_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(item: CartItem): Promise<MarketplaceResponse<Cart>> {
    try {
      const response = await gameforgeAPI.post<Cart>('/marketplace/cart/add', item);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to add to cart',
          code: 'CART_ADD_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(assetId: string): Promise<MarketplaceResponse<Cart>> {
    try {
      const response = await gameforgeAPI.delete<Cart>(`/marketplace/cart/remove/${assetId}`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to remove from cart',
          code: 'CART_REMOVE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Checkout and purchase
   */
  async checkout(paymentData: {
    payment_method: 'credit_card' | 'paypal' | 'stripe' | 'credits';
    payment_token?: string;
    billing_address?: Record<string, string>;
    coupon_code?: string;
  }): Promise<MarketplaceResponse<PurchaseResult>> {
    try {
      const response = await gameforgeAPI.post<PurchaseResult>('/marketplace/checkout', paymentData);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Checkout failed',
          code: 'CHECKOUT_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // ONE-CLICK INTEGRATION
  // ========================================

  /**
   * Import asset directly to project
   */
  async importAssetToProject(
    assetId: string,
    projectId: string,
    importSettings?: Record<string, any>
  ): Promise<MarketplaceResponse<{
    success: boolean;
    import_log: string[];
    created_files: string[];
    warnings?: string[];
  }>> {
    try {
      const response = await gameforgeAPI.post(`/marketplace/assets/${assetId}/import`, {
        project_id: projectId,
        settings: importSettings
      });
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Asset import failed',
          code: 'IMPORT_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get import preview/configuration
   */
  async getImportPreview(
    assetId: string,
    projectId: string
  ): Promise<MarketplaceResponse<{
    compatible: boolean;
    conflicts: string[];
    suggestions: string[];
    required_dependencies: string[];
    import_options: Record<string, any>;
  }>> {
    try {
      const response = await gameforgeAPI.get(`/marketplace/assets/${assetId}/import-preview`, {
        params: { project_id: projectId }
      });
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to get import preview',
          code: 'IMPORT_PREVIEW_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // CREATOR ANALYTICS
  // ========================================

  /**
   * Get creator analytics dashboard
   */
  async getCreatorAnalytics(
    timeframe: 'week' | 'month' | 'quarter' | 'year' = 'month'
  ): Promise<MarketplaceResponse<CreatorAnalytics>> {
    try {
      const response = await gameforgeAPI.get<CreatorAnalytics>(`/marketplace/creator/analytics?timeframe=${timeframe}`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch analytics',
          code: 'ANALYTICS_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // COLLECTIONS & WISHLISTS
  // ========================================

  /**
   * Get user's collections
   */
  async getUserCollections(): Promise<MarketplaceResponse<MarketplaceCollection[]>> {
    try {
      const response = await gameforgeAPI.get<MarketplaceCollection[]>('/marketplace/collections');
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch collections',
          code: 'COLLECTIONS_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Add asset to wishlist/favorites
   */
  async addToWishlist(assetId: string): Promise<MarketplaceResponse<{ favorited: boolean }>> {
    try {
      const response = await gameforgeAPI.post(`/marketplace/assets/${assetId}/favorite`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to add to wishlist',
          code: 'WISHLIST_ADD_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }
}

export const enhancedMarketplaceAPI = new EnhancedMarketplaceAPI();