
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">ShopMart</h3>
            <p className="text-muted-foreground text-sm">Your trusted partner for quality kitchen ware, hardware, gardening tools, home essentials, and mobile accessories.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link to="/products" className="block text-muted-foreground hover:text-foreground">Products</Link>
              <Link to="/categories" className="block text-muted-foreground hover:text-foreground">Categories</Link>
              <Link to="/about" className="block text-muted-foreground hover:text-foreground">About Us</Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-foreground">Contact</Link>
              <Link to="/wishlist" className="block text-muted-foreground hover:text-foreground">Wishlist</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">Kitchen Ware</p>
              <p className="text-muted-foreground">Hardware</p>
              <p className="text-muted-foreground">Gardening Tools</p>
              <p className="text-muted-foreground">Home Ware</p>
              <p className="text-muted-foreground">Mobile Accessory</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">Customer Service</p>
              <p className="text-muted-foreground">Shipping Info</p>
              <p className="text-muted-foreground">Returns</p>
              <p className="text-muted-foreground">FAQs</p>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 ShopMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
