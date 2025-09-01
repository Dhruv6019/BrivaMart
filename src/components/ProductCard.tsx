import React from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCartContext } from '../contexts/CartContext';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
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

  return (
    <div className="group relative bg-white rounded-2xl shadow-elegant hover:shadow-elegant-hover transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
              New
            </span>
          )}
          {product.onSale && (
            <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-medium">
              Sale
            </span>
          )}
          {!product.inStock && (
            <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleWishlistToggle}
              className={cn(
                "bg-white/90 hover:bg-white shadow-md",
                isInWishlist(product.id) && "text-destructive"
              )}
            >
              <Heart className={cn("w-4 h-4", isInWishlist(product.id) && "fill-current")} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleQuickView}
              className="bg-white/90 hover:bg-white shadow-md"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Low Stock Alert */}
        {product.inStock && product.stockQuantity <= product.lowStockAlert && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Only {product.stockQuantity} left!
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.brand}
          </span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-foreground">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full"
          variant={product.inStock ? "default" : "secondary"}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;