'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "./Navbar";
import "../styles/globals.css";

const Hero: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    '/assets/pot2.jpg',
    '/assets/hero2.jpg', 
    '/assets/hero3.jpg',
    '/assets/hero4.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <header className="hero relative overflow-hidden w-full" role="banner">
      {/* Sliding Background Images */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Ethiopian art ${index + 1}`}
              width={1920}
              height={1080}
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              priority={index === 0}
              quality={90}
            />
          </div>
        ))}
      </div>

      {/* Navbar positioned over the hero */}
      <Navbar />

      {/* Overlay + content */}
      <div className="hero-overlay" />

      <div className="hero-content px-4 sm:px-6 lg:px-8 mt-12 sm:mt-8 md:mt-0 relative z-30 w-full max-w-4xl mx-auto">
        <h1 className="hero-title text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4 md:mb-6 leading-tight text-center animate-fadeInUp">
          Discover the Soul of Ethiopia
        </h1>
        <p className="hero-sub text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 max-w-xs xs:max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-2 sm:px-4 md:px-0 text-center leading-relaxed animate-slideInLeft">
          Your gateway to the rich tapestry of Ethiopian culture. Explore, buy, and sell unique traditional arts, paintings, and crafts.
        </p>

        <div className="text-center">
          <a className="cta inline-block px-3 xs:px-4 sm:px-6 lg:px-8 py-2 xs:py-2 sm:py-3 lg:py-4 text-xs xs:text-sm sm:text-base lg:text-lg animate-slideInRight" href="/collections">
            Explore Collection
          </a>
        </div>
      </div>
      
      <style jsx global>{`
        /* Force hamburger button to be visible on mobile in hero section */
        @media (max-width: 767px) {
          .hero .navbar button {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            color: white !important;
          }
          
          .hero .navbar button span {
            background-color: white !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Hero;