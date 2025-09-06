import React from 'react';
import { categories } from '../data/mockData';
import CategoryCard from './CategoryCard';

const CategoriesSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50" id="categories">
      <div className="section-container">
        <div className="text-center mb-10 sm:mb-16">
          <div className="pulse-chip mx-auto mb-3 sm:mb-4">
            <span>Categories</span>
          </div>
          <h2 className="section-title mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl">
            Shop by <br className="hidden sm:block" />Category
          </h2>
          <p className="section-subtitle mx-auto text-base sm:text-lg">
            From kitchen essentials to mobile accessories, find everything you need for your home and lifestyle.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
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