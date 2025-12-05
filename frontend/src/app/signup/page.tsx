'use client';

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import SignupForm from "../../components/SignupForm";
import ThemeToggle from "../../components/ThemeToggle";
import "../../styles/globals.css";

export default function SignupPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <>
      <Head>
        <title>Create an account — BRANA Arts</title>
        <meta name="description" content="Sign up to BRANA Arts — join our community of artists and collectors." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Top nav (simple inline header like the screenshot) */}
      <header style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "#fbfaf8" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <Image src="/assets/logo.png" alt="BRANA Arts" width={60} height={60} priority className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 rounded-full object-cover" />
          </div>

          <nav className="nav-links hidden md:flex" style={{ gap: 20, alignItems: "center", fontSize: 15, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <Link href="/#hero" className="nav-link">Home</Link>
            <Link href="/#collection" className="nav-link">Our Collections</Link>
            <Link href="/#about" className="nav-link">About Us</Link>
            <Link href="/#contact" className="nav-link">Contact</Link>
          </nav>

          <div className="hidden md:flex" style={{ gap: "8px", alignItems: "center" }}>
            <ThemeToggle />
            <Link href="/login" className="auth-btn">Login</Link>
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
            <Link href="/collections" className="block py-2 text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>Our Collections</Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex justify-center mb-3">
                <ThemeToggle />
              </div>
              <Link href="/login" className="block bg-amber-600 text-white text-center py-2 px-4 rounded hover:bg-amber-700" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            </div>
          </div>
        </div>
      )}

      <main>
        <SignupForm />
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
          transition: background 0.2s ease;
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
        
        :root.dark body {
          background: #3d2914 !important;
        }
        
        :root.dark h1, :root.dark h2, :root.dark h3, :root.dark p {
          color: white !important;
        }
        
        :root.dark label {
          color: #f4e4bc !important;
        }
        
        :root.dark input, :root.dark select, :root.dark textarea {
          background: #4a3319 !important;
          border-color: #6b4e2a !important;
          color: white !important;
        }
        
        :root.dark button {
          background: #a65b2b !important;
          color: white !important;
        }
        
        :root.dark div, :root.dark section {
          background: #3d2914 !important;
        }
        
        :root.dark form {
          background: #4a3319 !important;
        }
        
        :root.dark a {
          color: #d4b896 !important;
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
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}