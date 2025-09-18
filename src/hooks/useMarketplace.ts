import { useState, useEffect, useCallback } from 'react';
import { 
  MarketplaceCategory, 
  MarketplaceItem, 
  MarketplacePurchase, 
  MarketplaceReview, 
  AIModelMarketplace,
  MarketplaceSearchRequest,
  CreateCategoryRequest,
  CreateItemRequest,
  CreatePurchaseRequest,
  CreateReviewRequest,
  UpdateCategoryRequest,
  UpdateItemRequest,
  UpdateReviewRequest,
  PurchaseFilter,
  ReviewFilter
} from '../types/marketplace';
import { marketplaceAPI } from '../services/marketplaceAPI';

// Category hooks
export const useMarketplaceCategories = () => {
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceAPI.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch categories');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (request: CreateCategoryRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceAPI.createCategory(request);
      if (response.success && response.data) {
        setCategories(prev => [...prev, response.data!]);
        return response.data;
      } else {
        setError(response.error?.message || 'Failed to create category');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: string, request: UpdateCategoryRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceAPI.updateCategory(id, request);
      if (response.success && response.data) {
        setCategories(prev => prev.map(cat => cat.id === id ? response.data! : cat));
        return response.data;
      } else {
        setError(response.error?.message || 'Failed to update category');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
    createCategory,
    updateCategory
  };
};

// Items hooks
export const useMarketplaceItems = (searchParams?: MarketplaceSearchRequest) => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  });

  const searchItems = useCallback(async (params?: MarketplaceSearchRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceAPI.searchItems(params || {});
      if (response.success && response.data) {
        setItems(response.data);
        if (response.meta?.pagination) {
          setPagination(response.meta.pagination);
        }
      } else {
        setError(response.error?.message || 'Failed to search items');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search items');
    } finally {
      setLoading(false);
    }
  }, []);

  const getItem = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceAPI.getItem(id);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error?.message || 'Failed to get item');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get item');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(async (request: CreateItemRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceAPI.createItem(request);
      if (response.success && response.data) {
        setItems(prev => [response.data!, ...prev]);
        return response.data;
      } else {
        setError(response.error?.message || 'Failed to create item');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create item');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (id: string, request: UpdateItemRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceAPI.updateItem(id, request);
      if (response.success && response.data) {
        setItems(prev => prev.map(item => item.id === id ? response.data! : item));
        return response.data;
      } else {
        setError(response.error?.message || 'Failed to update item');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update item');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    searchItems(searchParams);
  }, [searchItems, searchParams]);

  return {
    items,
    loading,
    error,
    pagination,
    searchItems,
    getItem,
    createItem,
    updateItem
  };
};

// Purchases hooks
export const useMarketplacePurchases = (userId: string, purchaseFilter?: PurchaseFilter) => {
  const [purchases, setPurchases] = useState<MarketplacePurchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  });

  const fetchPurchases = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceAPI.getUserPurchases(userId, {
        ...purchaseFilter,
        buyer_id: userId
      });
      if (response.success && response.data) {
        setPurchases(response.data);
        if (response.meta?.pagination) {
          setPagination(response.meta.pagination);
        }
      } else {
        setError(response.error?.message || 'Failed to fetch purchases');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch purchases');
    } finally {
      setLoading(false);
    }
  }, [userId, purchaseFilter]);

  const createPurchase = useCallback(async (request: CreatePurchaseRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceAPI.createPurchase(request);
      if (response.success && response.data) {
        setPurchases(prev => [response.data!, ...prev]);
        return response.data;
      } else {
        setError(response.error?.message || 'Failed to create purchase');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create purchase');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  return {
    purchases,
    loading,
    error,
    pagination,
    refresh: fetchPurchases,
    createPurchase
  };
};

// Reviews hooks
export const useMarketplaceReviews = (itemId: string, reviewFilter?: ReviewFilter) => {
  const [reviews, setReviews] = useState<MarketplaceReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0
  });

  const fetchReviews = useCallback(async () => {
    if (!itemId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceAPI.getItemReviews(itemId, {
        ...reviewFilter,
        item_id: itemId
      });
      if (response.success && response.data) {
        setReviews(response.data);
        if (response.meta?.pagination) {
          setPagination(response.meta.pagination);
        }
      } else {
        setError(response.error?.message || 'Failed to fetch reviews');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, [itemId, reviewFilter]);

  const createReview = useCallback(async (request: CreateReviewRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceAPI.createReview(request);
      if (response.success && response.data) {
        setReviews(prev => [response.data!, ...prev]);
        return response.data;
      } else {
        setError(response.error?.message || 'Failed to create review');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create review');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReview = useCallback(async (id: string, request: UpdateReviewRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceAPI.updateReview(id, request);
      if (response.success && response.data) {
        setReviews(prev => prev.map(review => review.id === id ? response.data! : review));
        return response.data;
      } else {
        setError(response.error?.message || 'Failed to update review');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update review');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    error,
    pagination,
    refresh: fetchReviews,
    createReview,
    updateReview
  };
};

// AI Models hooks
export const useAIModelsMarketplace = () => {
  const [models, setModels] = useState<AIModelMarketplace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceAPI.getAIModels();
      if (response.success && response.data) {
        setModels(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch AI models');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch AI models');
    } finally {
      setLoading(false);
    }
  }, []);

  const getModel = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceAPI.getAIModel(id);
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error?.message || 'Failed to get AI model');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get AI model');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return {
    models,
    loading,
    error,
    refresh: fetchModels,
    getModel
  };
};

// Combined marketplace hook for comprehensive state management
export const useMarketplace = () => {
  const categories = useMarketplaceCategories();
  const items = useMarketplaceItems();
  const aiModels = useAIModelsMarketplace();

  // For purchases and reviews, these would typically be used with specific IDs
  // So we provide factory functions instead of direct hooks
  const createPurchasesHook = useCallback((userId: string, purchaseFilter?: PurchaseFilter) => {
    return useMarketplacePurchases(userId, purchaseFilter);
  }, []);

  const createReviewsHook = useCallback((itemId: string, reviewFilter?: ReviewFilter) => {
    return useMarketplaceReviews(itemId, reviewFilter);
  }, []);

  return {
    categories,
    items,
    aiModels,
    createPurchasesHook,
    createReviewsHook
  };
};

export default useMarketplace;