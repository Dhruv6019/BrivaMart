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
      className="group cursor-pointer bg-white rounded-2xl shadow-elegant hover:shadow-elegant-hover transition-all duration-300 overflow-hidden"
    >
      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-3">
          {category.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {category.productCount} products
          </span>
          <span className="text-primary font-medium group-hover:underline">
            Explore →
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;