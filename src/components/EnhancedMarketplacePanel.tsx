/**
 * Enhanced Marketplace Panel - Steam Workshop/Unity Asset Store Hybrid
 * ==================================================================
 * 
 * Comprehensive marketplace interface with:
 * - Homepage with featured content
 * - Advanced search & filtering
 * - Asset cards with previews
 * - Creator spotlights
 * - Category browsing
 * - Shopping cart integration
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlass, 
  SlidersHorizontal, 
  GridFour,
  List,
  Star,
  Download,
  Heart,
  ShoppingCart,
  Play,
  Eye,
  User,
  Tag,
  TrendingUp,
  Fire,
  Crown,
  Plus,
  X,
  CaretDown,
  CaretLeft,
  CaretRight
} from '@phosphor-icons/react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

// Import our enhanced hooks (we'll create basic versions for now)
// import { useMarketplaceHomepage, useFeaturedAssets, useTrendingAssets, useMarketplaceSearch } from '@/hooks/useEnhancedMarketplace'

// Mock data for development (replace with real API calls)
const mockCategories = [
  { id: '1', name: '3D Models', icon: '🎲', count: 1245, featured: true },
  { id: '2', name: 'Textures', icon: '🎨', count: 2134, featured: true },
  { id: '3', name: 'Audio', icon: '🎵', count: 856, featured: true },
  { id: '4', name: 'UI Kits', icon: '📱', count: 423, featured: true },
  { id: '5', name: 'Scripts', icon: '💻', count: 789, featured: false },
  { id: '6', name: 'Shaders', icon: '✨', count: 345, featured: false },
  { id: '7', name: 'VFX', icon: '💥', count: 567, featured: false },
  { id: '8', name: 'AI Models', icon: '🤖', count: 234, featured: true },
]

const mockFeaturedAssets = [
  {
    id: '1',
    name: 'Cyberpunk City Pack',
    creator: 'TechArtist3D',
    price: 49.99,
    rating: 4.8,
    downloads: 15420,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
    tags: ['3D', 'Environment', 'Cyberpunk'],
    featured: true,
    onSale: false
  },
  {
    id: '2', 
    name: 'Fantasy Character Animations',
    creator: 'AnimStudio',
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.9,
    downloads: 8930,
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
    tags: ['Animation', 'Character', 'Fantasy'],
    featured: true,
    onSale: true
  },
  {
    id: '3',
    name: 'Procedural Materials Bundle',
    creator: 'MaterialMaster',
    price: 0,
    rating: 4.6,
    downloads: 45203,
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    tags: ['Materials', 'Procedural', 'PBR'],
    featured: true,
    onSale: false
  }
]

const mockTopCreators = [
  { id: '1', name: 'TechArtist3D', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', verified: true, totalAssets: 124, rating: 4.9 },
  { id: '2', name: 'AnimStudio', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b95b2ad9?w=40&h=40&fit=crop&crop=face', verified: true, totalAssets: 89, rating: 4.8 },
  { id: '3', name: 'MaterialMaster', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', verified: false, totalAssets: 67, rating: 4.7 }
]

interface MarketplacePanelProps {
  className?: string
}

type ViewMode = 'grid' | 'list'
type MarketplaceView = 'homepage' | 'search' | 'category' | 'asset_detail' | 'creator_profile' | 'cart'

export default function MarketplacePanel({ className }: MarketplacePanelProps) {
  const [currentView, setCurrentView] = useState<MarketplaceView>('homepage')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [cartItems, setCartItems] = useState<string[]>([])
  const [wishlistItems, setWishlistItems] = useState<string[]>([])
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedEngines, setSelectedEngines] = useState<string[]>([])
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('relevance')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setCurrentView('search')
    } else {
      setCurrentView('homepage')
    }
  }

  const handleAddToCart = (assetId: string) => {
    setCartItems(prev => prev.includes(assetId) ? prev : [...prev, assetId])
  }

  const handleToggleWishlist = (assetId: string) => {
    setWishlistItems(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    )
  }

  // Asset Card Component
  const AssetCard = ({ asset, compact = false }: { asset: any, compact?: boolean }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group cursor-pointer",
        compact ? "flex gap-3 p-3" : "space-y-3"
      )}
    >
      <Card className="glass-card border-border/50 hover:border-accent/50 transition-all duration-300 h-full">
        <div className={cn("relative overflow-hidden", compact ? "w-20 h-20" : "w-full h-48")}>
          <img 
            src={asset.thumbnail} 
            alt={asset.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Eye size={16} />
            </Button>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Play size={16} />
            </Button>
          </div>

          {/* Sale badge */}
          {asset.onSale && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              SALE
            </Badge>
          )}

          {/* Featured badge */}
          {asset.featured && (
            <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
              <Crown size={12} className="mr-1" />
              Featured
            </Badge>
          )}
        </div>

        <CardContent className={cn("space-y-2", compact ? "flex-1 py-2" : "p-4")}>
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn("font-semibold text-foreground line-clamp-2", compact ? "text-sm" : "text-base")}>
              {asset.name}
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                handleToggleWishlist(asset.id)
              }}
            >
              <Heart 
                size={14} 
                className={cn(
                  "transition-colors",
                  wishlistItems.includes(asset.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                )}
              />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User size={12} />
            <span>{asset.creator}</span>
            {asset.verified && <Badge variant="outline" className="h-4 text-xs">✓</Badge>}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{asset.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Download size={12} />
              <span>{asset.downloads.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {asset.tags.slice(0, compact ? 2 : 3).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              {asset.onSale && asset.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${asset.originalPrice}
                </span>
              )}
              <div className="font-bold text-lg">
                {asset.price === 0 ? 'FREE' : `$${asset.price}`}
              </div>
            </div>
            
            <Button 
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleAddToCart(asset.id)
              }}
              className="bg-accent hover:bg-accent/90"
            >
              {cartItems.includes(asset.id) ? (
                <>Added <ShoppingCart size={14} className="ml-1" /></>
              ) : (
                <>Add <Plus size={14} className="ml-1" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  // Homepage View
  const HomepageView = () => (
    <div className="space-y-6">
      {/* Hero Banner */}
      <Card className="glass-card bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Welcome to GameForge Marketplace
              </h2>
              <p className="text-muted-foreground">
                Discover premium assets, tools, and resources for your game projects
              </p>
              <Button className="bg-accent hover:bg-accent/90 mt-4">
                Browse All Assets
              </Button>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1551739440-5dd934d3a94a?w=200&h=120&fit=crop" 
                alt="Marketplace"
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GridFour size={20} />
          Browse Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mockCategories.filter(cat => cat.featured).map(category => (
            <Card 
              key={category.id}
              className="glass-card hover:border-accent/50 cursor-pointer transition-all duration-200 group"
              onClick={() => {
                setSelectedCategory(category.id)
                setCurrentView('category')
              }}
            >
              <CardContent className="p-4 text-center space-y-2">
                <div className="text-2xl mb-2">{category.icon}</div>
                <h4 className="font-medium text-sm group-hover:text-accent transition-colors">
                  {category.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {category.count.toLocaleString()} assets
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Assets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Crown size={20} className="text-accent" />
            Featured Assets
          </h3>
          <Button variant="ghost" size="sm">
            View All <CaretRight size={14} className="ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockFeaturedAssets.map(asset => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </div>

      {/* Top Creators */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User size={20} />
          Top Creators
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockTopCreators.map(creator => (
            <Card key={creator.id} className="glass-card hover:border-accent/50 cursor-pointer transition-all">
              <CardContent className="p-4 text-center space-y-3">
                <div className="relative w-16 h-16 mx-auto">
                  <img 
                    src={creator.avatar} 
                    alt={creator.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                  {creator.verified && (
                    <Badge className="absolute -bottom-1 -right-1 bg-accent text-accent-foreground p-1 h-auto">
                      ✓
                    </Badge>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{creator.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {creator.totalAssets} assets
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{creator.rating}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Follow
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  // Search View
  const SearchView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Search Results for "{searchQuery}"
        </h3>
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <GridFour size={16} />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      {/* Search Results */}
      <div className={cn(
        "gap-4",
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "space-y-4"
      )}>
        {mockFeaturedAssets.map(asset => (
          <AssetCard key={asset.id} asset={asset} compact={viewMode === 'list'} />
        ))}
      </div>
    </div>
  )

  return (
    <div className={cn("h-full flex flex-col bg-background", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border/50 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assets, creators, categories..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10 bg-muted/30"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} />
          </Button>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as MarketplaceView)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="homepage" className="text-xs">Home</TabsTrigger>
            <TabsTrigger value="search" className="text-xs">Search</TabsTrigger>
            <TabsTrigger value="category" className="text-xs">Categories</TabsTrigger>
            <TabsTrigger value="cart" className="text-xs relative">
              Cart
              {cartItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground h-5 w-5 text-xs p-0 flex items-center justify-center">
                  {cartItems.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-border/50 bg-muted/30"
          >
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Min Rating</label>
                  <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any Rating</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="downloads">Downloads</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setPriceRange([0, 100])
                      setMinRating(0)
                      setSortBy('relevance')
                      setSelectedEngines([])
                      setSelectedLicenses([])
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <ScrollArea className="flex-1 p-4">
        <AnimatePresence mode="wait">
          {currentView === 'homepage' && (
            <motion.div
              key="homepage"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <HomepageView />
            </motion.div>
          )}
          {currentView === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SearchView />
            </motion.div>
          )}
          {currentView === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12"
            >
              <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">Browse our marketplace to find amazing assets for your projects</p>
              <Button onClick={() => setCurrentView('homepage')}>
                Continue Shopping
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  )
}