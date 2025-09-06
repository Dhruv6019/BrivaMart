import React, { useEffect, useRef } from 'react';
import { categories } from '../data/mockData';
import CategoryCard from './CategoryCard';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CategoriesSection = () => {
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

      // Category cards animation with rotation effect
      gsap.fromTo(".category-card",
        {
          opacity: 0,
          y: 80,
          rotationY: 45,
          scale: 0.7
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.2,
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
    <section ref={sectionRef} className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50" id="categories">
      <div className="section-container">
        <div ref={headerRef} className="text-center mb-10 sm:mb-16">
          <div className="pulse-chip mx-auto mb-3 sm:mb-4">
            <span>Categories</span>
          </div>
          <h2 className="section-title mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl">
            Shop by <br className="hidden sm:block" />Category
          </h2>
          <p className="section-subtitle mx-auto text-base sm:text-lg">
            From kitchen essentials to mobile accessories, find everything you need for your home and lifestyle.
          </p>
        </div>
        
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={(cat) => {
                // TODO: Navigate to category page
                console.log('Navigate to category:', cat.slug);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;