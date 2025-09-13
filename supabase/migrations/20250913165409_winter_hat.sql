-- =====================================================
-- SHOPMART E-COMMERCE DATABASE SCHEMA
-- Complete MySQL Database Schema for OTP Authentication System
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS shopmart_db;
USE shopmart_db;

-- =====================================================
-- AUTHENTICATION & USER MANAGEMENT TABLES
-- =====================================================

-- Users table (main authentication table)
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('user', 'admin', 'moderator') DEFAULT 'user',
    avatar_url TEXT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    encrypted_data JSON NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
);

-- OTP verification codes table
CREATE TABLE otp_verifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    code_hash VARCHAR(255) NOT NULL,
    type ENUM('email_signup', 'phone_signup', 'password_reset', 'login_verification') NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_expires_at (expires_at),
    INDEX idx_type (type)
);

-- User sessions table
CREATE TABLE user_sessions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    device_info JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_expires_at (expires_at),
    INDEX idx_last_activity (last_activity)
);

-- Security audit logs table
CREATE TABLE audit_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    details JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    success BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource),
    INDEX idx_created_at (created_at),
    INDEX idx_success (success)
);

-- Rate limiting table
CREATE TABLE rate_limits (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    identifier VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,
    attempts INT DEFAULT 1,
    window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    blocked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_identifier_action (identifier, action),
    INDEX idx_identifier (identifier),
    INDEX idx_action (action),
    INDEX idx_window_start (window_start),
    INDEX idx_blocked_until (blocked_until)
);

-- =====================================================
-- PRODUCT MANAGEMENT TABLES
-- =====================================================

-- Categories table
CREATE TABLE categories (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NULL,
    image_url TEXT NULL,
    product_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_slug (slug)
);

-- Products table
CREATE TABLE products (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2) NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100) NULL,
    brand VARCHAR(100) NULL,
    images JSON NULL,
    specifications JSON NULL,
    variants JSON NULL,
    tags JSON NULL,
    stock_quantity INT DEFAULT 0,
    low_stock_alert INT DEFAULT 5,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    on_sale BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_category (category),
    INDEX idx_brand (brand),
    INDEX idx_price (price),
    INDEX idx_stock_quantity (stock_quantity),
    INDEX idx_rating (rating),
    INDEX idx_featured (featured),
    INDEX idx_is_new (is_new),
    INDEX idx_on_sale (on_sale),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_search (name, description)
);

-- =====================================================
-- SHOPPING CART & WISHLIST TABLES
-- =====================================================

-- Cart items table
CREATE TABLE cart_items (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    variant_id VARCHAR(100) NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product_variant (user_id, product_id, variant_id),
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id)
);

-- Wishlist items table
CREATE TABLE wishlist_items (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id)
);

-- =====================================================
-- ORDER MANAGEMENT TABLES
-- =====================================================

-- Orders table
CREATE TABLE orders (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0.00,
    shipping DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    shipping_address JSON NOT NULL,
    billing_address JSON NULL,
    payment_method VARCHAR(50) NULL,
    tracking_number VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Order items table
CREATE TABLE order_items (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    order_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    variant_id VARCHAR(100) NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);

-- =====================================================
-- REVIEW & RATING TABLES
-- =====================================================

-- Product reviews table
CREATE TABLE product_reviews (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    order_id CHAR(36) NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NULL,
    comment TEXT NULL,
    images JSON NULL,
    verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_product_order (user_id, product_id, order_id),
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- STORED PROCEDURES & FUNCTIONS
-- =====================================================

DELIMITER //

-- Generate OTP code
CREATE FUNCTION generate_otp_code()
RETURNS VARCHAR(6)
READS SQL DATA
DETERMINISTIC
BEGIN
    RETURN LPAD(FLOOR(RAND() * 1000000), 6, '0');
END //

-- Check rate limit
CREATE FUNCTION check_rate_limit(
    p_identifier VARCHAR(255),
    p_action VARCHAR(50),
    p_max_attempts INT,
    p_window_minutes INT
)
RETURNS BOOLEAN
READS SQL DATA
MODIFIES SQL DATA
BEGIN
    DECLARE current_attempts INT DEFAULT 0;
    DECLARE window_start TIMESTAMP;
    DECLARE is_blocked BOOLEAN DEFAULT FALSE;
    
    -- Clean up old rate limit records
    DELETE FROM rate_limits 
    WHERE window_start < DATE_SUB(NOW(), INTERVAL 1 HOUR);
    
    -- Get current attempts
    SELECT attempts, rate_limits.window_start 
    INTO current_attempts, window_start
    FROM rate_limits 
    WHERE identifier = p_identifier 
      AND action = p_action 
      AND window_start > DATE_SUB(NOW(), INTERVAL p_window_minutes MINUTE)
    LIMIT 1;
    
    -- If no record exists, create one
    IF current_attempts IS NULL THEN
        INSERT INTO rate_limits (identifier, action, attempts, window_start)
        VALUES (p_identifier, p_action, 1, NOW())
        ON DUPLICATE KEY UPDATE 
            attempts = 1, 
            window_start = NOW(),
            blocked_until = NULL;
        RETURN TRUE;
    END IF;
    
    -- Check if blocked
    IF current_attempts >= p_max_attempts THEN
        UPDATE rate_limits 
        SET blocked_until = DATE_ADD(NOW(), INTERVAL p_window_minutes MINUTE)
        WHERE identifier = p_identifier AND action = p_action;
        RETURN FALSE;
    END IF;
    
    -- Increment attempts
    UPDATE rate_limits 
    SET attempts = attempts + 1
    WHERE identifier = p_identifier AND action = p_action;
    
    RETURN TRUE;
END //

-- Create OTP verification
CREATE PROCEDURE create_otp_verification(
    IN p_user_id CHAR(36),
    IN p_email VARCHAR(255),
    IN p_phone VARCHAR(20),
    IN p_type VARCHAR(50),
    OUT p_success BOOLEAN,
    OUT p_verification_id CHAR(36),
    OUT p_otp_code VARCHAR(6),
    OUT p_error_message TEXT
)
BEGIN
    DECLARE otp_code VARCHAR(6);
    DECLARE code_hash VARCHAR(255);
    DECLARE identifier VARCHAR(255);
    DECLARE rate_limit_ok BOOLEAN;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_success = FALSE;
        SET p_error_message = 'Database error occurred';
    END;
    
    START TRANSACTION;
    
    -- Determine identifier for rate limiting
    SET identifier = COALESCE(p_email, p_phone);
    
    -- Check rate limit
    SET rate_limit_ok = check_rate_limit(identifier, 'otp_request', 5, 15);
    
    IF NOT rate_limit_ok THEN
        SET p_success = FALSE;
        SET p_error_message = 'Too many OTP requests. Please try again later.';
        ROLLBACK;
    ELSE
        -- Generate OTP code
        SET otp_code = generate_otp_code();
        SET code_hash = SHA2(CONCAT(otp_code, 'salt'), 256);
        SET p_verification_id = UUID();
        
        -- Invalidate existing OTP codes for this user and type
        UPDATE otp_verifications 
        SET verified = TRUE 
        WHERE user_id = p_user_id AND type = p_type AND verified = FALSE;
        
        -- Insert new OTP verification
        INSERT INTO otp_verifications (
            id, user_id, email, phone, code_hash, type, expires_at
        ) VALUES (
            p_verification_id, p_user_id, p_email, p_phone, code_hash, p_type, 
            DATE_ADD(NOW(), INTERVAL 10 MINUTE)
        );
        
        -- Log the action
        INSERT INTO audit_logs (user_id, action, resource, details)
        VALUES (p_user_id, 'otp_generated', 'otp_verifications', 
            JSON_OBJECT('type', p_type, 'verification_id', p_verification_id));
        
        SET p_success = TRUE;
        SET p_otp_code = otp_code;
        
        COMMIT;
    END IF;
END //

-- Verify OTP code
CREATE PROCEDURE verify_otp_code(
    IN p_verification_id CHAR(36),
    IN p_code VARCHAR(6),
    OUT p_success BOOLEAN,
    OUT p_error_message TEXT
)
BEGIN
    DECLARE v_user_id CHAR(36);
    DECLARE v_code_hash VARCHAR(255);
    DECLARE v_type VARCHAR(50);
    DECLARE v_expires_at TIMESTAMP;
    DECLARE v_attempts INT;
    DECLARE v_max_attempts INT;
    DECLARE computed_hash VARCHAR(255);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_success = FALSE;
        SET p_error_message = 'Database error occurred';
    END;
    
    START TRANSACTION;
    
    -- Get verification record
    SELECT user_id, code_hash, type, expires_at, attempts, max_attempts
    INTO v_user_id, v_code_hash, v_type, v_expires_at, v_attempts, v_max_attempts
    FROM otp_verifications
    WHERE id = p_verification_id AND verified = FALSE;
    
    -- Check if verification exists
    IF v_user_id IS NULL THEN
        SET p_success = FALSE;
        SET p_error_message = 'Invalid or expired verification code';
        ROLLBACK;
    ELSEIF v_expires_at < NOW() THEN
        SET p_success = FALSE;
        SET p_error_message = 'Verification code has expired';
        ROLLBACK;
    ELSEIF v_attempts >= v_max_attempts THEN
        SET p_success = FALSE;
        SET p_error_message = 'Maximum verification attempts exceeded';
        ROLLBACK;
    ELSE
        -- Verify the code
        SET computed_hash = SHA2(CONCAT(p_code, 'salt'), 256);
        
        -- Update attempts
        UPDATE otp_verifications 
        SET attempts = attempts + 1
        WHERE id = p_verification_id;
        
        IF computed_hash = v_code_hash THEN
            -- Mark as verified
            UPDATE otp_verifications 
            SET verified = TRUE
            WHERE id = p_verification_id;
            
            -- Update user verification status
            IF v_type = 'email_signup' THEN
                UPDATE users 
                SET email_verified = TRUE, updated_at = NOW()
                WHERE id = v_user_id;
            ELSEIF v_type = 'phone_signup' THEN
                UPDATE users 
                SET phone_verified = TRUE, updated_at = NOW()
                WHERE id = v_user_id;
            END IF;
            
            -- Log successful verification
            INSERT INTO audit_logs (user_id, action, resource, details, success)
            VALUES (v_user_id, 'otp_verified', 'otp_verifications', 
                JSON_OBJECT('type', v_type), TRUE);
            
            SET p_success = TRUE;
            SET p_error_message = 'Verification successful';
        ELSE
            -- Log failed verification
            INSERT INTO audit_logs (user_id, action, resource, details, success)
            VALUES (v_user_id, 'otp_verification_failed', 'otp_verifications', 
                JSON_OBJECT('type', v_type, 'attempts', v_attempts + 1), FALSE);
            
            SET p_success = FALSE;
            SET p_error_message = 'Invalid verification code';
        END IF;
        
        COMMIT;
    END IF;
END //

-- Cleanup expired data
CREATE PROCEDURE cleanup_expired_data()
BEGIN
    -- Clean expired OTP codes
    DELETE FROM otp_verifications WHERE expires_at < NOW();
    
    -- Clean expired sessions
    DELETE FROM user_sessions WHERE expires_at < NOW();
    
    -- Clean old audit logs (keep last 90 days)
    DELETE FROM audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
    
    -- Clean old rate limits
    DELETE FROM rate_limits WHERE window_start < DATE_SUB(NOW(), INTERVAL 1 HOUR);
END //

DELIMITER ;

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert categories
INSERT INTO categories (name, slug, description, image_url, product_count) VALUES
('Kitchen Ware', 'kitchen-ware', 'Premium kitchen tools and appliances for cooking', '/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png', 15),
('Hardware', 'hardware', 'Professional tools and hardware solutions', '/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png', 28),
('Gardening Tools', 'gardening-tools', 'Essential tools for garden and outdoor care', '/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png', 18),
('Home Ware', 'home-ware', 'Comfort and style for your living space', '/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png', 22),
('Mobile Accessory', 'mobile-accessory', 'Latest accessories for your mobile devices', '/lovable-uploads/dc13e94f-beeb-4671-8a22-0968498cdb4c.png', 12);

-- Insert sample products
INSERT INTO products (
    name, description, price, original_price, category, subcategory, brand, 
    images, specifications, variants, tags, stock_quantity, low_stock_alert,
    rating, review_count, featured, is_new, on_sale
) VALUES
(
    'Professional Chef Knife Set',
    'Premium stainless steel knife set with ergonomic handles. Includes chef knife, paring knife, bread knife, and utility knife.',
    89.00, 129.00, 'Kitchen Ware', 'Knives', 'ChefMaster',
    JSON_ARRAY('/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png'),
    JSON_OBJECT('Material', 'German Stainless Steel', 'Handle', 'Ergonomic Polymer', 'Set Size', '4 Pieces', 'Warranty', '5 Years'),
    JSON_ARRAY(JSON_OBJECT('id', 'v1', 'name', 'Color', 'type', 'color', 'value', 'Black Handle', 'stockQuantity', 10)),
    JSON_ARRAY('Kitchen', 'Knives', 'Professional', 'Cooking'),
    15, 5, 4.8, 127, TRUE, FALSE, TRUE
),
(
    'Cordless Power Drill',
    'Heavy-duty cordless drill with lithium-ion battery. Features 20V motor, LED work light, and 15 clutch settings.',
    159.00, NULL, 'Hardware', 'Power Tools', 'PowerPro',
    JSON_ARRAY('/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png'),
    JSON_OBJECT('Voltage', '20V MAX', 'Chuck Size', '1/2 inch', 'Battery', 'Lithium-Ion', 'LED Light', 'Yes'),
    JSON_ARRAY(JSON_OBJECT('id', 'v3', 'name', 'Battery', 'type', 'style', 'value', '1 Battery', 'stockQuantity', 8)),
    JSON_ARRAY('Tools', 'Cordless', 'DIY', 'Construction'),
    12, 3, 4.7, 89, TRUE, FALSE, FALSE
),
(
    'Garden Tool Set',
    'Complete 5-piece garden tool set with stainless steel heads and comfortable grip handles.',
    49.00, NULL, 'Gardening Tools', 'Hand Tools', 'GreenThumb',
    JSON_ARRAY('/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png'),
    JSON_OBJECT('Material', 'Stainless Steel', 'Handle', 'Ergonomic Grip', 'Set Size', '5 Pieces'),
    JSON_ARRAY(JSON_OBJECT('id', 'v5', 'name', 'Size', 'type', 'style', 'value', 'Standard', 'stockQuantity', 15)),
    JSON_ARRAY('Garden', 'Tools', 'Outdoor', 'Planting'),
    25, 10, 4.6, 203, FALSE, FALSE, FALSE
),
(
    'Luxury Cotton Bed Sheets',
    'Ultra-soft 100% cotton bed sheet set. Deep pocket fitted sheet fits mattresses up to 18 inches.',
    79.00, NULL, 'Home Ware', 'Bedding', 'ComfortHome',
    JSON_ARRAY('/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png'),
    JSON_OBJECT('Material', '100% Cotton', 'Thread Count', '400TC', 'Deep Pocket', '18 inches'),
    JSON_ARRAY(JSON_OBJECT('id', 'v7', 'name', 'Size', 'type', 'style', 'value', 'Queen', 'stockQuantity', 10)),
    JSON_ARRAY('Bedding', 'Cotton', 'Comfort', 'Sleep'),
    18, 5, 4.5, 156, FALSE, TRUE, FALSE
),
(
    'Wireless Charging Stand',
    'Fast wireless charging stand compatible with all Qi-enabled devices. Features adjustable viewing angle.',
    35.00, NULL, 'Mobile Accessory', 'Chargers', 'TechCharge',
    JSON_ARRAY('/lovable-uploads/dc13e94f-beeb-4671-8a22-0968498cdb4c.png'),
    JSON_OBJECT('Charging Speed', '15W Fast Charge', 'Compatibility', 'Qi-Enabled Devices', 'LED Indicator', 'Yes'),
    JSON_ARRAY(JSON_OBJECT('id', 'v9', 'name', 'Color', 'type', 'color', 'value', 'Black', 'stockQuantity', 20)),
    JSON_ARRAY('Wireless', 'Charging', 'Mobile', 'Tech'),
    30, 10, 4.4, 92, TRUE, TRUE, FALSE
);

-- Insert admin user
INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified) VALUES
('admin@shopmart.com', SHA2('admin123', 256), 'Admin', 'User', 'admin', TRUE);

-- =====================================================
-- TRIGGERS FOR DATA INTEGRITY
-- =====================================================

DELIMITER //

-- Update product rating when review is added
CREATE TRIGGER update_product_rating_after_review_insert
AFTER INSERT ON product_reviews
FOR EACH ROW
BEGIN
    UPDATE products 
    SET 
        rating = (
            SELECT AVG(rating) 
            FROM product_reviews 
            WHERE product_id = NEW.product_id
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM product_reviews 
            WHERE product_id = NEW.product_id
        ),
        updated_at = NOW()
    WHERE id = NEW.product_id;
END //

-- Update product rating when review is updated
CREATE TRIGGER update_product_rating_after_review_update
AFTER UPDATE ON product_reviews
FOR EACH ROW
BEGIN
    UPDATE products 
    SET 
        rating = (
            SELECT AVG(rating) 
            FROM product_reviews 
            WHERE product_id = NEW.product_id
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM product_reviews 
            WHERE product_id = NEW.product_id
        ),
        updated_at = NOW()
    WHERE id = NEW.product_id;
END //

-- Update product rating when review is deleted
CREATE TRIGGER update_product_rating_after_review_delete
AFTER DELETE ON product_reviews
FOR EACH ROW
BEGIN
    UPDATE products 
    SET 
        rating = COALESCE((
            SELECT AVG(rating) 
            FROM product_reviews 
            WHERE product_id = OLD.product_id
        ), 0),
        review_count = (
            SELECT COUNT(*) 
            FROM product_reviews 
            WHERE product_id = OLD.product_id
        ),
        updated_at = NOW()
    WHERE id = OLD.product_id;
END //

DELIMITER ;

-- =====================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================

-- Additional indexes for better query performance
CREATE INDEX idx_products_category_featured ON products(category, featured);
CREATE INDEX idx_products_price_range ON products(price, in_stock);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_cart_items_user_created ON cart_items(user_id, created_at);
CREATE INDEX idx_wishlist_user_created ON wishlist_items(user_id, created_at);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- User profile view with decrypted data
CREATE VIEW user_profiles_view AS
SELECT 
    u.id,
    u.email,
    u.phone,
    u.first_name,
    u.last_name,
    u.role,
    u.avatar_url,
    u.email_verified,
    u.phone_verified,
    u.last_login,
    u.created_at,
    u.updated_at,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(o.total), 0) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;

-- Product summary view
CREATE VIEW product_summary_view AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    CASE 
        WHEN p.stock_quantity <= p.low_stock_alert THEN 'low'
        WHEN p.stock_quantity = 0 THEN 'out'
        ELSE 'in_stock'
    END as stock_status
FROM products p
LEFT JOIN categories c ON p.category = c.name;

-- =====================================================
-- SECURITY PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure to clean up user data (GDPR compliance)
CREATE PROCEDURE cleanup_user_data(IN p_user_id CHAR(36))
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;
    
    START TRANSACTION;
    
    -- Log the cleanup action
    INSERT INTO audit_logs (user_id, action, resource, details)
    VALUES (p_user_id, 'account_deleted', 'users', JSON_OBJECT('user_id', p_user_id));
    
    -- Delete user data (foreign key constraints will handle cascading)
    DELETE FROM users WHERE id = p_user_id;
    
    COMMIT;
END //

DELIMITER ;

-- =====================================================
-- SCHEDULED EVENTS FOR MAINTENANCE
-- =====================================================

-- Enable event scheduler
SET GLOBAL event_scheduler = ON;

-- Create event to cleanup expired data every hour
CREATE EVENT IF NOT EXISTS cleanup_expired_data_event
ON SCHEDULE EVERY 1 HOUR
DO
  CALL cleanup_expired_data();

-- =====================================================
-- FINAL SETUP COMMANDS
-- =====================================================

-- Grant appropriate permissions (adjust as needed for your environment)
-- CREATE USER 'shopmart_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON shopmart_db.* TO 'shopmart_app'@'localhost';
-- GRANT EXECUTE ON shopmart_db.* TO 'shopmart_app'@'localhost';
-- FLUSH PRIVILEGES;

-- Show table structure for verification
SHOW TABLES;