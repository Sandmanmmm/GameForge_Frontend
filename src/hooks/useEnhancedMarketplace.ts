/**
 * Enhanced Marketplace React Hooks
 * ===============================
 * 
 * React hooks for Steam Workshop/Unity Asset Store hybrid marketplace
 * Comprehensive state management for scalable developer ecosystem
 */

import { useState, useEffect, useMemo } from 'react';
import { enhancedMarketplaceAPI } from '../services/enhancedMarketplaceAPI';
import {
  EnhancedMarketplaceItem,
  CreatorProfile,
  MarketplaceHomepage,
  AdvancedSearchFilters,
  SearchResults,
  EnhancedReview,
  Cart,
  CartItem,
  CreatorAnalytics,
  MarketplaceCollection
} from '../types/enhanced-marketplace';

// ========================================
// HOMEPAGE & DISCOVERY HOOKS
// ========================================

/**
 * Hook for marketplace homepage data
 */
export function useMarketplaceHomepage() {
  const [data, setData] = useState<MarketplaceHomepage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHomepage() {
      setLoading(true);
      try {
        const response = await enhancedMarketplaceAPI.getHomepage();
        if (response.success && response.data) {
          setData(response.data);
          setError(null);
        } else {
          setError(response.error?.message || 'Failed to load homepage');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load homepage');
      } finally {
        setLoading(false);
      }
    }

    fetchHomepage();
  }, []);

  return { data, loading, error, refetch: () => window.location.reload() };
}

/**
 * Hook for featured assets
 */
export function useFeaturedAssets(limit = 12) {
  const [assets, setAssets] = useState<EnhancedMarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true);
      try {
        const response = await enhancedMarketplaceAPI.getFeaturedAssets(limit);
        if (response.success) {
          setAssets(response.data || []);
          setError(null);
        } else {
          setError(response.error?.message || 'Failed to load featured assets');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load featured assets');
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, [limit]);

  return { assets, loading, error };
}

/**
 * Hook for trending assets
 */
export function useTrendingAssets(period: 'day' | 'week' | 'month' = 'week', limit = 12) {
  const [assets, setAssets] = useState<EnhancedMarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrending() {
      setLoading(true);
      try {
        const response = await enhancedMarketplaceAPI.getTrendingAssets(period, limit);
        if (response.success) {
          setAssets(response.data || []);
          setError(null);
        } else {
          setError(response.error?.message || 'Failed to load trending assets');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load trending assets');
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, [period, limit]);

  return { assets, loading, error };
}

// ========================================
// SEARCH & FILTERING HOOKS
// ========================================

/**
 * Advanced search hook with filters
 */
export function useMarketplaceSearch(initialFilters?: AdvancedSearchFilters) {
  const [filters, setFilters] = useState<AdvancedSearchFilters>(initialFilters || {});
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const search = async (newFilters?: AdvancedSearchFilters) => {
    const searchFilters = newFilters || filters;
    setLoading(true);
    
    try {
      const response = await enhancedMarketplaceAPI.searchAssets(searchFilters);
      if (response.success && response.data) {
        setResults(response.data);
        setError(null);
        
        // Add to search history
        if (searchFilters.query && !searchHistory.includes(searchFilters.query)) {
          setSearchHistory(prev => [searchFilters.query!, ...prev.slice(0, 9)]);
        }
      } else {
        setError(response.error?.message || 'Search failed');
      }
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<AdvancedSearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
  };

  const clearFilters = () => {
    setFilters({});
    setResults(null);
  };

  return {
    filters,
    results,
    loading,
    error,
    searchHistory,
    search,
    updateFilters,
    clearFilters,
    setFilters
  };
}

/**
 * Search suggestions hook
 */
export function useSearchSuggestions(query: string, debounceMs = 300) {
  const [suggestions, setSuggestions] = useState<{
    assets: { id: string; name: string; thumbnail: string }[];
    creators: { id: string; name: string; avatar: string }[];
    tags: string[];
    categories: { id: string; name: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions(null);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await enhancedMarketplaceAPI.getSearchSuggestions(query);
        if (response.success) {
          setSuggestions(response.data || null);
        }
      } catch (err) {
        // Silently fail for suggestions
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [query, debounceMs]);

  return { suggestions, loading };
}

// ========================================
// ASSET DETAILS HOOKS
// ========================================

/**
 * Single asset details hook
 */
export function useAsset(assetId: string | null) {
  const [asset, setAsset] = useState<EnhancedMarketplaceItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assetId) {
      setAsset(null);
      return;
    }

    async function fetchAsset() {
      if (!assetId) return;
      
      setLoading(true);
      try {
        const response = await enhancedMarketplaceAPI.getAsset(assetId);
        if (response.success && response.data) {
          setAsset(response.data);
          setError(null);
        } else {
          setError(response.error?.message || 'Failed to load asset');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load asset');
      } finally {
        setLoading(false);
      }
    }

    fetchAsset();
  }, [assetId]);

  return { asset, loading, error };
}

/**
 * Related assets hook
 */
export function useRelatedAssets(assetId: string | null, limit = 6) {
  const [assets, setAssets] = useState<EnhancedMarketplaceItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!assetId) return;

    async function fetchRelated() {
      setLoading(true);
      try {
        const response = await enhancedMarketplaceAPI.getRelatedAssets(assetId, limit);
        if (response.success) {
          setAssets(response.data || []);
        }
      } catch (err) {
        // Silently fail for related assets
      } finally {
        setLoading(false);
      }
    }

    fetchRelated();
  }, [assetId, limit]);

  return { assets, loading };
}

// ========================================
// CREATOR HOOKS
// ========================================

/**
 * Creator profile hook
 */
export function useCreatorProfile(creatorId: string | null) {
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!creatorId) return;

    async function fetchCreator() {
      setLoading(true);
      try {
        const response = await enhancedMarketplaceAPI.getCreatorProfile(creatorId);
        if (response.success) {
          setCreator(response.data);
          setError(null);
        } else {
          setError(response.error?.message || 'Failed to load creator');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load creator');
      } finally {
        setLoading(false);
      }
    }

    fetchCreator();
  }, [creatorId]);

  return { creator, loading, error };
}

/**
 * Top creators hook
 */
export function useTopCreators(period: 'month' | 'year' | 'all_time' = 'month', limit = 10) {
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopCreators() {
      setLoading(true);
      try {
        const response = await enhancedMarketplaceAPI.getTopCreators(period, limit);
        if (response.success) {
          setCreators(response.data || []);
          setError(null);
        } else {
          setError(response.error?.message || 'Failed to load top creators');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load top creators');
      } finally {
        setLoading(false);
      }
    }

    fetchTopCreators();
  }, [period, limit]);

  return { creators, loading, error };
}

// ========================================
// REVIEWS HOOKS
// ========================================

/**
 * Asset reviews hook
 */
export function useAssetReviews(
  assetId: string | null,
  page = 1,
  limit = 10,
  sort: 'newest' | 'oldest' | 'helpful' | 'rating_high' | 'rating_low' = 'helpful'
) {
  const [reviews, setReviews] = useState<EnhancedReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (!assetId) return;

    async function fetchReviews() {
      setLoading(true);
      try {
        const response = await enhancedMarketplaceAPI.getAssetReviews(assetId, page, limit, sort);
        if (response.success) {
          setReviews(response.data || []);
          setHasMore(response.pagination?.page < response.pagination?.total_pages);
          setError(null);
        } else {
          setError(response.error?.message || 'Failed to load reviews');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load reviews');
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [assetId, page, limit, sort]);

  return { reviews, loading, error, hasMore };
}

// ========================================
// SHOPPING CART HOOKS
// ========================================

/**
 * Shopping cart hook
 */
export function useShoppingCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      const response = await enhancedMarketplaceAPI.getCart();
      if (response.success) {
        setCart(response.data);
        setError(null);
      } else {
        setError(response.error?.message || 'Failed to load cart');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: CartItem) => {
    try {
      const response = await enhancedMarketplaceAPI.addToCart(item);
      if (response.success) {
        setCart(response.data);
        return true;
      } else {
        setError(response.error?.message || 'Failed to add to cart');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add to cart');
      return false;
    }
  };

  const removeFromCart = async (assetId: string) => {
    try {
      const response = await enhancedMarketplaceAPI.removeFromCart(assetId);
      if (response.success) {
        setCart(response.data);
        return true;
      } else {
        setError(response.error?.message || 'Failed to remove from cart');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove from cart');
      return false;
    }
  };

  const itemCount = useMemo(() => cart?.items.length || 0, [cart]);
  const totalPrice = useMemo(() => cart?.total || 0, [cart]);

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    error,
    itemCount,
    totalPrice,
    addToCart,
    removeFromCart,
    refetch: fetchCart
  };
}

// ========================================
// CREATOR ANALYTICS HOOKS
// ========================================

/**
 * Creator analytics hook (for asset creators)
 */
export function useCreatorAnalytics(timeframe: 'week' | 'month' | 'quarter' | 'year' = 'month') {
  const [analytics, setAnalytics] = useState<CreatorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const response = await enhancedMarketplaceAPI.getCreatorAnalytics(timeframe);
        if (response.success) {
          setAnalytics(response.data);
          setError(null);
        } else {
          setError(response.error?.message || 'Failed to load analytics');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [timeframe]);

  return { analytics, loading, error };
}

// ========================================
// COLLECTIONS & WISHLIST HOOKS
// ========================================

/**
 * User collections hook
 */
export function useUserCollections() {
  const [collections, setCollections] = useState<MarketplaceCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCollections() {
      setLoading(true);
      try {
        const response = await enhancedMarketplaceAPI.getUserCollections();
        if (response.success) {
          setCollections(response.data || []);
          setError(null);
        } else {
          setError(response.error?.message || 'Failed to load collections');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load collections');
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  return { collections, loading, error };
}

/**
 * Wishlist management hook
 */
export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null); // Track which item is being processed

  const addToWishlist = async (assetId: string) => {
    setLoading(assetId);
    try {
      const response = await enhancedMarketplaceAPI.addToWishlist(assetId);
      if (response.success && response.data?.favorited) {
        setWishlistItems(prev => new Set(prev).add(assetId));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    } finally {
      setLoading(null);
    }
  };

  const removeFromWishlist = async (assetId: string) => {
    setLoading(assetId);
    try {
      // Note: API would need a remove endpoint, using add with favorited: false
      setWishlistItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(assetId);
        return newSet;
      });
      return true;
    } catch (err) {
      return false;
    } finally {
      setLoading(null);
    }
  };

  const isInWishlist = (assetId: string) => wishlistItems.has(assetId);
  const isLoading = (assetId: string) => loading === assetId;

  return {
    wishlistItems: Array.from(wishlistItems),
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isLoading
  };
}