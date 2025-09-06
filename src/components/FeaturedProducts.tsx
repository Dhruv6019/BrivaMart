import React, { useEffect, useRef } from 'react';
import { products } from '../data/mockData';
import ProductGrid from './ProductGrid';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FeaturedProducts = () => {
  const featuredProducts = products.filter(product => product.featured);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current?.children || [], 
        { 
          opacity: 0, 
          y: 50 
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Grid animation
      gsap.fromTo(".product-card",
        {
          opacity: 0,
          y: 60,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white" id="featured-products">
      <div className="section-container">
        <div ref={headerRef} className="text-center mb-10 sm:mb-16">
          <div className="pulse-chip mx-auto mb-3 sm:mb-4">
            <span>Featured Products</span>
          </div>
          <h2 className="section-title mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl">
            Best Selling <br className="hidden sm:block" />Products
          </h2>
          <p className="section-subtitle mx-auto text-base sm:text-lg">
            Discover our most popular products across kitchen, hardware, gardening, home, and mobile categories.
          </p>
        </div>
        
        <div ref={gridRef}>
          <ProductGrid products={featuredProducts} />
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;