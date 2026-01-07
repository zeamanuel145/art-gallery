'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { api, User } from '../lib/api';
import ThemeToggle from './ThemeToggle';
import DefaultAvatar from './DefaultAvatar';
import ShoppingCart from './ShoppingCart';
import { useCart } from '../contexts/CartContext';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const isDashboardPage = ['/dashboard', '/my-artworks', '/profile', '/purchases', '/sales', '/settings', '/upload-artwork'].includes(pathname);
  const { getTotalItems } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile().then(setUser).catch((error) => {
        console.log('Profile fetch failed:', error.message);
        if (error.message.includes('Failed to fetch')) {
          console.log('Backend server not available');
        } else {
          localStorage.removeItem('token');
        }
      });
    }

    // Theme detection
    const checkTheme = () => {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldBeDark = saved === 'dark' || (!saved && prefersDark);
      setIsDark(shouldBeDark);
    };

    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    api.logout();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className={`navbar relative ${styles.navbar}`}>
      <div className={`navbar-inner px-4 sm:px-6 lg:px-8 ${styles['navbar-inner']}`}>
        <div className="logo-wrap flex items-center" aria-label="Site logo">
          <Image src="/assets/logo.png" alt="BRANA Arts logo" width={60} height={60} priority className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 rounded-full object-cover" />
        </div>

        {/* Desktop Navigation */}
        {!isDashboardPage ? (
          <ul className="nav-links hidden md:flex space-x-4 lg:space-x-6" role="menubar" aria-label="Main navigation">
            <li><Link href="/" className="text-sm lg:text-base text-white hover:text-gray-300 transition-colors">Home</Link></li>
            <li><Link href="/collections" className="text-sm lg:text-base text-white hover:text-gray-300 transition-colors">Our Collections</Link></li>
            <li><Link href="/new-arrivals" className="text-sm lg:text-base text-white hover:text-gray-300 transition-colors">New Arrivals</Link></li>
            <li><Link href="/about" className="text-sm lg:text-base text-white hover:text-gray-300 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="text-sm lg:text-base text-white hover:text-gray-300 transition-colors">Contact</Link></li>
          </ul>
        ) : (
          <ul className="nav-links hidden md:flex" role="menubar" aria-label="Dashboard navigation">
            <li><Link href="/" className="text-white hover:text-gray-300 transition-colors flex items-center space-x-1" title="Home">🏠</Link></li>
          </ul>
        )}

        {/* Desktop Actions - Hidden on mobile, visible on desktop */}
        <div className="nav-actions hidden md:flex items-center space-x-2 lg:space-x-3">
          <ThemeToggle />
          {user ? (
            <>
              <button 
                className={`text-lg relative transition-colors ${isDashboardPage ? (isDark ? 'text-white hover:text-gray-300' : 'text-amber-900 hover:text-amber-700') : 'text-white hover:text-gray-300'}`}
                aria-label="Shopping Cart"
                onClick={() => setIsCartOpen(true)}
                style={{ position: 'relative', cursor: 'pointer' }}
              >
                🛒
                {getTotalItems() > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#ef4444',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {getTotalItems() > 9 ? '9+' : getTotalItems()}
                  </span>
                )}
              </button>
              {!isLandingPage && !isDashboardPage && (
                <>
                  <button className="text-white text-lg" aria-label="Notifications">🔔</button>
                  {user.profilePicture ? (
                    <Image 
                      src={user.profilePicture} 
                      alt="User avatar" 
                      width={36} 
                      height={36} 
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <DefaultAvatar size={36} />
                  )}
                  <span className="welcome-text text-xs lg:text-sm">Welcome, {user.username}</span>
                </>
              )}
              {!isDashboardPage && (
                <>
                  <Link href="/dashboard" className="btn primary text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2">Dashboard</Link>
                  <button onClick={handleLogout} className="btn ghost text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2">
                    Log Out
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <Link href="/signup" className="btn primary text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2">Sign Up</Link>
              <Link href="/login" className="btn ghost text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-2">Log In</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''} ${isDashboardPage ? 'hamburger-dashboard' : 'bg-white'}`}></span>
          <span className={`block w-6 h-0.5 transition-opacity ${isMenuOpen ? 'opacity-0' : ''} ${isDashboardPage ? 'hamburger-dashboard' : 'bg-white'}`}></span>
          <span className={`block w-6 h-0.5 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''} ${isDashboardPage ? 'hamburger-dashboard' : 'bg-white'}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          className={`md:hidden absolute top-full left-0 right-0 z-50 mobile-menu-container ${isDashboardPage ? 'dashboard-transparent' : isLandingPage ? 'landing-menu' : 'other-menu'}`}
          style={isDashboardPage ? {
            backgroundColor: 'transparent',
            backdropFilter: 'none'
          } : {}}
        >
          <div className="px-4 py-6 space-y-4 mobile-menu-content">
            {/* Navigation Links */}
            {!isDashboardPage ? (
              <>
                <Link href="/" className="block text-white hover:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link href="/collections" className="block text-white hover:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>Explore</Link>
                {!user && (
                  <>
                    <Link href="/new-arrivals" className="block text-white hover:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>New Arrivals</Link>
                    <Link href="/about" className="block text-white hover:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>About Us</Link>
                    <Link href="/contact" className="block text-white hover:text-gray-300 py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                  </>
                )}
              </>
            ) : (
              <Link href="/" className={`block py-2 flex items-center space-x-2 ${isDark ? 'text-white hover:text-gray-300' : 'text-amber-900 hover:text-amber-700'}`} onClick={() => setIsMenuOpen(false)}>
                <span>🏠</span><span>Home</span>
              </Link>
            )}
            
            {/* User-specific items - only show for logged-in users */}
            {user && (
              <>
                <Link href="/dashboard" className={`block py-2 ${isDashboardPage ? (isDark ? 'text-white hover:text-gray-300' : 'text-amber-900 hover:text-amber-700') : 'text-white hover:text-gray-300'}`} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link href="/my-artworks" className={`block py-2 ${isDashboardPage ? (isDark ? 'text-white hover:text-gray-300' : 'text-amber-900 hover:text-amber-700') : 'text-white hover:text-gray-300'}`} onClick={() => setIsMenuOpen(false)}>My Artworks</Link>
                <button onClick={() => {handleLogout(); setIsMenuOpen(false);}} className={`block w-full text-left py-2 ${isDashboardPage ? (isDark ? 'text-white hover:text-gray-300' : 'text-amber-900 hover:text-amber-700') : 'text-white hover:text-gray-300'}`}>
                  Logout
                </button>
              </>
            )}
            
            <div className="pt-4 border-t border-white/20 space-y-3">
              <div className="flex justify-center mb-3">
                <ThemeToggle />
              </div>
              {user && (
                <button 
                  className={`block w-full text-left py-2 ${isDashboardPage ? (isDark ? 'text-white hover:text-gray-300' : 'text-amber-900 hover:text-amber-700') : 'text-white hover:text-gray-300'}`}
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  🛒 Shopping Cart {getTotalItems() > 0 && `(${getTotalItems()})`}
                </button>
              )}
              {user ? (
                !isLandingPage && (
                  <div className="flex items-center justify-center space-x-3">
                    {user.profilePicture ? (
                      <Image 
                        src={user.profilePicture} 
                        alt="User avatar" 
                        width={32} 
                        height={32} 
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <DefaultAvatar size={32} />
                    )}
                    <span className={`text-sm ${isDashboardPage ? (isDark ? 'text-white/80' : 'text-amber-900/80') : 'text-white/80'}`}>Welcome, {user.username}</span>
                  </div>
                )
              ) : (
                <>
                  <Link href="/signup" className="block bg-amber-600 text-white text-center py-2 px-4 rounded hover:bg-amber-700" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                  <Link href="/login" className="block border border-white text-white text-center py-2 px-4 rounded hover:bg-white/10" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;

// Add global styles for mobile menu theming
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .mobile-menu-container.landing-menu {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(8px);
    }
    
    .mobile-menu-container.other-menu {
      background: rgba(0, 0, 0, 0.9) !important;
      backdrop-filter: blur(8px);
    }
    
    :root.dark .mobile-menu-container.landing-menu {
      background: rgba(61, 41, 20, 0.95) !important;
    }
    
    /* DASHBOARD - TRANSPARENT BACKGROUND */
    .mobile-menu-container.dashboard-transparent {
      background: transparent !important;
      backdrop-filter: none !important;
    }
    
    /* DASHBOARD - BROWN BACKGROUND IN DARK MODE */
    .mobile-menu-container.dashboard-force-brown {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(8px);
    }
    
    :root.dark .mobile-menu-container.dashboard-force-brown {
      background: #3d2914 !important;
    }
    
    .mobile-menu-container.dashboard-force-brown .mobile-menu-content a {
      color: white !important;
    }
    
    .mobile-menu-container.dashboard-force-brown .mobile-menu-content button {
      color: white !important;
    }
    
    /* Dashboard menu styling */
    .mobile-menu-container.dashboard-brown {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(8px);
    }
    
    :root.dark .mobile-menu-container.dashboard-brown {
      background: rgba(61, 41, 20, 0.95) !important;
    }
    
    .mobile-menu-container.dashboard-brown .mobile-menu-content a {
      color: #a65b2b !important;
    }
    
    :root.dark .mobile-menu-container.dashboard-brown .mobile-menu-content a {
      color: white !important;
    }
    
    .mobile-menu-container.dashboard-brown .mobile-menu-content button {
      color: #a65b2b !important;
    }
    
    :root.dark .mobile-menu-container.dashboard-brown .mobile-menu-content button {
      color: white !important;
    }
    
    /* Dashboard menu styling - FORCE BROWN */
    .mobile-menu-container.dashboard-menu-force-brown {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(8px);
    }
    
    :root.dark .mobile-menu-container.dashboard-menu-force-brown {
      background: #8B4513 !important;
    }
    
    .dark .mobile-menu-container.dashboard-menu-force-brown {
      background: #8B4513 !important;
    }
    
    html.dark .mobile-menu-container.dashboard-menu-force-brown {
      background: #8B4513 !important;
    }
    
    [data-theme="dark"] .mobile-menu-container.dashboard-menu-force-brown {
      background: #8B4513 !important;
    }
    
    :root.dark .mobile-menu-container.dashboard-menu-force-brown .mobile-menu-content a {
      color: white !important;
    }
    
    :root:not(.dark) .mobile-menu-container.dashboard-menu-force-brown .mobile-menu-content a {
      color: #a65b2b !important;
    }
    
    .mobile-menu-container.dashboard-menu-force-brown .mobile-menu-content a:hover {
      color: rgba(166, 91, 43, 0.8) !important;
    }
    
    :root:not(.dark) .mobile-menu-container.dashboard-menu-force-brown .mobile-menu-content button {
      color: #a65b2b !important;
    }
    
    :root:not(.dark) .mobile-menu-container.dashboard-menu-force-brown .mobile-menu-content button:hover {
      color: rgba(166, 91, 43, 0.8) !important;
    }
    
    :root.dark .mobile-menu-container.landing-menu .mobile-menu-content a {
      color: white !important;
    }
    
    :root:not(.dark) .mobile-menu-container.landing-menu .mobile-menu-content a {
      color: #a65b2b !important;
    }
    
    .mobile-menu-container.landing-menu .mobile-menu-content a:hover {
      color: rgba(166, 91, 43, 0.8) !important;
    }
    
    /* Logout button styling for light mode on landing page */
    :root:not(.dark) .mobile-menu-container.landing-menu .mobile-menu-content button {
      color: #a65b2b !important;
    }
    
    :root:not(.dark) .mobile-menu-container.landing-menu .mobile-menu-content button:hover {
      color: rgba(166, 91, 43, 0.8) !important;
    }
    
    /* Hamburger menu button visibility */
    :root.dark .navbar button[aria-label="Toggle menu"] span {
      background-color: white !important;
    }
    
    :root:not(.dark) .navbar button[aria-label="Toggle menu"] span {
      background-color: white !important;
    }
    
    /* Dashboard hamburger styling */
    .hamburger-dashboard {
      background-color: #a65b2b !important;
    }
    
    :root.dark .hamburger-dashboard {
      background-color: #a65b2b !important;
    }
    
    @media (max-width: 767px) {
      .nav-actions {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}