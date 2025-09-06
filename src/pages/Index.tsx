
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoriesSection from "@/components/CategoriesSection";
import Features from "@/components/Features";
import ImageShowcaseSection from "@/components/ImageShowcaseSection";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { CartProvider } from "../contexts/CartContext";

const Index = () => {
  // GSAP-powered smooth scroll setup
  useEffect(() => {
    // Smooth scroll is now handled by GSAP ScrollTrigger
  }, []);

  useEffect(() => {
    // This helps ensure smooth scrolling for the anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href')?.substring(1);
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        // Increased offset to account for mobile nav
        const offset = window.innerWidth < 768 ? 100 : 80;
        
        window.scrollTo({
          top: targetElement.offsetTop - offset,
          behavior: 'smooth'
        });
      });
    });
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="space-y-4 sm:space-y-8">
          <Hero />
          <FeaturedProducts />
          <CategoriesSection />
          <Features />
          <ImageShowcaseSection />
          <Testimonials />
          <Newsletter />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default Index;
