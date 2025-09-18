/**
 * Marketplace API Service
 * =======================
 * 
 * Production-ready API service for marketplace functionality.
 * Handles categories, items, purchases, reviews, and AI model marketplace.
 * 
 * Features:
 * - Complete CRUD operations for all marketplace tables
 * - AI model marketplace integration
 * - Purchase and payment processing
 * - Review and rating system
 * - Advanced search and filtering
 * - Analytics and seller dashboard
 */

import { gameforgeAPI } from './api';
import {
  MarketplaceCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  MarketplaceItem,
  CreateItemRequest,
  UpdateItemRequest,
  MarketplacePurchase,
  CreatePurchaseRequest,
  ProcessPaymentRequest,
  MarketplaceReview,
  CreateReviewRequest,
  UpdateReviewRequest,
  AIModelMarketplace,
  MarketplaceSearchRequest,
  CategoryFilter,
  PurchaseFilter,
  ReviewFilter,
  MarketplaceAnalytics,
  SellerAnalytics,
  MarketplaceResponse,
  MarketplacePaginatedResponse
} from '../types/marketplace';

class MarketplaceAPI {
  // ========================================
  // MARKETPLACE CATEGORIES
  // ========================================

  /**
   * Get all marketplace categories
   */
  async getCategories(filter?: CategoryFilter): Promise<MarketplaceResponse<MarketplaceCategory[]>> {
    try {
      const params = new URLSearchParams();
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }

      const url = `/marketplace/categories${params.toString() ? '?' + params.toString() : ''}`;
      const response = await gameforgeAPI.get<MarketplaceCategory[]>(url);
      
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch categories',
          code: 'CATEGORIES_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get category by ID
   */
  async getCategory(categoryId: string): Promise<MarketplaceResponse<MarketplaceCategory>> {
    try {
      const response = await gameforgeAPI.get<MarketplaceCategory>(`/marketplace/categories/${categoryId}`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch category',
          code: 'CATEGORY_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Create new category
   */
  async createCategory(request: CreateCategoryRequest): Promise<MarketplaceResponse<MarketplaceCategory>> {
    try {
      const response = await gameforgeAPI.post<MarketplaceCategory>('/marketplace/categories', request);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to create category',
          code: 'CATEGORY_CREATE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Update category
   */
  async updateCategory(categoryId: string, updates: UpdateCategoryRequest): Promise<MarketplaceResponse<MarketplaceCategory>> {
    try {
      const response = await gameforgeAPI.patch<MarketplaceCategory>(`/marketplace/categories/${categoryId}`, updates);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to update category',
          code: 'CATEGORY_UPDATE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // MARKETPLACE ITEMS
  // ========================================

  /**
   * Search marketplace items
   */
  async searchItems(searchRequest: MarketplaceSearchRequest): Promise<MarketplacePaginatedResponse<MarketplaceItem>> {
    try {
      const params = new URLSearchParams();
      Object.entries(searchRequest).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, String(v)));
          } else {
            params.append(key, String(value));
          }
        }
      });

      const response = await gameforgeAPI.get<{
        items: MarketplaceItem[];
        pagination: {
          page: number;
          per_page: number;
          total: number;
          total_pages: number;
        };
      }>(`/marketplace/items/search?${params}`);
      
      if (!response.data) {
        throw new Error('No data received from API');
      }
      
      return {
        success: true,
        data: response.data.items,
        meta: {
          pagination: response.data.pagination,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to search items',
          code: 'ITEMS_SEARCH_FAILED'
        },
        meta: {
          pagination: {
            page: 1,
            per_page: 10,
            total: 0,
            total_pages: 0
          },
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Get item by ID
   */
  async getItem(itemId: string): Promise<MarketplaceResponse<MarketplaceItem>> {
    try {
      const response = await gameforgeAPI.get<MarketplaceItem>(`/marketplace/items/${itemId}`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch item',
          code: 'ITEM_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get featured items
   */
  async getFeaturedItems(limit: number = 10): Promise<MarketplaceResponse<MarketplaceItem[]>> {
    try {
      const response = await gameforgeAPI.get<MarketplaceItem[]>(`/marketplace/items/featured?limit=${limit}`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch featured items',
          code: 'FEATURED_ITEMS_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get trending items
   */
  async getTrendingItems(limit: number = 10): Promise<MarketplaceResponse<MarketplaceItem[]>> {
    try {
      const response = await gameforgeAPI.get<MarketplaceItem[]>(`/marketplace/items/trending?limit=${limit}`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch trending items',
          code: 'TRENDING_ITEMS_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Create new item
   */
  async createItem(request: CreateItemRequest): Promise<MarketplaceResponse<MarketplaceItem>> {
    try {
      const response = await gameforgeAPI.post<MarketplaceItem>('/marketplace/items', request);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to create item',
          code: 'ITEM_CREATE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Update item
   */
  async updateItem(itemId: string, updates: UpdateItemRequest): Promise<MarketplaceResponse<MarketplaceItem>> {
    try {
      const response = await gameforgeAPI.patch<MarketplaceItem>(`/marketplace/items/${itemId}`, updates);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to update item',
          code: 'ITEM_UPDATE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // MARKETPLACE PURCHASES
  // ========================================

  /**
   * Get user purchases
   */
  async getUserPurchases(userId: string, filter?: PurchaseFilter): Promise<MarketplacePaginatedResponse<MarketplacePurchase>> {
    try {
      const params = new URLSearchParams();
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }

      const url = `/marketplace/users/${userId}/purchases${params.toString() ? '?' + params.toString() : ''}`;
      const response = await gameforgeAPI.get<{
        purchases: MarketplacePurchase[];
        pagination: {
          page: number;
          per_page: number;
          total: number;
          total_pages: number;
        };
      }>(url);
      
      if (!response.data) {
        throw new Error('No data received from API');
      }
      
      return {
        success: true,
        data: response.data.purchases,
        meta: {
          pagination: response.data.pagination,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch purchases',
          code: 'PURCHASES_FETCH_FAILED'
        },
        meta: {
          pagination: {
            page: 1,
            per_page: 10,
            total: 0,
            total_pages: 0
          },
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Create purchase
   */
  async createPurchase(request: CreatePurchaseRequest): Promise<MarketplaceResponse<MarketplacePurchase>> {
    try {
      const response = await gameforgeAPI.post<MarketplacePurchase>('/marketplace/purchases', request);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to create purchase',
          code: 'PURCHASE_CREATE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Process payment for purchase
   */
  async processPayment(request: ProcessPaymentRequest): Promise<MarketplaceResponse<MarketplacePurchase>> {
    try {
      const response = await gameforgeAPI.post<MarketplacePurchase>('/marketplace/purchases/process-payment', request);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to process payment',
          code: 'PAYMENT_PROCESS_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Download purchased item
   */
  async downloadItem(purchaseId: string): Promise<MarketplaceResponse<{ download_url: string; expires_at: string }>> {
    try {
      const response = await gameforgeAPI.post<{ download_url: string; expires_at: string }>(`/marketplace/purchases/${purchaseId}/download`);
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
  // MARKETPLACE REVIEWS
  // ========================================

  /**
   * Get item reviews
   */
  async getItemReviews(itemId: string, filter?: ReviewFilter): Promise<MarketplacePaginatedResponse<MarketplaceReview>> {
    try {
      const params = new URLSearchParams();
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }

      const url = `/marketplace/items/${itemId}/reviews${params.toString() ? '?' + params.toString() : ''}`;
      const response = await gameforgeAPI.get<{
        reviews: MarketplaceReview[];
        pagination: {
          page: number;
          per_page: number;
          total: number;
          total_pages: number;
        };
      }>(url);
      
      if (!response.data) {
        throw new Error('No data received from API');
      }
      
      return {
        success: true,
        data: response.data.reviews,
        meta: {
          pagination: response.data.pagination,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch reviews',
          code: 'REVIEWS_FETCH_FAILED'
        },
        meta: {
          pagination: {
            page: 1,
            per_page: 10,
            total: 0,
            total_pages: 0
          },
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Create review
   */
  async createReview(request: CreateReviewRequest): Promise<MarketplaceResponse<MarketplaceReview>> {
    try {
      const response = await gameforgeAPI.post<MarketplaceReview>('/marketplace/reviews', request);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to create review',
          code: 'REVIEW_CREATE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Update review
   */
  async updateReview(reviewId: string, updates: UpdateReviewRequest): Promise<MarketplaceResponse<MarketplaceReview>> {
    try {
      const response = await gameforgeAPI.patch<MarketplaceReview>(`/marketplace/reviews/${reviewId}`, updates);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to update review',
          code: 'REVIEW_UPDATE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Vote on review helpfulness
   */
  async voteOnReview(reviewId: string, helpful: boolean): Promise<MarketplaceResponse<MarketplaceReview>> {
    try {
      const response = await gameforgeAPI.post<MarketplaceReview>(`/marketplace/reviews/${reviewId}/vote`, { helpful });
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
  // AI MODEL MARKETPLACE
  // ========================================

  /**
   * Get AI models
   */
  async getAIModels(filter?: { model_type?: string; framework?: string; limit?: number }): Promise<MarketplaceResponse<AIModelMarketplace[]>> {
    try {
      const params = new URLSearchParams();
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }

      const url = `/marketplace/ai-models${params.toString() ? '?' + params.toString() : ''}`;
      const response = await gameforgeAPI.get<AIModelMarketplace[]>(url);
      
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch AI models',
          code: 'AI_MODELS_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get AI model by ID
   */
  async getAIModel(modelId: string): Promise<MarketplaceResponse<AIModelMarketplace>> {
    try {
      const response = await gameforgeAPI.get<AIModelMarketplace>(`/marketplace/ai-models/${modelId}`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch AI model',
          code: 'AI_MODEL_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Test AI model inference
   */
  async testModelInference(modelId: string, input: any): Promise<MarketplaceResponse<any>> {
    try {
      const response = await gameforgeAPI.post<any>(`/marketplace/ai-models/${modelId}/test`, { input });
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to test model inference',
          code: 'MODEL_INFERENCE_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  // ========================================
  // ANALYTICS
  // ========================================

  /**
   * Get marketplace analytics
   */
  async getMarketplaceAnalytics(): Promise<MarketplaceResponse<MarketplaceAnalytics>> {
    try {
      const response = await gameforgeAPI.get<MarketplaceAnalytics>('/marketplace/analytics');
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch marketplace analytics',
          code: 'ANALYTICS_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  /**
   * Get seller analytics
   */
  async getSellerAnalytics(sellerId: string): Promise<MarketplaceResponse<SellerAnalytics>> {
    try {
      const response = await gameforgeAPI.get<SellerAnalytics>(`/marketplace/sellers/${sellerId}/analytics`);
      return {
        success: true,
        data: response.data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch seller analytics',
          code: 'SELLER_ANALYTICS_FETCH_FAILED'
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }
}

// Export singleton instance
export const marketplaceAPI = new MarketplaceAPI();
export default marketplaceAPI;