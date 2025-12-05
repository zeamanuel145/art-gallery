'use client';

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { api, User } from '../../lib/api';
import ThemeToggle from "../../components/ThemeToggle";
import "../../styles/globals.css";

const categories = [
  {
    name: "Traditional Paintings",
    images: [
      "/assets/paint1.jpg",
      "/assets/paint2.jpg",
      "/assets/paint3.jpg",
      "/assets/paint4.jpg"
    ]
  },
  {
    name: "Pottery & Ceramics", 
    images: [
      "/assets/pot1.jpg",
      "/assets/pot2.jpg",
      "/assets/pot3.jpg",
      "/assets/pot4.jpg"
    ]
  },
  {
    name: "Traditional Textiles",
    images: [
      "/assets/tibeb1.jpg",
      "/assets/tibeb2.jpg",
      "/assets/tibeb3.jpg",
      "/assets/tibeb.jpg"
    ]
  },
  {
    name: "Handwoven Crafts",
    images: [
      "/assets/basketery1.jpg",
      "/assets/basketery3.jpg",
      "/assets/basketery4.jpg",
      "/assets/about us.jpg"
    ]
  }
];

export default function CollectionsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile().then(setUser).catch(() => {});
    }
  }, []);
  
  return (
    <>
      <Head>
        <title>Our Collections — BRANA Arts</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <header style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "#fbfaf8" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <Image src="/assets/logo.png" alt="BRANA Arts" width={60} height={60} priority className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 rounded-full object-cover" />
          </div>

          <nav className="nav-links hidden md:flex" style={{ gap: 16, alignItems: "center", fontSize: 15, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/collections" className="nav-link active">Our Collections</Link>
            <Link href="/new-arrivals" className="nav-link">New Arrivals</Link>
            <Link href="/about" className="nav-link">About Us</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </nav>

          <div className="hidden md:flex" style={{ gap: "8px", alignItems: "center" }}>
            <ThemeToggle />
            {user ? (
              <>
                <Link href="/dashboard" className="auth-btn">Dashboard</Link>
                <button onClick={() => { api.logout(); setUser(null); window.location.href = '/'; }} className="auth-btn logout-btn">Logout</button>
              </>
            ) : (
              <>
                <Link href="/signup" className="auth-btn">Sign Up</Link>
                <Link href="/login" className="auth-btn">Log in</Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-current transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[70px] left-0 right-0 bg-white shadow-lg z-50 border-t mobile-menu">
          <div className="px-4 py-6 space-y-4">
            <Link href="/" className="block py-2 text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/collections" className="block py-2 text-amber-600 font-semibold" onClick={() => setMobileMenuOpen(false)}>Our Collections</Link>
            <Link href="/new-arrivals" className="block py-2 text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex justify-center mb-3">
                <ThemeToggle />
              </div>
              {user ? (
                <>
                  <Link href="/dashboard" className="block bg-amber-600 text-white text-center py-2 px-4 rounded hover:bg-amber-700" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <button onClick={() => { api.logout(); setUser(null); window.location.href = '/'; setMobileMenuOpen(false); }} className="block w-full border border-amber-600 text-amber-600 text-center py-2 px-4 rounded hover:bg-amber-50">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/signup" className="block bg-amber-600 text-white text-center py-2 px-4 rounded hover:bg-amber-700" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                  <Link href="/login" className="block border border-amber-600 text-amber-600 text-center py-2 px-4 rounded hover:bg-amber-50" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="main-content" style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="header-section" style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 className="main-title" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "#a65b2b", marginBottom: "16px" }}>
            Our Collections
          </h1>
          <p className="main-subtitle" style={{ color: "#6b625d", fontSize: "clamp(0.9rem, 2vw, 1.1rem)", maxWidth: "600px", margin: "0 auto", padding: "0 16px" }}>
            Discover the beauty of Ethiopian art through our carefully curated collections of traditional paintings, pottery, textiles, and handwoven crafts.
          </p>
        </div>

        {categories.map((category, categoryIndex) => (
          <section key={categoryIndex} style={{ marginBottom: "60px" }}>
            <h2 className="category-title" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(1.3rem, 3vw, 1.8rem)", color: "#a65b2b", marginBottom: "24px", textAlign: "center" }}>
              {category.name}
            </h2>
            
            <div className="collections-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
              {category.images.map((image, imageIndex) => (
                <div key={imageIndex} style={{ 
                  backgroundColor: "white", 
                  borderRadius: "12px", 
                  overflow: "hidden", 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                }}>
                  <div style={{ position: "relative", width: "100%", height: "200px" }}>
                    <Image
                      src={image}
                      alt={`${category.name} ${imageIndex + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="card-content" style={{ padding: "16px" }}>
                    <h3 className="card-title" style={{ fontSize: "1.1rem", fontWeight: "600", color: "#5a2f15", marginBottom: "8px" }}>
                      {category.name} #{imageIndex + 1}
                    </h3>
                    <p className="card-description" style={{ color: "#6b625d", fontSize: "0.9rem" }}>
                      Authentic Ethiopian {category.name.toLowerCase()} crafted by local artisans.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <style jsx global>{`
        .nav-link {
          color: #a65b2b !important;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        :root:not(.dark) .nav-link {
          color: #a65b2b !important;
        }
        
        .nav-link.active {
          font-weight: bold;
        }
        
        .auth-btn {
          background: #a65b2b;
          color: #fff;
          padding: 7px 12px;
          border-radius: 8px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        
        .logout-btn {
          background: transparent;
          border: 1px solid #a65b2b;
          color: #a65b2b;
        }
        
        .logout-btn:hover {
          background: #a65b2b;
          color: white;
        }
        
        header {
          background: #fbfaf8 !important;
        }
        
        :root.dark .nav-link {
          color: white !important;
        }
        
        :root.dark .auth-btn {
          background: #a65b2b !important;
          color: white !important;
        }
        
        :root.dark header {
          background: #3d2914 !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        :root.dark main {
          background: #3d2914 !important;
        }
        
        :root.dark .card-content {
          background: #3d2914 !important;
        }
        
        :root.dark h1, :root.dark h2, :root.dark h3, :root.dark p {
          color: white !important;
        }
        
        :root.dark .card-title {
          color: white !important;
        }
        
        :root.dark .card-description {
          color: #e5e5e5 !important;
        }
        
        /* Mobile Menu Dark Theme */
        :root.dark .mobile-menu {
          background: #3d2914 !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        
        :root.dark .mobile-menu a {
          color: white !important;
        }
        
        :root.dark .mobile-menu a:hover {
          color: #a65b2b !important;
        }
        
        :root.dark .mobile-menu .border-gray-200 {
          border-color: rgba(255,255,255,0.1) !important;
        }
        
        /* Responsive Styles */
        @media (max-width: 1024px) {
          .collections-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 18px !important;
          }
        }
        
        @media (max-width: 768px) {
          .main-content {
            padding: 32px 16px !important;
          }
          
          .header-section {
            margin-bottom: 32px !important;
          }
          
          .collections-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
          
          .nav-links {
            display: none !important;
          }
        }
        
        @media (max-width: 640px) {
          .main-content {
            padding: 24px 12px !important;
          }
          
          .collections-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          
          .header-section {
            margin-bottom: 24px !important;
          }
        }
        
        @media (max-width: 480px) {
          .main-content {
            padding: 20px 8px !important;
          }
          
          .main-subtitle {
            padding: 0 8px !important;
          }
        }
      `}</style>
    </>
  );
}