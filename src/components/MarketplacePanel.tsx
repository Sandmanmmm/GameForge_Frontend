import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, Star, Download, TrendingUp, Sparkles, Grid, List } from 'lucide-react';
import { useMarketplaceCategories, useMarketplaceItems, useAIModelsMarketplace } from '../hooks/useMarketplace';
import { MarketplaceItem } from '../types/marketplace';

interface MarketplacePanelProps {
  className?: string;
}

const MarketplacePanel: React.FC<MarketplacePanelProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'ai_models' | 'featured'>('all');

  // Hooks
  const { categories, loading: categoriesLoading } = useMarketplaceCategories();
  const { items, loading: itemsLoading, searchItems } = useMarketplaceItems();
  const { loading: modelsLoading } = useAIModelsMarketplace();

  // Filtered items based on search and category
  const filteredItems = useMemo(() => {
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category_id === selectedCategory);
    }

    return filtered;
  }, [items, searchQuery, selectedCategory]);

  // Featured items (highest rated with significant downloads)
  const featuredItems = useMemo(() => {
    return items
      .filter(item => item.rating_average >= 4.0 && item.download_count >= 100)
      .sort((a, b) => b.rating_average - a.rating_average)
      .slice(0, 6);
  }, [items]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchItems({
        query: query.trim(),
        category_id: selectedCategory || undefined,
        sort_by: 'relevance',
        limit: 20
      });
    }
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price / 100); // Price is in cents
  };

  const formatDownloads = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const renderItemCard = (item: MarketplaceItem) => {
    return (
      <div
        key={item.id}
        className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
      >
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img
            src={item.thumbnail_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/api/placeholder/300/200';
            }}
          />
          {item.pricing_model === 'free' && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Free
            </div>
          )}
          {item.item_type === 'ai_model' && (
            <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI
            </div>
          )}
        </div>
        
        <div className="p-3">
          <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.short_description || item.description}</p>
          
          <div className="flex items-center justify-between mb-2">
            {renderStars(item.rating_average)}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Download className="h-3 w-3" />
              {formatDownloads(item.download_count)}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-gray-900">
              {formatPrice(item.base_price, item.currency)}
            </span>
            <div className="flex items-center gap-1">
              {item.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderListItem = (item: MarketplaceItem) => {
    return (
      <div
        key={item.id}
        className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200 cursor-pointer p-3"
      >
        <div className="flex items-center gap-3">
          <img
            src={item.thumbnail_url}
            alt={item.name}
            className="w-12 h-12 object-cover rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/api/placeholder/48/48';
            }}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm text-gray-900 truncate">{item.name}</h3>
              {item.item_type === 'ai_model' && (
                <span className="bg-purple-100 text-purple-700 text-xs px-1 py-0.5 rounded flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" />
                  AI
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-1 line-clamp-1">{item.short_description || item.description}</p>
            <div className="flex items-center gap-3">
              {renderStars(item.rating_average)}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Download className="h-3 w-3" />
                {formatDownloads(item.download_count)}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-semibold text-sm text-gray-900 mb-1">
              {formatPrice(item.base_price, item.currency)}
            </div>
            <div className="flex items-center gap-1">
              {item.tags.slice(0, 1).map((tag, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getDisplayItems = () => {
    switch (activeTab) {
      case 'ai_models':
        return filteredItems.filter(item => item.item_type === 'ai_model');
      case 'featured':
        return featuredItems;
      default:
        return filteredItems;
    }
  };

  const displayItems = getDisplayItems();
  const isLoading = categoriesLoading || itemsLoading || modelsLoading;

  return (
    <div className={`bg-gray-50 h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            Marketplace
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search marketplace..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-3">
          {[
            { key: 'all', label: 'All Items', count: items.length },
            { key: 'ai_models', label: 'AI Models', count: items.filter(i => i.item_type === 'ai_model').length },
            { key: 'featured', label: 'Featured', count: featuredItems.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : displayItems.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">No items found</h3>
            <p className="text-sm text-gray-500">
              {searchQuery || selectedCategory ? 'Try adjusting your search or filters' : 'No marketplace items available'}
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3'
              : 'space-y-2'
          }>
            {displayItems.map(item => 
              viewMode === 'grid' ? renderItemCard(item) : renderListItem(item)
            )}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{displayItems.length} items</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {items.filter(i => i.rating_average >= 4.0).length} highly rated
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {items.filter(i => i.item_type === 'ai_model').length} AI models
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePanel;