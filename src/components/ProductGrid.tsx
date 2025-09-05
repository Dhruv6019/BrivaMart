import React, { useState } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import ProductQuickView from './ProductQuickView';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading, viewMode = 'grid' }) => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (loading) {
    return (
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6" 
        : "space-y-4"
      }>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            {viewMode === 'grid' ? (
              <>
                <div className="bg-gray-200 aspect-square rounded-lg sm:rounded-2xl mb-2 sm:mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 sm:h-8 bg-gray-200 rounded"></div>
                </div>
              </>
            ) : (
              <div className="flex gap-4 p-4 bg-card rounded-lg">
                <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6" 
        : "space-y-3 sm:space-y-4"
      }>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={setQuickViewProduct}
            viewMode={viewMode}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found</p>
        </div>
      )}

      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
};

export default ProductGrid;