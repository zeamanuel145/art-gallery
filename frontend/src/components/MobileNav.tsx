'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

interface MobileNavProps {
  isDashboard?: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ isDashboard = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && <div className="overlay" onClick={toggleMenu}></div>}

      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-header">
          <ThemeToggle />
          <button className="close-btn" onClick={toggleMenu}>×</button>
        </div>
        
        <nav className="mobile-nav">
          {isDashboard ? (
            <>
              <Link href="/" onClick={toggleMenu}>Home</Link>
              <Link href="/collections" onClick={toggleMenu}>Explore</Link>
              <Link href="/dashboard" onClick={toggleMenu}>Dashboard</Link>
              <Link href="/my-artworks" onClick={toggleMenu}>My Artworks</Link>
              <div className="mobile-icons">
                <button className="icon-btn" aria-label="Notifications">🔔</button>
              </div>
            </>
          ) : (
            <>
              <Link href="/" onClick={toggleMenu}>Home</Link>
              <Link href="/collections" onClick={toggleMenu}>Collections</Link>
              <Link href="/about" onClick={toggleMenu}>About</Link>
              <Link href="/contact" onClick={toggleMenu}>Contact</Link>
              <Link href="/login" onClick={toggleMenu}>Login</Link>
              <Link href="/signup" onClick={toggleMenu}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>

      <style jsx>{`
        .hamburger {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          gap: 4px;
        }

        .hamburger span {
          width: 20px;
          height: 2px;
          background: #a65b2b;
          transition: all 0.3s ease;
        }

        :root.dark .hamburger span {
          background: white;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          right: -300px;
          width: 280px;
          height: 100vh;
          background: ${isDashboard ? 'transparent' : '#fff'};
          z-index: 999;
          transition: right 0.3s ease;
          padding: 20px;
          box-shadow: ${isDashboard ? 'none' : '-2px 0 10px rgba(0, 0, 0, 0.1)'};
        }

        :root.dark .mobile-menu {
          background: ${isDashboard ? 'transparent' : '#3d2914'};
        }

        .mobile-menu.open {
          right: 0;
        }

        .mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(166, 91, 43, 0.1);
        }

        :root.dark .mobile-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #a65b2b;
          padding: 4px;
        }

        :root.dark .close-btn {
          color: white;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .mobile-nav a {
          color: #a65b2b;
          text-decoration: none;
          font-weight: 600;
          padding: 12px 0;
          border-bottom: 1px solid rgba(166, 91, 43, 0.1);
          transition: color 0.2s ease;
        }

        :root.dark .mobile-nav a {
          color: white;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-nav a:hover {
          color: #8b4a20;
        }

        :root.dark .mobile-nav a:hover {
          color: #f4e4bc;
        }

        .mobile-icons {
          display: flex;
          justify-content: center;
          padding: 20px 0;
          margin-top: 10px;
          border-top: 1px solid rgba(166, 91, 43, 0.1);
        }

        :root.dark .mobile-icons {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .icon-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #a65b2b;
          padding: 8px;
        }

        :root.dark .icon-btn {
          color: white;
        }

        @media (max-width: 768px) {
          .hamburger {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};

export default MobileNav;