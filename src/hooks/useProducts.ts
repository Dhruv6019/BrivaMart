import { useState, useEffect } from 'react';
import { ProductService, ProductFilters } from '../services/productService';
import { Product } from '../types';
import { toast } from '../components/ui/use-toast';

export const useProducts = (filters: ProductFilters = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await ProductService.getProducts(filters);
      
      if (result.success && result.products) {
        setProducts(result.products);
      } else {
        setError(result.error || 'Failed to load products');
        toast({
          title: "Error",
          description: result.error || 'Failed to load products',
          variant: "destructive"
        });
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred while loading products';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [JSON.stringify(filters)]);

  const createProduct = async (productData: any) => {
    try {
      const result = await ProductService.createProduct(productData);
      
      if (result.success) {
      toast({
        title: "Product Created",
        description: "Product created successfully"
      });
        loadProducts(); // Refresh the list
        return { success: true };
      } else {
        toast.error(result.error || 'Failed to create product');
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const updateProduct = async (id: string, updates: any) => {
    try {
      const result = await ProductService.updateProduct(id, updates);
      
      if (result.success) {
        toast.success('Product updated successfully');
        loadProducts(); // Refresh the list
        return { success: true };
      } else {
        toast.error(result.error || 'Failed to update product');
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const result = await ProductService.deleteProduct(id);
      
      if (result.success) {
        toast.success('Product deleted successfully');
        loadProducts(); // Refresh the list
        return { success: true };
      } else {
        toast.error(result.error || 'Failed to delete product');
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  return {
    products,
      toast({
        title: "Error",
        description: result.error || 'Failed to create product',
        variant: "destructive"
     toast({
       title: "Product Updated",
       description: "Product updated successfully"
     });
    error,
    loadProducts,
    createProduct,
    toast({
      title: "Error",
      description: result.error || 'Failed to update product',
      variant: "destructive"
    });
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive"
  toast({
    title: "Error",
    description: "An unexpected error occurred",
    variant: "destructive"
  });
    deleteProduct
  };
};