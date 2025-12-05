'use client';

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api, User } from '../../lib/api';
import ThemeToggle from "../../components/ThemeToggle";
import "../../styles/globals.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile().then(setUser).catch(() => {});
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Head>
        <title>Contact Us — BRANA Arts</title>
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
            <Link href="/new-arrivals" className="nav-link">New Arrivals</Link>
            <Link href="/about" className="nav-link">About Us</Link>
            <Link href="/contact" className="nav-link active">Contact</Link>
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
            <Link href="/new-arrivals" className="block py-2 text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>New Arrivals</Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-amber-600" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link href="/contact" className="block py-2 text-amber-600 font-semibold" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            
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
            Contact Us
          </h1>
          <p style={{ color: "#6b625d", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Get in touch with us. We'd love to hear from you and answer any questions you may have.
          </p>
        </div>

        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>
          {/* Contact Form */}
          <div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem", color: "#a65b2b", marginBottom: "24px" }}>
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#5a2f15" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#5a2f15" }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#5a2f15" }}>
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none"
                  }}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="artist">Artist Partnership</option>
                  <option value="purchase">Purchase Question</option>
                  <option value="support">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#5a2f15" }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none",
                    resize: "vertical"
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: "#a65b2b",
                  color: "#fff",
                  padding: "14px 28px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem", color: "#a65b2b", marginBottom: "24px" }}>
              Get in Touch
            </h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "50px", height: "50px", backgroundColor: "#a65b2b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                  📍
                </div>
                <div>
                  <h3 style={{ color: "#5a2f15", marginBottom: "4px" }}>Address</h3>
                  <p style={{ color: "#6b625d", margin: 0 }}>
                    123 Art Street, Addis Ababa
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "50px", height: "50px", backgroundColor: "#a65b2b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                  📞
                </div>
                <div>
                  <h3 style={{ color: "#5a2f15", marginBottom: "4px" }}>Phone</h3>
                  <p style={{ color: "#6b625d", margin: 0 }}>
                    +1 (234) 567-890
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "50px", height: "50px", backgroundColor: "#a65b2b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                  ✉️
                </div>
                <div>
                  <h3 style={{ color: "#5a2f15", marginBottom: "4px" }}>Email</h3>
                  <p style={{ color: "#6b625d", margin: 0 }}>
                    contact@branaarts.com
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "50px", height: "50px", backgroundColor: "#a65b2b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                  🕒
                </div>
                <div>
                  <h3 style={{ color: "#5a2f15", marginBottom: "4px" }}>Business Hours</h3>
                  <p style={{ color: "#6b625d", margin: 0 }}>
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="gallery-card" style={{ marginTop: "40px", padding: "24px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <h3 style={{ color: "#a65b2b", marginBottom: "16px" }}>Visit Our Gallery</h3>
              <p style={{ color: "#6b625d", lineHeight: "1.6", marginBottom: "16px" }}>
                Come visit our physical gallery to see our collections up close and meet our artists. We're located in the heart of Addis Ababa.
              </p>
              <Link 
                href="/collections" 
                style={{ 
                  color: "#a65b2b", 
                  textDecoration: "none", 
                  fontWeight: "600",
                  borderBottom: "2px solid #a65b2b"
                }}
              >
                View Our Collections →
              </Link>
            </div>
          </div>
        </div>
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
        
        :root.dark .gallery-card {
          background: #4a3319 !important;
        }
        
        :root.dark .gallery-card h3 {
          color: #f4e4bc !important;
        }
        
        :root.dark .gallery-card p {
          color: #e8d5b7 !important;
        }
        
        :root.dark .gallery-card a {
          color: #d4b896 !important;
          border-bottom-color: #d4b896 !important;
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
          .main-content {
            padding: 32px 16px !important;
          }
          
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          
          .nav-links {
            display: none !important;
          }
        }
        
        @media (max-width: 640px) {
          .main-content {
            padding: 24px 12px !important;
          }
          
          .header-section {
            margin-bottom: 32px !important;
          }
          
          .contact-grid {
            gap: 32px !important;
          }
        }
        
        @media (max-width: 480px) {
          .main-content {
            padding: 20px 8px !important;
          }
          
          .gallery-card {
            padding: 20px !important;
            margin-top: 32px !important;
          }
        }
      `}</style>
    </>
  );
}