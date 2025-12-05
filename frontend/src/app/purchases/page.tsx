'use client';

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState, useEffect } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import ThemeToggle from "../../components/ThemeToggle";
import MobileNav from "../../components/MobileNav";
import DefaultAvatar from "../../components/DefaultAvatar";
import PageTransition from "../../components/PageTransition";
import { api, User } from "../../lib/api";

type Purchase = {
  id: number;
  artwork: string;
  thumb: string;
  details: string;
  price: string;
  seller: string;
  date: string;
};

const ALL_PURCHASES: Purchase[] = [
  { id: 1, artwork: "Ancient Echoes", thumb: "/cards/paint.jpg", details: "Mixed Media", price: "Birr 1,200", seller: "Abebe Kebede", date: "2023-01-15" },
  { id: 2, artwork: "Oromo Heritage", thumb: "/cards/pottery 1.jpg", details: "Oil on Canvas", price: "Birr 800", seller: "Selam Tesfaye", date: "2023-02-20" },
  { id: 3, artwork: "Gondar Castle", thumb: "/cards/basket.jpg", details: "Watercolor", price: "Birr 2,500", seller: "Tigist Mekonnen", date: "2023-03-10" },
  { id: 4, artwork: "Lalibela's Cross", thumb: "/cards/tibeb 2.jpg", details: "Acrylic", price: "Birr 500", seller: "Mulugeta Alemayehu", date: "2023-04-05" },
  { id: 5, artwork: "Axum Obelisk", thumb: "/assets/hero1.jpg", details: "Digital Art", price: "Birr 750", seller: "Yonas Hailu", date: "2023-05-12" },
];

export default function PurchasesPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const pageSize = 5;
  const total = ALL_PURCHASES.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
    loadPurchases();
  }, []);

  async function loadUserProfile() {
    try {
      const userData = await api.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  }

  async function loadPurchases() {
    try {
      const userPurchases = await api.getUserPurchases();
      setPurchases(userPurchases);
    } catch (error) {
      console.error('Failed to load purchases:', error);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return purchases;
    return purchases.filter(
      (p) =>
        p.artwork?.title?.toLowerCase().includes(q) ||
        p.seller?.username?.toLowerCase().includes(q) ||
        p.createdAt?.toLowerCase().includes(q)
    );
  }, [query, purchases]);

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function goto(p: number) {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function exportCSV() {
    const rows = [["Artwork", "Details", "Price", "Seller", "Date"], ...filtered.map((r) => [r.artwork, r.details, r.price, r.seller, r.date])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `purchases_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Head>
        <title>Purchases — BRANA Arts</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PageTransition>
        <div className="page">
          <DashboardSidebar activePage="purchases" />
          <div className="contentArea">
        <header className="topnav" role="banner">
          <div className="brand">
          </div>

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

        <main className="main" role="main">
          <div className="headerRow">
            <div>
              <h1>Purchases</h1>
              <p className="subtitle">A history of all the artworks you've acquired.</p>
            </div>

            <div className="controls">
              <button className="exportBtn" onClick={exportCSV} aria-label="Export purchases">Export Data ⤓</button>
            </div>
          </div>

          <div className="searchRow" role="search">
            <input
              className="search"
              placeholder="Search artwork, seller or date..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              aria-label="Search purchases"
            />
          </div>

          <section className="tableWrap" aria-labelledby="purchases-heading">
            <h2 id="purchases-heading" className="srOnly">Purchases list</h2>

            <div className="tableHead" role="rowgroup">
              <div className="row head" role="row">
                <div className="cell artworkHead">Artwork</div>
                <div className="cell">Details</div>
                <div className="cell">Price</div>
                <div className="cell">Seller</div>
                <div className="cell">Date</div>
                <div className="cell actionCol" aria-hidden />
              </div>
            </div>

            <div className="tableBody" role="rowgroup">
              {loading ? (
                <div className="row empty" role="row">
                  <div className="cell" style={{ gridColumn: "1 / -1", padding: 24, textAlign: "center" }}>
                    Loading purchases...
                  </div>
                </div>
              ) : pageItems.length === 0 ? (
                <div className="row empty" role="row">
                  <div className="cell" style={{ gridColumn: "1 / -1", padding: 24, textAlign: "center" }}>
                    No purchases yet. Buy some artworks to see them here!
                  </div>
                </div>
              ) : (
                pageItems.map((p) => (
                  <div className="row" role="row" key={p._id}>
                    <div className="cell artworkCell">
                      <div className="thumb">
                        <Image src={p.artwork?.imageUrl || '/cards/paint.jpg'} alt={p.artwork?.title || 'Artwork'} width={56} height={56} />
                        <div className="purchaseIcon">🛒</div>
                      </div>
                      <div className="artworkLabel">{p.artwork?.title || 'Unknown Artwork'}</div>
                    </div>

                    <div className="cell">
                      <div className="detailTitle">Digital Art</div>
                    </div>

                    <div className="cell">${p.price || '0'}</div>

                    <div className="cell">{p.seller?.username || 'Unknown'}</div>

                    <div className="cell">{new Date(p.createdAt).toLocaleDateString()}</div>

                    <div className="cell actionCol">
                      <a className="detailsLink" href="#" aria-label={`View details for ${p.artwork?.title}`}>View Details</a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="summary">
            Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} results
          </div>

          <nav className="pagination" aria-label="Pagination">
            <button className="pgBtn" onClick={() => goto(page - 1)} disabled={page === 1}>Previous</button>

            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  className={`pgNum ${p === page ? "active" : ""}`}
                  onClick={() => goto(p)}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </button>
              );
            })}

            <button className="pgBtn" onClick={() => goto(page + 1)} disabled={page === totalPages}>Next</button>
          </nav>
        </main>
          </div>
        </div>
      </PageTransition>

      <style jsx global>{`
        body {
          background: #fbfaf8;
          color: #a65b2b;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        :root.dark body {
          background: #3d2914 !important;
          color: white !important;
        }
        
        .topnav {
          background: #fbfaf8;
          border-bottom: 1px solid rgba(166, 91, 43, 0.1);
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
          color: #a65b2b;
        }
        
        :root.dark .iconBtn {
          color: white !important;
        }
        
        h1 {
          color: #a65b2b !important;
        }
        
        :root.dark h1 {
          color: white !important;
        }
        
        .subtitle {
          color: #6b625d;
        }
        
        :root.dark .subtitle {
          color: white !important;
        }
        
        .exportBtn {
          background: #a65b2b;
          color: #fff !important;
        }
        
        :root.dark .exportBtn {
          background: #a65b2b !important;
          color: white !important;
        }
        
        .search {
          background: #fff;
          border: 1px solid rgba(166, 91, 43, 0.1);
          color: #a65b2b;
        }
        
        :root.dark .search {
          background: #4a3319 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: white !important;
        }
        
        .tableWrap {
          background: #fff;
          border: 1px solid rgba(166, 91, 43, 0.1);
        }
        
        :root.dark .tableWrap {
          background: #4a3319 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        .row.head {
          background: #f0e8e2;
          color: #6b625d;
        }
        
        :root.dark .row.head {
          background: #3d2914 !important;
          color: white !important;
        }
        
        .artworkLabel {
          color: #a65b2b !important;
        }
        
        :root.dark .artworkLabel {
          color: white !important;
        }
        
        .detailTitle {
          color: #6b625d;
        }
        
        :root.dark .detailTitle {
          color: white !important;
        }
        
        .detailsLink {
          color: #a65b2b;
        }
        
        :root.dark .detailsLink {
          color: white !important;
        }
        
        .pgBtn, .pgNum {
          background: #fff;
          border: 1px solid rgba(166, 91, 43, 0.1);
          color: #6b625d;
        }
        
        :root.dark .pgBtn, :root.dark .pgNum {
          background: #4a3319 !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: white !important;
        }
        
        .pgNum.active {
          background: #a65b2b;
          color: #fff;
        }
        
        :root.dark .pgNum.active {
          background: #a65b2b !important;
          color: white !important;
        }
        
        :root {
          --page-bg: #fbfaf8;
          --muted: #6b625d;
          --accent: #a65b2b;
          --head-bg: #f0e8e2;
          --soft: rgba(0,0,0,0.06);
        }
        
        :root.dark .main {
          background: #3d2914 !important;
        }
        
        :root.dark .contentArea {
          background: #3d2914 !important;
        }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: "Open Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial; background: var(--page-bg); color: #a65b2b !important; }
        * { color: #a65b2b !important; }
        .page { display: flex; min-height: 100vh; }
        .contentArea { flex: 1; display: flex; flex-direction: column; }

        .topnav {
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding: 14px 28px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          background: #fff;
          position: sticky;
          top: 0;
          z-index: 20;
        }
        .brand{ display:flex; align-items:center; gap:12px; }
        .logo{ border-radius: 50%; object-fit: cover; }
        .centerlinks { display:flex; gap:20px; }
        .centerlinks a { color:#a65b2b !important; text-decoration:none; font-weight:600; }
        .centerlinks a:hover { text-decoration:underline; }

        .right{ display:flex; align-items:center; gap:12px; }
        .iconBtn{
          background:transparent;
          border:none;
          font-size:18px;
          cursor:pointer;
        }
        .avatar{ border-radius:999px; overflow:hidden; }
        .avatar img { border-radius: 50%; object-fit: cover; }

        .main { max-width: 1100px; margin: 28px auto; padding: 0 20px 80px; }

        .headerRow { display:flex; justify-content:space-between; align-items:center; margin-bottom: 18px; }
        h1 { font-family: "Playfair Display", serif; font-size: 36px; margin: 0; color: #a65b2b !important; }
        .subtitle { margin: 6px 0 0; color: var(--muted); }

        .controls { display:flex; gap:12px; align-items:center; }
        .exportBtn {
          background: var(--accent);
          color: #fff !important;
          border: none;
          padding: 10px 14px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(166,91,43,0.12);
        }

        .searchRow { margin: 18px 0; }
        .search {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid var(--soft);
          background: #fff;
          outline: none;
        }

        .tableWrap { margin-top: 12px; border-radius: 10px; overflow: hidden; border: 1px solid rgba(0,0,0,0.04); background: #fff; }
        .tableHead .row.head { display:grid; grid-template-columns: 2fr 1fr 1fr 1.2fr 1fr 0.7fr; gap:0; padding: 12px 16px; background: var(--head-bg); color: var(--muted); font-weight:700; align-items:center; }
        .tableBody .row { display:grid; grid-template-columns: 2fr 1fr 1fr 1.2fr 1fr 0.7fr; gap:0; align-items:center; padding: 14px 16px; border-top: 1px solid rgba(0,0,0,0.03); }

        .cell { padding: 0 12px; display:flex; align-items:center; gap:12px; color: #a65b2b !important; }
        .artworkCell { display:flex; align-items:center; gap:12px; }
        .thumb { width:56px; height:56px; border-radius:8px; overflow:hidden; background:#efece9; flex-shrink:0; display:flex; align-items:center; justify-content:center; position: relative; }
        .purchaseIcon { position: absolute; top: -4px; right: -4px; background: #22c55e; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 10px; }
        .artworkLabel { font-weight:700; color: #a65b2b !important; }

        .detailTitle { color: var(--muted); font-weight:600; }

        .detailsLink { color: var(--accent); text-decoration:none; font-weight:600; }
        .detailsLink:hover { text-decoration:underline; }

        .summary { color: var(--muted); margin-top: 12px; }

        .pagination { display:flex; gap:8px; align-items:center; justify-content:flex-end; margin-top:16px; }
        .pgBtn, .pgNum { padding:8px 12px; border-radius:8px; border:1px solid var(--soft); background: #fff; cursor:pointer; color: var(--muted); }
        .pgNum.active { background: var(--accent); color:#fff; border-color: transparent; box-shadow: 0 6px 18px rgba(166,91,43,0.12); }

        /* Accessibility helper */
        .srOnly { position:absolute; left:-10000px; top:auto; width:1px; height:1px; overflow:hidden; }

        /* responsive */
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
        
        @media (max-width: 768px) {
          .centerlinks { display: none; }
        }
        
        @media (max-width: 900px) {
          .tableHead .row.head, .tableBody .row { grid-template-columns: 1.8fr 1fr 1fr 1fr 1fr 0.8fr; }
        }
        @media (max-width: 640px) {
          .tableHead .row.head { display:none; }
          .tableBody .row {
            display:block;
            padding:12px 14px;
          }
          .row .cell { display:block; padding:6px 0; gap:8px; }
          .artworkCell { flex-direction:row; }
          .pagination { justify-content:center; }
          .headerRow { flex-direction:column; align-items:flex-start; gap:12px; }
        }
      `}</style>
    </>
  );
}