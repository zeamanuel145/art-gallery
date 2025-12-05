'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';

const SocialIcon = ({ name }: { name: "twitter" | "instagram" | "facebook" }) => {
  const commonProps = { width: 18, height: 18, "aria-hidden": true } as const;

  if (name === "twitter") {
    return (
      <svg {...commonProps} viewBox="0 0 24 24" fill="none" style={{color: '#f9efe8', display: 'block'}}>
        <path d="M22 5.92c-.64.28-1.33.47-2.05.55a3.56 3.56 0 001.56-1.98 7.1 7.1 0 01-2.26.86 3.52 3.52 0 00-6 3.21A10 10 0 013 5.77a3.52 3.52 0 001.09 4.7 3.45 3.45 0 01-1.6-.44v.04a3.52 3.52 0 002.82 3.45c-.46.12-.95.14-1.45.05a3.53 3.53 0 003.29 2.44A7.06 7.06 0 012 19.54a10 10 0 005.41 1.59c6.49 0 10.04-5.37 10.04-10.03v-.46A7.04 7.04 0 0022 5.92z" fill="currentColor"/>
      </svg>
    );
  }
  if (name === "instagram") {
    return (
      <svg {...commonProps} viewBox="0 0 24 24" fill="none" style={{color: '#f9efe8', display: 'block'}}>
        <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return (
    <svg {...commonProps} viewBox="0 0 24 24" fill="none" style={{color: '#f9efe8', display: 'block'}}>
      <path d="M22 2.01H2v20h10v-8H9v-4h3V8.5c0-3.1 1.9-4.8 4.7-4.8 1.3 0 2.6.1 2.9.15v3.2h-1.9c-1.5 0-1.8.7-1.8 1.7V10h3.5l-.5 4h-3v8h6.1V2.01z" fill="currentColor"/>
    </svg>
  );
};

const Footer: React.FC = () => {
  const pathname = usePathname();
  
  // Don't show footer on dashboard pages only
  const isDashboardPage = pathname?.startsWith('/dashboard') || 
                         pathname?.startsWith('/my-artworks') || 
                         pathname?.startsWith('/profile') || 
                         pathname?.startsWith('/purchases') || 
                         pathname?.startsWith('/sales') || 
                         pathname?.startsWith('/settings') || 
                         pathname?.startsWith('/upload-artwork');
  
  // New Arrivals should show footer (it's a public page)
  
  if (isDashboardPage) {
    return null;
  }
  
  return (
    <>
      <footer style={{backgroundColor: '#a65b2b', color: '#f9efe8'}} className="border-t-2 border-amber-600" role="contentinfo" aria-label="Site footer">
      {/* Main Footer Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '5px', paddingBottom: '60px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 lg:gap-12" style={{ marginTop: '20px' }}>
          
          {/* Logo & Brand - Takes 2 columns on XL screens */}
          <div className="xl:col-span-2 flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center md:justify-start">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 p-1 flex-shrink-0">
                <Image
                  src="/assets/logo.png"
                  alt="BRANA Arts Logo"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover rounded-full bg-white"
                />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-white/90 text-center md:text-left max-w-sm">
              Your digital bridge to Ethiopian traditional arts. Connecting artists with art enthusiasts worldwide.
            </p>
          </div>

          {/* Contact Section */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold mb-4 sm:mb-6" style={{fontFamily: '"Playfair Display", serif'}}>Contact</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-sm flex-shrink-0 w-4">✉</span>
                <span className="text-xs sm:text-sm ml-3">contact@branaarts.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-sm flex-shrink-0 w-4">📞</span>
                <span className="text-xs sm:text-sm ml-3">+1 (234) 567-890</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-sm flex-shrink-0 w-4">📍</span>
                <span className="text-xs sm:text-sm ml-3">123 Art Street, Addis Ababa</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold mb-4 sm:mb-6" style={{fontFamily: '"Playfair Display", serif'}}>Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link href="/" className="text-xs sm:text-sm hover:text-white/80 transition-colors">Home</Link></li>
              <li><Link href="/collections" className="text-xs sm:text-sm hover:text-white/80 transition-colors">Our Collections</Link></li>
              <li><Link href="/about" className="text-xs sm:text-sm hover:text-white/80 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-xs sm:text-sm hover:text-white/80 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold mb-4 sm:mb-6" style={{fontFamily: '"Playfair Display", serif'}}>Support & Resources</h3>
            <ul className="space-y-2 sm:space-y-3 mb-6">
              <li><Link href="/faq" className="text-xs sm:text-sm hover:text-white/80 transition-colors">FAQs</Link></li>
              <li><Link href="/privacy" className="text-xs sm:text-sm hover:text-white/80 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-xs sm:text-sm hover:text-white/80 transition-colors">Terms & Conditions</Link></li>
            </ul>
            
            {/* Social Media */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Follow Us</h4>
              <div className="flex gap-3 justify-center md:justify-start">
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform" aria-label="Facebook">
                  <SocialIcon name="facebook" />
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform" aria-label="Twitter">
                  <SocialIcon name="twitter" />
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform" aria-label="Instagram">
                  <SocialIcon name="instagram" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/20 py-4 sm:py-6">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs sm:text-sm text-white/80">
            ©{new Date().getFullYear()} BRANA Arts. All Rights Reserved.
          </p>
        </div>
      </div>
      </footer>
      
      <style jsx global>{`
        footer {
          background-color: #a65b2b !important;
          color: #f9efe8 !important;
          padding: 32px 20px !important;
          min-height: auto !important;
        }
        
        footer .max-w-full {
          max-width: 1200px !important;
          margin: 0 auto !important;
        }
        
        footer .grid {
          display: grid !important;
          grid-template-columns: repeat(1, 1fr) !important;
          justify-items: center !important;
        }
        
        @media (min-width: 768px) {
          footer .grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (min-width: 1024px) {
          footer .grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        
        @media (min-width: 1280px) {
          footer .grid {
            grid-template-columns: repeat(5, 1fr) !important;
          }
        }
        
        footer * {
          color: #f9efe8 !important;
        }
        
        footer h3, footer h4 {
          color: #f9efe8 !important;
          font-family: "Playfair Display", serif !important;
        }
        
        footer a {
          color: #f9efe8 !important;
          text-decoration: none !important;
        }
        
        footer a:hover {
          color: rgba(249, 239, 232, 0.8) !important;
        }
        
        footer p {
          color: #f9efe8 !important;
        }
        
        footer .border-t {
          border-top: 1px solid rgba(255, 255, 255, 0.2) !important;
        }
      `}</style>
    </>
  );
};

export default Footer;