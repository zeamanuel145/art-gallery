'use client';

import Head from "next/head";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardSidebar from "../../components/DashboardSidebar";
import ThemeToggle from "../../components/ThemeToggle";
import MobileNav from "../../components/MobileNav";
import DefaultAvatar from "../../components/DefaultAvatar";
import PageTransition from "../../components/PageTransition";
import { api, User, Artwork } from "../../lib/api";

const stats = [
  { label: "Total Sales", value: "$12,500" },
  { label: "Total Artworks", value: "35" },
  { label: "Likes", value: "2,345" },
  { label: "Followers", value: "1,876" },
];

const DashboardStats: React.FC = () => (
  <section className="stats" aria-label="Dashboard statistics">
    {stats.map((s) => (
      <div key={s.label} className="statCard">
        <div className="label">{s.label}</div>
        <div className="value">{s.value}</div>
      </div>
    ))}
  </section>
);

type Art = { src: string; title: string; price: string; status?: "For Sale" | "Pending" | "Sold" };

const ArtCard: React.FC<Art> = ({ src, title, price, status = "For Sale" }) => (
  <article className="artCard">
    <div className="media">
      <Image src={src} alt={title} fill style={{ objectFit: "cover" }} />
    </div>
    <div className="info">
      <h3 className="artTitle">{title}</h3>
      <div className="row">
        <div className="price">{price}</div>
        <div className={`badge ${status === "Pending" ? "pending" : ""}`}>{status}</div>
      </div>
    </div>
  </article>
);

const demoArt: Art[] = [
  { src: "/cards/pottery 1.jpg", title: "Traditional Pottery", price: "$150", status: "For Sale" },
  { src: "/cards/paint.jpg", title: "Queen of Sheba Painting", price: "$500", status: "For Sale" },
  { src: "/cards/basket.jpg", title: "Woven Basketry", price: "$80", status: "For Sale" },
  { src: "/cards/tibeb 2.jpg", title: "Tibeb Textile Art", price: "$220", status: "Pending" },
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [recentArtworks, setRecentArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await api.getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>BRANA Arts — Artist Dashboard</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <PageTransition>
        <div className="page">
          <DashboardSidebar activePage="dashboard" user={user} />
          <div className="contentArea">
          <header className="topnav" role="banner">
            <div className="brand"></div>
            <nav className="centerlinks" aria-label="Main">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/collections" className="nav-link">Explore</Link>
              <Link href="/dashboard" className="nav-link">Dashboard</Link>
              <Link href="/my-artworks" className="nav-link">My Artworks</Link>
            </nav>
            <div className="right">
              <div className="hidden md:flex items-center gap-3">
                <ThemeToggle />
                <button className="iconBtn" aria-label="Notifications">🔔</button>
                <div className="avatar">
                  {user?.profilePicture ? (
                    <Image 
                      src={user.profilePicture} 
                      alt="User" 
                      width={36} 
                      height={36} 
                      style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <DefaultAvatar size={36} />
                  )}
                </div>
                {user && <button onClick={() => { api.logout(); window.location.href = '/'; }} className="logout-btn">Logout</button>}
              </div>
              <div className="flex md:hidden items-center gap-2">
                <div className="avatar">
                  {user?.profilePicture ? (
                    <Image 
                      src={user.profilePicture} 
                      alt="User" 
                      width={32} 
                      height={32} 
                      style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <DefaultAvatar size={32} />
                  )}
                </div>
                <MobileNav isDashboard={true} />
              </div>
            </div>
          </header>
          
          <main className="main">
            <div className="pageHeader">
              <h1>Dashboard Overview</h1>
              <p className="subtitle">Welcome to your artist dashboard</p>
            </div>
            {loading ? (
              <div className="loadingState">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
              </div>
            ) : (
              <>
                <DashboardStats />

                <section className="artSection" aria-label="My Recent Artworks">
                  <div className="headerRow">
                    <h3 className="sectionTitle">Featured Artworks</h3>
                    <div className="actionButtons">
                      <a href="/upload-artwork" className="upload">+ Upload New Artwork</a>
                    </div>
                  </div>
                  <div className="staticNotice">
                    <p>This overview displays curated artworks for all users. Your uploaded works will appear in <strong>New Arrivals</strong>, <strong>My Artworks</strong>, and other personalized sections.</p>
                  </div>
                  <div className="grid">
                    {demoArt.map((art) => (
                      <ArtCard key={art.title} {...art} />
                    ))}
                  </div>
                </section>
              </>
            )}
          </main>
          </div>
        </div>
      </PageTransition>

      <style jsx global>{`
        body {
          background: #fbfaf8 !important;
          color: #a65b2b;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        :root.dark body {
          background: #3d2914 !important;
          color: white !important;
        }
        
        .main {
          background: #fbfaf8 !important;
        }
        
        .contentArea {
          background: #fbfaf8 !important;
        }
        
        :root.dark .main {
          background: #3d2914 !important;
        }
        
        :root.dark .contentArea {
          background: #3d2914 !important;
        }
        
        .topnav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 28px;
          border-bottom: 1px solid rgba(166, 91, 43, 0.1);
          background: #fbfaf8;
          position: sticky;
          top: 0;
          z-index: 20;
          overflow-x: auto;
        }
        
        :root.dark .topnav {
          background: #3d2914 !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        .nav-link {
          color: #a65b2b !important;
          text-decoration: none;
          font-weight: 600;
        }
        
        :root.dark .nav-link {
          color: white !important;
        }
        
        .nav-link:hover {
          text-decoration: underline;
        }
        
        .iconBtn {
          background: transparent;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #a65b2b;
        }
        
        :root.dark .iconBtn {
          color: white !important;
        }
        
        .centerlinks {
          display: flex;
          gap: 20px;
        }
        
        .right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .avatar {
          border-radius: 999px;
          overflow: hidden;
        }
        
        .avatar img {
          border-radius: 50%;
          object-fit: cover;
        }
        
        .page {
          display: flex;
          min-height: 100vh;
        }
        
        .contentArea {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .main {
          padding: 22px 32px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        
        .pageHeader {
          margin-bottom: 24px;
        }
        
        h1 {
          font-family: "Playfair Display", serif;
          font-size: 36px;
          margin: 0;
          color: #a65b2b;
        }
        
        :root.dark h1 {
          color: white !important;
        }
        
        .subtitle {
          margin: 0;
          color: #6b625d;
          font-size: 16px;
        }
        
        :root.dark .subtitle {
          color: white !important;
        }
        
        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin: 18px 0 28px;
        }
        
        .statCard {
          background: #fff;
          padding: 18px 20px;
          border-radius: 12px;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(166, 91, 43, 0.1);
        }
        
        :root.dark .statCard {
          background: #4a3319 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        .label {
          font-size: 13px;
          color: #6b625d;
          font-weight: 600;
        }
        
        :root.dark .label {
          color: white !important;
        }
        
        .value {
          margin-top: 8px;
          font-family: "Playfair Display", serif;
          font-size: 22px;
          color: #a65b2b;
        }
        
        :root.dark .value {
          color: white !important;
        }
        
        .headerRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .sectionTitle {
          font-family: "Playfair Display", serif;
          font-size: 20px;
          color: #a65b2b;
          margin: 0;
        }
        
        :root.dark .sectionTitle {
          color: white !important;
        }
        
        .staticNotice {
          background: rgba(166, 91, 43, 0.05);
          border-left: 4px solid #a65b2b;
          padding: 16px 20px;
          margin: 12px 0 20px;
          border-radius: 0 8px 8px 0;
        }
        
        .staticNotice p {
          color: #6b625d;
          font-size: 14px;
          margin: 0;
          line-height: 1.5;
        }
        
        .staticNotice strong {
          color: #a65b2b;
          font-weight: 600;
        }
        
        :root.dark .staticNotice {
          background: rgba(166, 91, 43, 0.1);
          border-left-color: #a65b2b;
        }
        
        :root.dark .staticNotice p {
          color: #ccc !important;
        }
        
        :root.dark .staticNotice strong {
          color: #d4a574 !important;
        }
        
        .actionButtons {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        
        .viewAll {
          background: transparent;
          color: #a65b2b;
          padding: 8px 14px;
          border: 2px solid #a65b2b;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
        }
        
        :root.dark .viewAll {
          color: white !important;
          border-color: #a65b2b !important;
        }
        
        .viewAll:hover {
          background: #a65b2b;
          color: #fff;
        }
        
        :root.dark .viewAll:hover {
          background: #a65b2b !important;
          color: white !important;
        }
        
        .upload {
          background: #a65b2b;
          color: #fff;
          padding: 8px 14px;
          border-radius: 10px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
        }
        
        :root.dark .upload {
          background: #a65b2b !important;
          color: white !important;
        }
        
        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
          margin-top: 12px;
        }
        
        .artCard {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(166, 91, 43, 0.1);
          display: flex;
          flex-direction: column;
        }
        
        :root.dark .artCard {
          background: #4a3319 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        .media {
          position: relative;
          height: 170px;
          background: #efece9;
        }
        
        :root.dark .media {
          background: #3d2914 !important;
        }
        
        .info {
          padding: 12px 14px 16px;
        }
        
        .artTitle {
          font-family: "Playfair Display", serif;
          font-size: 16px;
          margin: 0 0 8px;
          color: #a65b2b;
        }
        
        :root.dark .artTitle {
          color: white !important;
        }
        
        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        
        .price {
          color: #a65b2b;
          font-weight: 700;
        }
        
        :root.dark .price {
          color: white !important;
        }
        
        .badge {
          background: #e8f5ee;
          color: #1b8a5a;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }
        
        :root.dark .badge {
          background: #4a3319 !important;
          color: white !important;
        }
        
        .loadingState {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f1ef;
          border-top: 3px solid #a65b2b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loadingState p {
          color: #a65b2b;
          font-size: 16px;
          margin: 0;
        }
        
        :root.dark .loadingState p {
          color: white !important;
        }
        
        :root.dark .spinner {
          border-color: #4a3319;
          border-top-color: #a65b2b;
        }
        
        .logout-btn {
          background: transparent;
          border: 1px solid #a65b2b;
          color: #a65b2b;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .logout-btn:hover {
          background: #a65b2b;
          color: white;
        }
        
        :root.dark .logout-btn {
          border-color: #a65b2b;
          color: white;
        }
        
        :root.dark .logout-btn:hover {
          background: #a65b2b;
          color: white;
        }
        
        @media (max-width: 1200px) {
          .main {
            padding: 20px 24px;
          }
        }
        
        @media (max-width: 1024px) {
          .grid, .loadingGrid {
            grid-template-columns: repeat(3, 1fr);
          }
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .topnav {
            padding: 12px 16px;
          }
          .centerlinks {
            display: none;
          }
          .right {
            position: relative;
          }
          .main {
            padding: 16px 20px;
          }
          h1 {
            font-size: 28px;
          }
          .grid, .loadingGrid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .headerRow {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .actionButtons {
            flex-direction: column;
            align-items: stretch;
          }
        }
        
        @media (max-width: 640px) {
          .stats {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .statCard {
            padding: 14px 16px;
          }
        }
        
        @media (max-width: 480px) {
          .main {
            padding: 0 14px 60px;
          }
          h1 {
            font-size: 20px;
          }
          .grid, .loadingGrid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .right {
            gap: 6px;
          }
          .viewAll, .upload {
            padding: 4px 8px;
            font-size: 12px;
          }
          .statCard {
            padding: 8px 10px;
          }
          .value {
            font-size: 16px;
          }
          .artCard .media {
            height: 120px;
          }
          .topnav {
            padding: 8px 12px;
          }
        }
        
        @media (max-width: 375px) {
          .main {
            padding: 10px 12px;
          }
          h1 {
            font-size: 22px;
          }
          .statCard {
            padding: 12px 14px;
          }
          .value {
            font-size: 18px;
          }
        }
      `}</style>
    </>
  );
}