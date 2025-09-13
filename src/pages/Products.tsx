import { useState, useMemo, useEffect } from 'react';
import { categories } from '../data/mockData';
import ProductGrid from '../components/ProductGrid';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Search, Filter, Grid, List, ChefHat, Wrench, Scissors, Home, Smartphone } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<string>('all');

  // Use the products hook with filters
  const filters = useMemo(() => {
    const filterObj: any = {};
    
    if (searchTerm) filterObj.search = searchTerm;
    if (selectedCategory !== 'all') filterObj.category = selectedCategory;
    
    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-50':
          filterObj.priceRange = [0, 50];
          break;
        case '50-100':
          filterObj.priceRange = [50, 100];
          break;
        case 'over-100':
          filterObj.priceRange = [100, 999999];
          break;
      }
    }
    
    return filterObj;
  }, [searchTerm, selectedCategory, priceRange]);

  const { products, isLoading } = useProducts(filters);

  const categoryIcons = {
    'Kitchen Ware': ChefHat,
    'Hardware': Wrench,
    'Gardening Tools': Scissors,
    'Home Ware': Home,
    'Mobile Accessory': Smartphone,
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, sortBy]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-muted/30 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-center mb-2 sm:mb-4">Our Products</h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto text-sm sm:text-base">
            Discover our complete range of cutting-edge robotic solutions
          </p>
        </div>
      </div>

      {/* Mobile Categories - Horizontal Scroll */}
      <section className="py-4 sm:py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Browse by category</h2>
            <Button variant="ghost" size="sm" className="text-primary text-sm">
              See All
            </Button>
          </div>
          
          {/* Mobile horizontal scroll categories */}
          <div className="block sm:hidden">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4 pb-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  className="flex-shrink-0 rounded-full"
                  size="sm"
                >
                  All
                </Button>
                {categories.map((category) => {
                  const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Home;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.name ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category.name)}
                      className="flex-shrink-0 rounded-full flex items-center gap-2"
                      size="sm"
                    >
                      <IconComponent className="h-4 w-4" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Desktop/Tablet grid categories */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Home;
              return (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                    selectedCategory === category.name 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      selectedCategory === category.name ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.productCount} items</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="container mx-auto px-4 mb-4 sm:mb-8">
        <div className="bg-card p-3 sm:p-6 rounded-lg shadow-sm">
          {/* Mobile Search */}
          <div className="block sm:hidden mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden sm:flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Price Range */}
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-50">Under $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="over-100">Over $100</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Filter Row */}
          <div className="flex sm:hidden gap-2 items-center">
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-50">Under $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="over-100">Over $100</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price ↑</SelectItem>
                <SelectItem value="price-high">Price ↓</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory !== 'all' || priceRange !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm('')}>
                  Search: {searchTerm} ×
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('all')}>
                  {selectedCategory} ×
                </Badge>
              )}
              {priceRange !== 'all' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setPriceRange('all')}>
                  {priceRange.replace('-', ' - $')} ×
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <p className="text-muted-foreground text-sm sm:text-base">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
        
        <ProductGrid products={filteredProducts} viewMode={viewMode} loading={isLoading} />
      </div>
      </div>
    </>
  );
};

export default Products;