import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ChefHat, Wrench, Scissors, Home, Smartphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories } from '../data/mockData';

const Categories = () => {
  const categoryIcons = {
    'Kitchen Ware': ChefHat,
    'Hardware': Wrench,
    'Gardening Tools': Scissors,
    'Home Ware': Home,
    'Mobile Accessory': Smartphone,
  };

  const categoryDescriptions = {
    'Kitchen Ware': 'Professional-grade kitchen equipment, utensils, and appliances for all your culinary needs.',
    'Hardware': 'Quality tools, screws, bolts, and hardware supplies for construction and repair projects.',
    'Gardening Tools': 'Essential gardening equipment and tools to help you maintain your perfect garden.',
    'Home Ware': 'Beautiful home decor, furniture, and household items to make your house a home.',
    'Mobile Accessory': 'Latest mobile accessories including cases, chargers, and tech gadgets.',
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-6 sm:py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="secondary" className="mb-3 sm:mb-4">Product Categories</Badge>
            <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">Shop by Category</h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our wide range of products across five main categories, 
              each carefully curated to meet your specific needs.
            </p>
          </div>

          {/* Categories Grid - Mobile First */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Home;
              
              return (
                <Card key={category.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                        <div className="bg-white/90 p-2 sm:p-3 rounded-full">
                          <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h3 className="text-lg sm:text-xl font-bold">{category.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {category.productCount} products
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 sm:mb-6 line-clamp-3 text-sm sm:text-base">
                        {categoryDescriptions[category.name as keyof typeof categoryDescriptions]}
                      </p>

                      <Button asChild className="w-full group mb-3 sm:mb-4" size="sm">
                        <Link to={`/products?category=${encodeURIComponent(category.name)}`}>
                          Browse {category.name}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>

                      {/* Popular Items Preview */}
                      <div className="pt-3 sm:pt-4 border-t">
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Popular items:</p>
                        <div className="flex flex-wrap gap-1">
                          {category.name === 'Kitchen Ware' && (
                            <>
                              <Badge variant="secondary" className="text-xs">Knives</Badge>
                              <Badge variant="secondary" className="text-xs">Cookware</Badge>
                              <Badge variant="secondary" className="text-xs">Appliances</Badge>
                            </>
                          )}
                          {category.name === 'Hardware' && (
                            <>
                              <Badge variant="secondary" className="text-xs">Tools</Badge>
                              <Badge variant="secondary" className="text-xs">Fasteners</Badge>
                              <Badge variant="secondary" className="text-xs">Power Tools</Badge>
                            </>
                          )}
                          {category.name === 'Gardening Tools' && (
                            <>
                              <Badge variant="secondary" className="text-xs">Hand Tools</Badge>
                              <Badge variant="secondary" className="text-xs">Watering</Badge>
                              <Badge variant="secondary" className="text-xs">Pruning</Badge>
                            </>
                          )}
                          {category.name === 'Home Ware' && (
                            <>
                              <Badge variant="secondary" className="text-xs">Decor</Badge>
                              <Badge variant="secondary" className="text-xs">Storage</Badge>
                              <Badge variant="secondary" className="text-xs">Lighting</Badge>
                            </>
                          )}
                          {category.name === 'Mobile Accessory' && (
                            <>
                              <Badge variant="secondary" className="text-xs">Cases</Badge>
                              <Badge variant="secondary" className="text-xs">Chargers</Badge>
                              <Badge variant="secondary" className="text-xs">Cables</Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 sm:mt-16">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Can't Find What You're Looking For?</h2>
                <p className="text-primary-foreground/80 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                  Our team is here to help you find the perfect products for your needs. 
                  Contact us for personalized recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button variant="secondary" asChild size="sm">
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                  <Button variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild size="sm">
                    <Link to="/products">View All Products</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Categories;