import React from 'react';
import { categories } from '../data/mockData';
import CategoryCard from './CategoryCard';

const CategoriesSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50" id="categories">
      <div className="section-container">
        <div className="text-center mb-10 sm:mb-16">
          <div className="pulse-chip mx-auto mb-3 sm:mb-4">
            <span>Categories</span>
          </div>
          <h2 className="section-title mb-3 sm:mb-4">
            Shop by <br className="hidden sm:block" />Category
          </h2>
          <p className="section-subtitle mx-auto">
            From household companions to industrial solutions, find the perfect robot for your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={(cat) => {
                // TODO: Navigate to category page
                console.log('Navigate to category:', cat.slug);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;