import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChefHat, Wrench, Scissors, Home, Smartphone, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '../data/mockData';

const Categories = () => {
  const navigate = useNavigate();
  
  const categoryIcons = {
    'Kitchen Ware': ChefHat,
    'Hardware': Wrench,
    'Gardening Tools': Scissors,
    'Home Ware': Home,
    'Mobile Accessory': Smartphone,
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3 md:hidden">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Browse By Category</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 md:pt-20">
          {/* Desktop Header */}
          <div className="hidden md:block text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">Shop by Category</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our wide range of products across five main categories, 
              each carefully curated to meet your specific needs.
            </p>
          </div>

          {/* Mobile Title Section */}
          <div className="md:hidden mb-6">
            <h2 className="text-2xl font-bold mb-2">Product Categories</h2>
            <p className="text-muted-foreground">
              Stay energized throughout the day.
            </p>
          </div>

          {/* Categories Grid - Mobile Design */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Home;
              
              return (
                <Link 
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group block"
                >
                  <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Icon Badge */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-sm">
                        <IconComponent className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                      
                      {/* Product Count Badge */}
                      <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                        {category.productCount}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-3 md:p-4">
                      <h3 className="font-semibold text-sm md:text-base text-center group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-8 md:mt-16">
            <div className="bg-primary text-primary-foreground rounded-2xl p-6 md:p-8 text-center">
              <h2 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">Need Help Finding Something?</h2>
              <p className="text-primary-foreground/80 mb-4 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
                Our team is here to help you find the perfect products for your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  to="/contact"
                  className="bg-white text-primary font-medium px-6 py-2 rounded-xl hover:bg-white/90 transition-colors"
                >
                  Contact Us
                </Link>
                <Link 
                  to="/products"
                  className="border border-primary-foreground text-primary-foreground font-medium px-6 py-2 rounded-xl hover:bg-primary-foreground hover:text-primary transition-colors"
                >
                  View All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Categories;