'use client';

import React, { useEffect } from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Collection from "../components/Collection";
import Mission from "../components/Mission";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import "../styles/globals.css";

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.animate-section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="animate-section">
        <Hero />
      </div>
      <div className="animate-section">
        <Collection />
      </div>
      <div className="animate-section">
        <About />
      </div>
      <div className="animate-section">
        <Mission />
      </div>
      <div className="animate-section">
        <Testimonials />
      </div>
      <div className="animate-section">
        <FAQ />
      </div>
      
      <style jsx global>{`
        .animate-section {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease-out;
        }
        
        .animate-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        @media (max-width: 768px) {
          .animate-section {
            transform: translateY(20px);
            transition: all 0.4s ease-out;
          }
        }
        
        @media (max-width: 480px) {
          .animate-section {
            transform: translateY(15px);
            transition: all 0.3s ease-out;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-section {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </>
  );
}