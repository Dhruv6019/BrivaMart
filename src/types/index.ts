export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  lowStockAlert: number;
  specifications: Record<string, string>;
  variants: ProductVariant[];
  tags: string[];
  featured: boolean;
  isNew: boolean;
  onSale: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'style';
  value: string;
  price?: number;
  stockQuantity: number;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  image: string;
  description: string;
  productCount: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  product: Product;
  variant?: ProductVariant;
}

export interface WishlistItem {
  id: string;
  productId: string;
  addedAt: Date;
  product: Product;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  orders: Order[];
  wishlist: WishlistItem[];
  preferences: {
    newsletter: boolean;
    notifications: boolean;
  };
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  createdAt: Date;
}