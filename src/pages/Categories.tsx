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
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Product Categories</Badge>
            <h1 className="text-4xl font-bold mb-6">Shop by Category</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our wide range of products across five main categories, 
              each carefully curated to meet your specific needs.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Home;
              
              return (
                <Card key={category.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/90 p-3 rounded-full">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold">{category.name}</h3>
                        <Badge variant="outline">
                          {category.productCount} products
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-6 line-clamp-3">
                        {categoryDescriptions[category.name as keyof typeof categoryDescriptions]}
                      </p>

                      <Button asChild className="w-full group">
                        <Link to={`/products?category=${encodeURIComponent(category.name)}`}>
                          Browse {category.name}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>

                      {/* Popular Items Preview */}
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Popular items:</p>
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
          <div className="text-center mt-16">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
                  Our team is here to help you find the perfect products for your needs. 
                  Contact us for personalized recommendations.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="secondary" asChild>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                  <Button variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
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