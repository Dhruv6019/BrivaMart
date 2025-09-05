import React from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCartContext } from '../contexts/CartContext';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, viewMode = 'grid' }) => {
  const { addToCart, addToWishlist, isInWishlist } = useCartContext();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      // removeFromWishlist(product.id); // Commented to prevent removal on re-click
    } else {
      addToWishlist(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(product);
  };

  if (viewMode === 'list') {
    return (
      <div className="group bg-card rounded-lg sm:rounded-2xl shadow-elegant hover:shadow-elegant-hover transition-all duration-300 overflow-hidden">
        <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
          {/* Image */}
          <div className="relative w-20 sm:w-24 h-20 sm:h-24 flex-shrink-0 overflow-hidden bg-gray-50 rounded-lg">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Badges */}
            <div className="absolute top-1 left-1 flex flex-col gap-1">
              {product.isNew && (
                <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full text-xs font-medium">
                  New
                </span>
              )}
              {product.onSale && (
                <span className="bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full text-xs font-medium">
                  Sale
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2 mb-1">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {product.brand}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleWishlistToggle}
                className={cn(
                  "p-1 h-auto",
                  isInWishlist(product.id) && "text-destructive"
                )}
              >
                <Heart className={cn("w-4 h-4", isInWishlist(product.id) && "fill-current")} />
              </Button>
            </div>
            
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-1 sm:line-clamp-2">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price and Action */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold text-foreground">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                size="sm"
                variant={product.inStock ? "default" : "secondary"}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                {product.inStock ? "Add" : "Out"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-card rounded-lg sm:rounded-2xl shadow-elegant hover:shadow-elegant-hover transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2">
          {product.isNew && (
            <span className="bg-primary text-primary-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium">
              New
            </span>
          )}
          {product.onSale && (
            <span className="bg-destructive text-destructive-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium">
              Sale
            </span>
          )}
          {!product.inStock && (
            <span className="bg-muted text-muted-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium">
              Out of Stock
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col gap-1 sm:gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleWishlistToggle}
              className={cn(
                "bg-white/90 hover:bg-white shadow-md w-8 h-8 sm:w-10 sm:h-10",
                isInWishlist(product.id) && "text-destructive"
              )}
            >
              <Heart className={cn("w-3 h-3 sm:w-4 sm:h-4", isInWishlist(product.id) && "fill-current")} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleQuickView}
              className="bg-white/90 hover:bg-white shadow-md w-8 h-8 sm:w-10 sm:h-10"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* Low Stock Alert */}
        {product.inStock && product.stockQuantity <= product.lowStockAlert && (
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
            <span className="bg-orange-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium">
              Only {product.stockQuantity} left!
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <div className="mb-1 sm:mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.brand}
          </span>
        </div>
        
        <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2 sm:mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3 sm:w-4 sm:h-4",
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <span className="text-lg sm:text-xl font-bold text-foreground">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xs sm:text-sm text-muted-foreground line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full text-xs sm:text-sm"
          variant={product.inStock ? "default" : "secondary"}
          size="sm"
        >
          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;