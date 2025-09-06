import React from 'react';
import { products } from '../data/mockData';
import ProductGrid from './ProductGrid';

const FeaturedProducts = () => {
  const featuredProducts = products.filter(product => product.featured);

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white" id="featured-products">
      <div className="section-container">
        <div className="text-center mb-10 sm:mb-16">
          <div className="pulse-chip mx-auto mb-3 sm:mb-4">
            <span>Featured Products</span>
          </div>
          <h2 className="section-title mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl">
            Best Selling <br className="hidden sm:block" />Products
          </h2>
          <p className="section-subtitle mx-auto text-base sm:text-lg">
            Discover our most popular products across kitchen, hardware, gardening, home, and mobile categories.
          </p>
        </div>
        
        <ProductGrid products={featuredProducts} />
      </div>
    </section>
  );
};

export default FeaturedProducts;