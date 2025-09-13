import { supabase } from '../lib/supabase';
import { Product } from '../types';

export interface ProductFilters {
  category?: string;
  search?: string;
  priceRange?: [number, number];
  inStock?: boolean;
  featured?: boolean;
  isNew?: boolean;
  onSale?: boolean;
}

export interface ProductCreateData {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  images?: string[];
  specifications?: Record<string, string>;
  variants?: any[];
  tags?: string[];
  stockQuantity?: number;
  lowStockAlert?: number;
  featured?: boolean;
  isNew?: boolean;
  onSale?: boolean;
}

export class ProductService {
  /**
   * Get all products with filters
   */
  static async getProducts(filters: ProductFilters = {}): Promise<{
    success: boolean;
    products?: Product[];
    error?: string;
  }> {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.inStock !== undefined) {
        query = query.eq('in_stock', filters.inStock);
      }

      if (filters.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }

      if (filters.isNew !== undefined) {
        query = query.eq('is_new', filters.isNew);
      }

      if (filters.onSale !== undefined) {
        query = query.eq('on_sale', filters.onSale);
      }

      if (filters.priceRange) {
        query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
      }

      const { data: products, error } = await query;

      if (error) {
        console.error('Get products error:', error);
        return { success: false, error: 'Failed to load products' };
      }

      // Transform database format to frontend format
      const transformedProducts: Product[] = (products || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        price: p.price,
        originalPrice: p.original_price,
        images: Array.isArray(p.images) ? p.images : ['/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png'],
        category: p.category,
        subcategory: p.subcategory || '',
        brand: p.brand || '',
        rating: p.rating,
        reviewCount: p.review_count,
        inStock: p.in_stock,
        stockQuantity: p.stock_quantity,
        lowStockAlert: p.low_stock_alert,
        specifications: p.specifications || {},
        variants: p.variants || [],
        tags: p.tags || [],
        featured: p.featured,
        isNew: p.is_new,
        onSale: p.on_sale
      }));

      return { success: true, products: transformedProducts };
    } catch (error) {
      console.error('Get products error:', error);
      return { success: false, error: 'An unexpected error occurred while loading products' };
    }
  }

  /**
   * Get single product by ID
   */
  static async getProduct(id: string): Promise<{
    success: boolean;
    product?: Product;
    error?: string;
  }> {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { success: false, error: 'Product not found' };
      }

      const transformedProduct: Product = {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        originalPrice: product.original_price,
        images: Array.isArray(product.images) ? product.images : ['/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png'],
        category: product.category,
        subcategory: product.subcategory || '',
        brand: product.brand || '',
        rating: product.rating,
        reviewCount: product.review_count,
        inStock: product.in_stock,
        stockQuantity: product.stock_quantity,
        lowStockAlert: product.low_stock_alert,
        specifications: product.specifications || {},
        variants: product.variants || [],
        tags: product.tags || [],
        featured: product.featured,
        isNew: product.is_new,
        onSale: product.on_sale
      };

      return { success: true, product: transformedProduct };
    } catch (error) {
      console.error('Get product error:', error);
      return { success: false, error: 'Failed to load product' };
    }
  }

  /**
   * Create new product (Admin only)
   */
  static async createProduct(productData: ProductCreateData): Promise<{
    success: boolean;
    product?: Product;
    error?: string;
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        return { success: false, error: 'Unauthorized: Admin access required' };
      }

      const { data: product, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          original_price: productData.originalPrice,
          category: productData.category,
          subcategory: productData.subcategory,
          brand: productData.brand,
          images: productData.images || ['/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png'],
          specifications: productData.specifications || {},
          variants: productData.variants || [],
          tags: productData.tags || [],
          stock_quantity: productData.stockQuantity || 0,
          low_stock_alert: productData.lowStockAlert || 5,
          featured: productData.featured || false,
          is_new: productData.isNew || false,
          on_sale: productData.onSale || false
        })
        .select()
        .single();

      if (error) {
        console.error('Create product error:', error);
        return { success: false, error: 'Failed to create product' };
      }

      // Log product creation
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'product_created',
        resource: 'products',
        details: { product_id: product.id, name: product.name },
        success: true
      });

      return { success: true, product: this.transformProduct(product) };
    } catch (error) {
      console.error('Create product error:', error);
      return { success: false, error: 'An unexpected error occurred while creating product' };
    }
  }

  /**
   * Update product (Admin only)
   */
  static async updateProduct(id: string, updates: Partial<ProductCreateData>): Promise<{
    success: boolean;
    product?: Product;
    error?: string;
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        return { success: false, error: 'Unauthorized: Admin access required' };
      }

      const updateData: any = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.price) updateData.price = updates.price;
      if (updates.originalPrice !== undefined) updateData.original_price = updates.originalPrice;
      if (updates.category) updateData.category = updates.category;
      if (updates.subcategory !== undefined) updateData.subcategory = updates.subcategory;
      if (updates.brand !== undefined) updateData.brand = updates.brand;
      if (updates.images) updateData.images = updates.images;
      if (updates.specifications) updateData.specifications = updates.specifications;
      if (updates.variants) updateData.variants = updates.variants;
      if (updates.tags) updateData.tags = updates.tags;
      if (updates.stockQuantity !== undefined) updateData.stock_quantity = updates.stockQuantity;
      if (updates.lowStockAlert !== undefined) updateData.low_stock_alert = updates.lowStockAlert;
      if (updates.featured !== undefined) updateData.featured = updates.featured;
      if (updates.isNew !== undefined) updateData.is_new = updates.isNew;
      if (updates.onSale !== undefined) updateData.on_sale = updates.onSale;

      const { data: product, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update product error:', error);
        return { success: false, error: 'Failed to update product' };
      }

      // Log product update
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'product_updated',
        resource: 'products',
        details: { product_id: id, updated_fields: Object.keys(updateData) },
        success: true
      });

      return { success: true, product: this.transformProduct(product) };
    } catch (error) {
      console.error('Update product error:', error);
      return { success: false, error: 'An unexpected error occurred while updating product' };
    }
  }

  /**
   * Delete product (Admin only)
   */
  static async deleteProduct(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        return { success: false, error: 'Unauthorized: Admin access required' };
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete product error:', error);
        return { success: false, error: 'Failed to delete product' };
      }

      // Log product deletion
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'product_deleted',
        resource: 'products',
        details: { product_id: id },
        success: true
      });

      return { success: true };
    } catch (error) {
      console.error('Delete product error:', error);
      return { success: false, error: 'An unexpected error occurred while deleting product' };
    }
  }

  /**
   * Transform database product to frontend format
   */
  private static transformProduct(dbProduct: any): Product {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      description: dbProduct.description || '',
      price: dbProduct.price,
      originalPrice: dbProduct.original_price,
      images: Array.isArray(dbProduct.images) ? dbProduct.images : ['/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png'],
      category: dbProduct.category,
      subcategory: dbProduct.subcategory || '',
      brand: dbProduct.brand || '',
      rating: dbProduct.rating,
      reviewCount: dbProduct.review_count,
      inStock: dbProduct.in_stock,
      stockQuantity: dbProduct.stock_quantity,
      lowStockAlert: dbProduct.low_stock_alert,
      specifications: dbProduct.specifications || {},
      variants: dbProduct.variants || [],
      tags: dbProduct.tags || [],
      featured: dbProduct.featured,
      isNew: dbProduct.is_new,
      onSale: dbProduct.on_sale
    };
  }
}