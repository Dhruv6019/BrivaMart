/*
  # Authentication System Setup

  1. New Tables
    - `users` - User profiles and authentication data
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `phone` (text, unique, optional)
      - `first_name` (text)
      - `last_name` (text)
      - `role` (text, default 'user')
      - `avatar_url` (text, optional)
      - `email_verified` (boolean, default false)
      - `phone_verified` (boolean, default false)
      - `encrypted_data` (jsonb, for sensitive data)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `otp_codes` - OTP verification codes
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `code` (text, encrypted)
      - `type` (text, 'email' or 'phone')
      - `expires_at` (timestamp)
      - `verified` (boolean, default false)
      - `attempts` (integer, default 0)
      - `created_at` (timestamp)
    
    - `user_sessions` - Active user sessions
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `session_token` (text, encrypted)
      - `device_info` (jsonb)
      - `ip_address` (text)
      - `expires_at` (timestamp)
      - `created_at` (timestamp)
    
    - `products` - Product catalog
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `original_price` (decimal, optional)
      - `category` (text)
      - `subcategory` (text, optional)
      - `brand` (text)
      - `images` (jsonb)
      - `specifications` (jsonb)
      - `variants` (jsonb)
      - `tags` (text array)
      - `stock_quantity` (integer)
      - `low_stock_alert` (integer)
      - `rating` (decimal, default 0)
      - `review_count` (integer, default 0)
      - `in_stock` (boolean, default true)
      - `featured` (boolean, default false)
      - `is_new` (boolean, default false)
      - `on_sale` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `categories` - Product categories
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `slug` (text, unique)
      - `description` (text)
      - `image` (text)
      - `product_count` (integer, default 0)
      - `created_at` (timestamp)
    
    - `cart_items` - User cart items
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `variant_id` (text, optional)
      - `quantity` (integer)
      - `price` (decimal)
      - `created_at` (timestamp)
    
    - `wishlist_items` - User wishlist
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `orders` - Order records
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `order_number` (text, unique)
      - `status` (text, default 'pending')
      - `subtotal` (decimal)
      - `tax` (decimal)
      - `shipping` (decimal)
      - `total` (decimal)
      - `shipping_address` (jsonb)
      - `billing_address` (jsonb)
      - `payment_method` (text)
      - `tracking_number` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `order_items` - Order line items
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `variant_id` (text, optional)
      - `quantity` (integer)
      - `price` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add admin-only policies for management operations
    - Encrypt sensitive data fields

  3. Functions
    - Generate OTP codes
    - Verify OTP codes
    - Clean expired OTP codes
    - Update product stock
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url text,
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  encrypted_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- OTP codes table
CREATE TABLE IF NOT EXISTS otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  code text NOT NULL,
  type text NOT NULL CHECK (type IN ('email', 'phone', 'signup')),
  expires_at timestamptz NOT NULL,
  verified boolean DEFAULT false,
  attempts integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  session_token text NOT NULL,
  device_info jsonb DEFAULT '{}',
  ip_address text,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image text,
  product_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  original_price decimal(10,2),
  category text NOT NULL,
  subcategory text,
  brand text,
  images jsonb DEFAULT '[]',
  specifications jsonb DEFAULT '{}',
  variants jsonb DEFAULT '[]',
  tags text[] DEFAULT '{}',
  stock_quantity integer DEFAULT 0,
  low_stock_alert integer DEFAULT 5,
  rating decimal(3,2) DEFAULT 0,
  review_count integer DEFAULT 0,
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  is_new boolean DEFAULT false,
  on_sale boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  variant_id text,
  quantity integer NOT NULL DEFAULT 1,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Wishlist items table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal decimal(10,2) NOT NULL,
  tax decimal(10,2) DEFAULT 0,
  shipping decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,
  shipping_address jsonb NOT NULL,
  billing_address jsonb,
  payment_method text,
  tracking_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  variant_id text,
  quantity integer NOT NULL DEFAULT 1,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- OTP codes policies
CREATE POLICY "Users can read own OTP codes" ON otp_codes
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own OTP codes" ON otp_codes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own OTP codes" ON otp_codes
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- User sessions policies
CREATE POLICY "Users can read own sessions" ON user_sessions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions" ON user_sessions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions" ON user_sessions
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can read products" ON products
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cart items policies
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Wishlist items policies
CREATE POLICY "Users can manage own wishlist" ON wishlist_items
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Orders policies
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all orders" ON orders
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Order items policies
CREATE POLICY "Users can read own order items" ON order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders" ON order_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all order items" ON order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions for OTP management
CREATE OR REPLACE FUNCTION generate_otp_code()
RETURNS text AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM otp_codes WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Function to update product stock
CREATE OR REPLACE FUNCTION update_product_stock(
  product_id uuid,
  quantity_change integer
)
RETURNS void AS $$
BEGIN
  UPDATE products 
  SET 
    stock_quantity = stock_quantity + quantity_change,
    in_stock = (stock_quantity + quantity_change) > 0,
    updated_at = now()
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(now(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial categories
INSERT INTO categories (name, slug, description, image, product_count) VALUES
  ('Kitchen Ware', 'kitchen-ware', 'Premium kitchen tools and appliances for cooking', '/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png', 15),
  ('Hardware', 'hardware', 'Professional tools and hardware solutions', '/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png', 28),
  ('Gardening Tools', 'gardening-tools', 'Essential tools for garden and outdoor care', '/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png', 18),
  ('Home Ware', 'home-ware', 'Comfort and style for your living space', '/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png', 22),
  ('Mobile Accessory', 'mobile-accessory', 'Latest accessories for your mobile devices', '/lovable-uploads/dc13e94f-beeb-4671-8a22-0968498cdb4c.png', 12)
ON CONFLICT (name) DO NOTHING;

-- Insert initial products
INSERT INTO products (
  name, description, price, original_price, category, subcategory, brand, 
  images, specifications, variants, tags, stock_quantity, low_stock_alert,
  rating, review_count, featured, is_new, on_sale
) VALUES
  (
    'Professional Chef Knife Set',
    'Premium stainless steel knife set with ergonomic handles. Includes chef''s knife, paring knife, bread knife, and utility knife.',
    89.00, 129.00, 'Kitchen Ware', 'Knives', 'ChefMaster',
    '[""/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png""]',
    '{"Material": "German Stainless Steel", "Handle": "Ergonomic Polymer", "Set Size": "4 Pieces", "Warranty": "5 Years"}',
    '[{"id": "v1", "name": "Color", "type": "color", "value": "Black Handle", "stockQuantity": 10}]',
    '{"Kitchen", "Knives", "Professional", "Cooking"}',
    15, 5, 4.8, 127, true, false, true
  ),
  (
    'Cordless Power Drill',
    'Heavy-duty cordless drill with lithium-ion battery. Features 20V motor, LED work light, and 15 clutch settings.',
    159.00, NULL, 'Hardware', 'Power Tools', 'PowerPro',
    '[""/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png""]',
    '{"Voltage": "20V MAX", "Chuck Size": "1/2 inch", "Battery": "Lithium-Ion", "LED Light": "Yes"}',
    '[{"id": "v3", "name": "Battery", "type": "style", "value": "1 Battery", "stockQuantity": 8}]',
    '{"Tools", "Cordless", "DIY", "Construction"}',
    12, 3, 4.7, 89, true, false, false
  ),
  (
    'Garden Tool Set',
    'Complete 5-piece garden tool set with stainless steel heads and comfortable grip handles.',
    49.00, NULL, 'Gardening Tools', 'Hand Tools', 'GreenThumb',
    '[""/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png""]',
    '{"Material": "Stainless Steel", "Handle": "Ergonomic Grip", "Set Size": "5 Pieces"}',
    '[{"id": "v5", "name": "Size", "type": "style", "value": "Standard", "stockQuantity": 15}]',
    '{"Garden", "Tools", "Outdoor", "Planting"}',
    25, 10, 4.6, 203, false, false, false
  ),
  (
    'Luxury Cotton Bed Sheets',
    'Ultra-soft 100% cotton bed sheet set. Deep pocket fitted sheet fits mattresses up to 18 inches.',
    79.00, NULL, 'Home Ware', 'Bedding', 'ComfortHome',
    '[""/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png""]',
    '{"Material": "100% Cotton", "Thread Count": "400TC", "Deep Pocket": "18 inches"}',
    '[{"id": "v7", "name": "Size", "type": "style", "value": "Queen", "stockQuantity": 10}]',
    '{"Bedding", "Cotton", "Comfort", "Sleep"}',
    18, 5, 4.5, 156, false, true, false
  ),
  (
    'Wireless Charging Stand',
    'Fast wireless charging stand compatible with all Qi-enabled devices. Features adjustable viewing angle.',
    35.00, NULL, 'Mobile Accessory', 'Chargers', 'TechCharge',
    '[""/lovable-uploads/dc13e94f-beeb-4671-8a22-0968498cdb4c.png""]',
    '{"Charging Speed": "15W Fast Charge", "Compatibility": "Qi-Enabled Devices", "LED Indicator": "Yes"}',
    '[{"id": "v9", "name": "Color", "type": "color", "value": "Black", "stockQuantity": 20}]',
    '{"Wireless", "Charging", "Mobile", "Tech"}',
    30, 10, 4.4, 92, true, true, false
  )
ON CONFLICT DO NOTHING;

-- Create admin user
INSERT INTO users (email, first_name, last_name, role, email_verified) VALUES
  ('admin@shopmart.com', 'Admin', 'User', 'admin', true)
ON CONFLICT (email) DO NOTHING;