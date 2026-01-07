'use client';

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { Artwork, api, User } from '../../lib/api';
import ArtworkModal from '../../components/ArtworkModal';
import PaymentModal from '../../components/PaymentModal';
import SuccessMessage from '../../components/SuccessMessage';
import ThemeToggle from "../../components/ThemeToggle";
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import "../../styles/globals.css";

export default function NewArrivals() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [paymentArtwork, setPaymentArtwork] = useState<Artwork | null>(null);
  const [successArtwork, setSuccessArtwork] = useState<Artwork | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userProfile = await api.getProfile();
          setUser(userProfile);
        }
        
        const allArtworks = await api.getArtworks();
        console.log('Fetched artworks:', allArtworks); // Debug log
        const sortedArtworks = allArtworks.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setArtworks(sortedArtworks);
      } catch (error) {
        console.error('Failed to fetch artworks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleArtworkUpdate = async () => {
    try {
      const allArtworks = await api.getArtworks();
      const sortedArtworks = allArtworks.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setArtworks(sortedArtworks);
    } catch (error) {
      console.error('Failed to refresh artworks:', error);
    }
  };

  const handleBuyClick = (artwork: Artwork) => {
    if (!user) return;
    setPaymentArtwork(artwork);
  };

  const handleAddToCart = (artwork: Artwork, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      showToast('Please log in to add items to cart', 'warning');
      return;
    }
    if (!artwork.forSale || artwork.sold) {
      showToast('This artwork is not available for purchase', 'error');
      return;
    }
    addToCart(artwork);
    showToast(`${artwork.title} added to cart`, 'success');
  };

  const handlePaymentSuccess = async () => {
    if (!paymentArtwork) return;
    try {
      await api.buyArtwork(paymentArtwork._id);
      setPaymentArtwork(null);
      setSuccessArtwork(paymentArtwork);
      handleArtworkUpdate();
    } catch (error) {
      console.error('Failed to buy artwork:', error);
    }
  };

  const isOwner = (artwork: Artwork) => {
    return user && (user._id === artwork.artist._id || user.id === artwork.artist._id);
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div className="loadingState">
            <div className="spinner"></div>
            <p>Loading new arrivals...</p>
          </div>
        </div>
        <style jsx>{`
          .section { padding: 64px 20px; background: #fbfaf8; min-height: 100vh; display: flex; align-items: center; }
          .container { max-width: 1200px; margin: 0 auto; }
          .loadingState { text-align: center; }
          .spinner { width: 40px; height: 40px; border: 3px solid #f3f1ef; border-top: 3px solid #a65b2b; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          p { color: #a65b2b; font-size: 18px; }
        `}</style>
      </section>
    );
  }

  return (
    <>
      <Head>
        <title>New Arrivals — BRANA Arts</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <header style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "#fbfaf8" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Image src="/assets/logo.png" alt="BRANA Arts" width={60} height={60} priority className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 rounded-full object-cover" />
          </div>

          <nav className="nav-links hidden md:flex" style={{ gap: 16, alignItems: "center", fontSize: 15, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/collections" className="nav-link">Our Collections</Link>
            <Link href="/about" className="nav-link">About Us</Link>
            <Link href="/new-arrivals" className="nav-link active">New Arrivals</Link>
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
            <Link href="/collections" className="block py-2 text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>Our Collections</Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link href="/new-arrivals" className="block py-2 text-amber-600 font-semibold" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link>
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

      <section className="section">
        <div className="container">
          <h1 className="heading">New Arrivals</h1>
          <p className="subtitle">Discover the latest masterpieces from our talented artists</p>
          
          {artworks.length === 0 ? (
            <div className="emptyState">
              <div className="emptyIcon">🎨</div>
              <h3>No Artworks Yet</h3>
              <p>Be the first to share your creativity with the world!</p>
            </div>
          ) : (
            <>
              <div className="statsInfo">
                <p>{artworks.length} amazing {artworks.length === 1 ? 'artwork' : 'artworks'} to explore</p>
              </div>
              
              <div className="grid">
                {artworks.map((artwork, index) => (
                  <article 
                    key={artwork._id} 
                    className={`card ${index % 2 === 0 ? 'animate-slideInLeft' : 'animate-slideInRight'}`}
                    onClick={() => setSelectedArtwork(artwork)}
                  >
                    <div className="media">
                      <img
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {artwork.price && artwork.price > 0 && !artwork.sold && (
                        <div className="priceTag">${artwork.price}</div>
                      )}
                      {artwork.sold && (
                        <div className="soldTag">SOLD</div>
                      )}

                    </div>
                    
                    <div className="content">
                      <h3 className="cardTitle">{artwork.title}</h3>
                      <p className="artist">by {artwork.artist?.username || 'Unknown Artist'}</p>
                      <div className="cardStats">
                        <span className="stat">
                          {user && artwork.likedBy?.includes(user._id || user.id || '') ? '❤️' : '🤍'} {artwork.likes}
                        </span>
                        <span className="stat">💬 {artwork.comments.length}</span>
                        <span className="date">{new Date(artwork.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="priceInfo">
                        {artwork.sold ? (
                          <span className="soldText">SOLD</span>
                        ) : artwork.price && artwork.price > 0 ? (
                          <>
                            <span className="price">${artwork.price}</span>
                            {!isOwner(artwork) && user && (
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button 
                                  className="buyBtn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBuyClick(artwork);
                                  }}
                                >
                                  Buy Here
                                </button>
                                <button 
                                  className="addToCartBtn"
                                  onClick={(e) => handleAddToCart(artwork, e)}
                                  style={{
                                    background: isInCart(artwork._id) ? '#22c55e' : '#a65b2b',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    transition: 'background 0.2s'
                                  }}
                                >
                                  {isInCart(artwork._id) ? '✓ In Cart' : 'Add to Cart'}
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="notForSale">Not for sale</span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          user={user}
          onClose={() => setSelectedArtwork(null)}
          onUpdate={handleArtworkUpdate}
        />
      )}

      {paymentArtwork && (
        <PaymentModal
          artwork={{
            title: paymentArtwork.title,
            price: paymentArtwork.price || 0,
            artist: { username: paymentArtwork.artist.username }
          }}
          user={user}
          onClose={() => setPaymentArtwork(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {successArtwork && (
        <SuccessMessage
          artwork={{
            title: successArtwork.title,
            artist: { username: successArtwork.artist.username }
          }}
          onClose={() => setSuccessArtwork(null)}
        />
      )}

      <style jsx global>{`
        .section {
          padding: 64px 20px;
          background: #fbfaf8;
          min-height: 100vh;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .heading {
          text-align: center;
          font-family: "Playfair Display", serif;
          font-size: clamp(28px, 3.5vw, 44px);
          margin-bottom: 16px;
          color: #a65b2b;
        }
        .subtitle {
          text-align: center;
          color: #6b625d;
          font-size: 18px;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .statsInfo {
          text-align: center;
          margin-bottom: 32px;
        }
        .statsInfo p {
          color: #6b625d;
          font-size: 16px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          align-items: start;
        }

        .card {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          will-change: transform;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .media {
          position: relative;
          width: 100%;
          height: 200px;
          background: #f3f1ef;
          overflow: hidden;
        }
        .media img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }

        .priceTag {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(34, 197, 94, 0.9);
          color: white;
          padding: 6px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 700;
        }
        .soldTag {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          padding: 6px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 700;
        }

        .content {
          padding: 18px 16px 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cardTitle {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: 18px;
          color: #a65b2b;
          letter-spacing: -0.2px;
        }
        .artist {
          margin: 0;
          color: #a65b2b;
          font-size: 14px;
          font-weight: 600;
        }
        .cardStats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }
        .cardStats span {
          color: #6b625d;
          font-size: 12px;
        }
        .cardStats .date {
          font-size: 11px;
          opacity: 0.8;
        }
        .cardStats .stat {
          cursor: default;
        }
        .priceInfo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 8px;
          border-top: 1px solid #f0f0f0;
        }
        .priceInfo .price {
          font-weight: 700;
          color: #a65b2b;
          font-size: 16px;
        }
        .soldText {
          font-weight: 700;
          color: #ef4444;
          font-size: 14px;
          text-transform: uppercase;
        }
        .notForSale {
          font-weight: 600;
          color: #6b625d;
          font-size: 14px;
        }
        .buyBtn {
          background: #a65b2b;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .buyBtn:hover {
          background: #8f4a20;
          transform: translateY(-1px);
        }
        
        .buyOverlayBtn {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(166, 91, 43, 0.9);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
          opacity: 1;
          visibility: visible;
          z-index: 10;
        }
        
        .buyOverlayBtn:hover {
          background: rgba(143, 74, 32, 0.95);
          transform: translateX(-50%) translateY(-2px);
        }

        .emptyState {
          text-align: center;
          padding: 80px 20px;
        }
        .emptyIcon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        .emptyState h3 {
          font-family: "Playfair Display", serif;
          font-size: 28px;
          color: #a65b2b;
          margin: 0 0 12px;
        }
        .emptyState p {
          color: #6b625d;
          font-size: 16px;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 18px;
          }
        }
        
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .section {
            padding: 40px 16px;
          }
        }
        
        @media (max-width: 640px) {
          .heading {
            font-size: 26px;
          }
          .grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .section {
            padding: 32px 12px;
          }
        }
        
        @media (max-width: 480px) {
          .section {
            padding: 32px 12px;
          }
          .heading {
            font-size: 24px;
          }
          .subtitle {
            font-size: 16px;
          }
        }

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
        
        :root.dark .section {
          background: #3d2914 !important;
        }
        
        :root.dark body {
          background: #3d2914 !important;
        }
        
        :root.dark h1, :root.dark h2, :root.dark h3, :root.dark p {
          color: white !important;
        }
        
        :root.dark .card {
          background: #4a3319 !important;
        }
        
        :root.dark .soldText {
          color: #f87171 !important;
        }
        
        :root.dark .notForSale {
          color: white !important;
        }
        
        :root.dark .priceInfo .price {
          color: #a65b2b !important;
        }
        
        :root.dark .buyOverlayBtn {
          background: rgba(166, 91, 43, 0.9);
          color: white;
        }
        
        :root.dark .buyOverlayBtn:hover {
          background: rgba(143, 74, 32, 0.95);
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
      `}</style>
    </>
  );
}