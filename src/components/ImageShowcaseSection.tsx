
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ImageShowcaseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text animation
      gsap.fromTo(textRef.current?.children || [], 
        { 
          opacity: 0, 
          y: 60 
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Card animation with scale and rotation
      gsap.fromTo(cardRef.current,
        {
          opacity: 0,
          scale: 0.7,
          rotationY: 30,
          y: 100
        },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Parallax effect on image
      gsap.to(cardRef.current?.querySelector('img'), {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  return (
    <section ref={sectionRef} className="w-full pt-0 pb-8 sm:pb-12 bg-white" id="showcase">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div ref={textRef} className="max-w-3xl mx-auto text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
            Quality Products for Every Need
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            From kitchen essentials to mobile accessories, discover products that enhance
            your daily life with quality and reliability you can trust.
          </p>
        </div>
        
        <div ref={cardRef} className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant mx-auto max-w-4xl">
          <div className="w-full overflow-hidden">
            <img 
              src="/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png" 
              alt="Quality ShopMart Products Collection" 
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="bg-white p-3 sm:p-4 md:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-display font-semibold mb-2 sm:mb-3 md:mb-4">Quality at Your Fingertips</h3>
            <p className="text-gray-700 text-xs sm:text-sm md:text-base">
              From kitchen essentials to mobile accessories, our comprehensive catalog
              offers quality products for every aspect of your life. Trusted by thousands of customers worldwide
              for reliability, value, and exceptional service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageShowcaseSection;
