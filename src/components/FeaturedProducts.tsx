import React from 'react';
import { products } from '../data/mockData';
import ProductGrid from './ProductGrid';

const FeaturedProducts = () => {
  const featuredProducts = products.filter(product => product.featured);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white" id="featured-products">
      <div className="section-container">
        <div className="text-center mb-10 sm:mb-16">
          <div className="pulse-chip mx-auto mb-3 sm:mb-4">
            <span>Featured Products</span>
          </div>
          <h2 className="section-title mb-3 sm:mb-4">
            Best Selling <br className="hidden sm:block" />Robots & AI
          </h2>
          <p className="section-subtitle mx-auto">
            Discover our most popular robotics solutions trusted by thousands of customers worldwide.
          </p>
        </div>
        
        <ProductGrid products={featuredProducts} />
      </div>
    </section>
  );
};

export default FeaturedProducts;