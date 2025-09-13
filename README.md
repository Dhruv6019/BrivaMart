# ShopMart - Complete E-commerce Platform with OTP Authentication

## 🚀 Project Overview

ShopMart is a comprehensive e-commerce platform featuring:
- **OTP-based Authentication System** with email/phone verification
- **End-to-End Encryption** for sensitive data protection
- **Complete CRUD Operations** for products, users, and orders
- **Real-time Database Integration** with Supabase
- **Responsive Design** optimized for all devices
- **Admin Dashboard** for product and user management
- **Security Dashboard** for monitoring account activity

## 🔐 Security Features

- **OTP Verification**: 6-digit codes for signup and password reset
- **Password Hashing**: Secure bcrypt-based password storage
- **Session Management**: JWT tokens with expiration
- **Rate Limiting**: Protection against brute force attacks
- **Audit Logging**: Complete activity tracking
- **Data Encryption**: AES encryption for sensitive information
- **CSRF Protection**: Built-in security measures

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/UI** component library
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **GSAP** for animations
- **React Hot Toast** for notifications

### Backend & Database
- **Supabase** for backend services
- **PostgreSQL** database with RLS
- **Real-time subscriptions**
- **Edge Functions** for serverless logic

### Security & Encryption
- **CryptoJS** for client-side encryption
- **bcrypt** for password hashing
- **JWT** for session management
- **Rate limiting** with Redis-like functionality

## 📋 Database Schema

The complete database schema includes:

### Core Tables
- `user_profiles` - Extended user information
- `otp_verifications` - OTP codes and verification status
- `user_sessions` - Active user sessions
- `audit_logs` - Security and activity logging
- `rate_limits` - Rate limiting for security

### E-commerce Tables
- `products` - Product catalog with full specifications
- `categories` - Product categorization
- `cart_items` - Shopping cart functionality
- `wishlist_items` - User wishlists
- `orders` & `order_items` - Order management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

```bash
# Install dependencies
npm i

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ENCRYPTION_KEY=your_encryption_key_32_chars
```

### Database Setup

1. **Connect to Supabase**: Click "Connect to Supabase" in the top right
2. **Run Migrations**: The database schema will be automatically applied
3. **Verify Setup**: Check that all tables are created in your Supabase dashboard

## 🔑 Authentication Flow

### User Registration
1. User fills registration form with email, phone (optional), name, and password
2. System generates 6-digit OTP code
3. OTP sent to user's email (demo shows code in UI)
4. User enters OTP to verify email
5. Account activated and user can sign in

### Password Reset
1. User requests password reset with email
2. System generates OTP for password reset
3. User enters OTP and new password
4. Password updated securely

## 📱 Features

### User Features
- **Secure Registration** with OTP verification
- **Profile Management** with encrypted data storage
- **Shopping Cart** with persistent storage
- **Wishlist** functionality
- **Order History** and tracking
- **Security Dashboard** for session management

### Admin Features
- **Product Management** (Create, Read, Update, Delete)
- **User Management** with role-based access
- **Order Management** and status updates
- **Analytics Dashboard** with key metrics
- **Security Monitoring** and audit logs

## 🔒 Security Implementation

### Data Protection
- All sensitive data encrypted using AES-256
- Passwords hashed with bcrypt (10 rounds)
- Session tokens securely generated and stored
- Rate limiting on all authentication endpoints

### OTP Security
- 6-digit codes with 10-minute expiration
- Maximum 3 attempts per code
- Rate limiting: 5 requests per 15 minutes
- Secure hash storage (never plain text)

### Session Management
- JWT tokens with 30-day expiration
- Device fingerprinting for security
- Session revocation capabilities
- Automatic cleanup of expired sessions

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Dark/Light Mode** support
- **Smooth Animations** with GSAP
- **Loading States** for better UX
- **Error Handling** with user-friendly messages
- **Toast Notifications** for feedback

## 📊 Admin Dashboard

The admin dashboard provides:
- **Product Management**: Add, edit, delete products with Excel import/export
- **Order Management**: View and update order statuses
- **User Analytics**: Track user registrations and activity
- **Security Monitoring**: View audit logs and security events
- **Inventory Management**: Low stock alerts and quantity tracking

## 🔧 API Endpoints

### Authentication
- `POST /auth/signup` - User registration with OTP
- `POST /auth/verify-otp` - OTP verification
- `POST /auth/signin` - User login
- `POST /auth/signout` - User logout
- `POST /auth/reset-password` - Password reset request
- `PUT /auth/update-password` - Update password with OTP

### Products
- `GET /products` - List products with filters
- `GET /products/:id` - Get single product
- `POST /products` - Create product (Admin)
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)

### User Management
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `DELETE /profile` - Delete user account
- `GET /sessions` - Get user sessions
- `DELETE /sessions/:id` - Revoke session

## 🧪 Testing

### Demo Accounts
- **Admin**: admin@shopmart.com / admin123
- **User**: Create new account with OTP verification

### Test OTP Flow
1. Register new account
2. OTP code displayed in UI (demo mode)
3. Enter code to verify email
4. Complete registration process

## 🚀 Deployment

### Production Checklist
- [ ] Set secure encryption keys
- [ ] Configure email/SMS providers for OTP
- [ ] Set up SSL certificates
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Run security audit
- [ ] Test all authentication flows

### Environment Variables
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_ENCRYPTION_KEY=secure_32_character_key
```

## 📝 Development Notes

### Code Structure
- `/src/services/` - API service layers
- `/src/contexts/` - React context providers
- `/src/hooks/` - Custom React hooks
- `/src/lib/` - Utility functions and configurations
- `/src/pages/` - Page components
- `/src/components/` - Reusable UI components
- `/supabase/migrations/` - Database migrations

### Key Components
- `AuthContext` - Global authentication state
- `AuthService` - Authentication API calls
- `EncryptionService` - Data encryption utilities
- `ProductService` - Product CRUD operations
- `ProtectedRoute` - Route protection wrapper

## 🐛 Troubleshooting

### Common Issues
1. **Supabase Connection**: Ensure environment variables are set correctly
2. **OTP Not Working**: Check database migrations are applied
3. **Encryption Errors**: Verify encryption key is 32 characters
4. **Rate Limiting**: Clear rate limit records if testing frequently

### Debug Mode
Set `NODE_ENV=development` to see detailed error messages and logs.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the audit logs in the Security Dashboard
3. Check browser console for detailed error messages

## 📄 License

This project is built for demonstration purposes. Modify and use as needed for your projects.

---

**Built with ❤️ using React, TypeScript, Supabase, and modern web technologies.**