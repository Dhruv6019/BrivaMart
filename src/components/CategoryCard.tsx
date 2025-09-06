import React from 'react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onClick?: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <div
      onClick={() => onClick?.(category)}
      className="category-card group cursor-pointer bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-elegant hover:shadow-elegant-hover transition-all duration-300 overflow-hidden"
    >
      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 sm:p-4 lg:p-6">
        <h3 className="text-sm sm:text-base lg:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {category.name}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
          {category.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-muted-foreground">
            {category.productCount} items
          </span>
          <span className="text-primary font-medium group-hover:underline text-xs sm:text-sm">
            Shop →
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;