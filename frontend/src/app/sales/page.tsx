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

type Sale = {
  id: number;
  artwork: string;
  artworkSrc: string;
  buyer: string;
  date: string;
  amount: string;
  status: "Completed" | "Pending" | "Cancelled";
};

const ALL_SALES: Sale[] = [
  { id: 1, artwork: "Queen of Sheba Painting", artworkSrc: "/cards/paint.jpg", buyer: "Abebe Kebede", date: "July 20, 2024", amount: "$500.00", status: "Completed" },
  { id: 2, artwork: "Traditional Pottery", artworkSrc: "/cards/pottery 1.jpg", buyer: "Selamawit Tesfaye", date: "July 15, 2024", amount: "$300.00", status: "Completed" },
  { id: 3, artwork: "Woven Basketry", artworkSrc: "/cards/basket.jpg", buyer: "Tadesse Mekonnen", date: "July 10, 2024", amount: "$200.00", status: "Pending" },
  { id: 4, artwork: "Tibeb Textile Art", artworkSrc: "/cards/tibeb 2.jpg", buyer: "Aster Mengistu", date: "July 05, 2024", amount: "$150.00", status: "Completed" },
  { id: 5, artwork: "Ethiopian Coffee Set", artworkSrc: "/assets/hero1.jpg", buyer: "Yonas Hailu", date: "July 01, 2024", amount: "$100.00", status: "Cancelled" },
];

export default function SalesPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const pageSize = 5;

  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
    loadSales();
  }, []);

  async function loadUserProfile() {
    try {
      const userData = await api.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  }

  async function loadSales() {
    try {
      // Show user's artworks that are for sale or sold
      const userArtworks = await api.getUserArtworks();
      const salesArtworks = userArtworks.filter(artwork => artwork.forSale || artwork.sold);
      setSales(salesArtworks);
    } catch (error) {
      console.error('Failed to load sales:', error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sales;
    return sales.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.createdAt?.toLowerCase().includes(q)
    );
  }, [query, sales]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function goto(p: number) {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function exportCSV() {
    const rows = [
      ["Artwork", "Buyer", "Date", "Amount", "Status"],
      ...filtered.map((s) => [s.artwork, s.buyer, s.date, s.amount, s.status]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales_export_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Head>
        <title>Sales — BRANA Arts</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PageTransition>
        <div className="page">
          <DashboardSidebar activePage="sales" />
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

        <main className="main">
          <div className="headerRow">
            <div>
              <h1>Sales</h1>
              <p className="subtitle">Overview of your artwork sales</p>
            </div>

            <div className="controls">
              <button className="exportBtn" onClick={exportCSV} aria-label="Export data">
                Export Data ⤓
              </button>
            </div>
          </div>

          <div className="searchRow">
            <input
              className="search"
              placeholder="Search transactions, buyers or artworks..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              aria-label="Search sales"
            />
          </div>

          <div className="tableWrap" role="table" aria-label="Sales table">
            <div className="tableHead" role="rowgroup">
              <div className="row head" role="row">
                <div className="cell artworkHead">ARTWORK</div>
                <div className="cell">BUYER</div>
                <div className="cell">DATE</div>
                <div className="cell">AMOUNT</div>
                <div className="cell">STATUS</div>
              </div>
            </div>

            <div className="tableBody" role="rowgroup">
              {loading ? (
                <div className="row empty" role="row">
                  <div className="cell" style={{ gridColumn: "1 / -1", padding: 24, textAlign: "center" }}>
                    Loading sales...
                  </div>
                </div>
              ) : pageItems.length === 0 ? (
                <div className="row empty" role="row">
                  <div className="cell" style={{ gridColumn: "1 / -1", padding: 24, textAlign: "center" }}>
                    No sales yet. Upload artworks with prices to start selling!
                  </div>
                </div>
              ) : (
                pageItems.map((s) => (
                  <div className="row" role="row" key={s._id}>
                    <div className="cell artworkCell">
                      <div className="thumb">
                        <Image src={s.imageUrl || '/cards/paint.jpg'} alt={s.title || 'Artwork'} width={48} height={48} />
                        {s.sold && <div className="soldIcon">SOLD</div>}
                        {s.forSale && !s.sold && <div className="forSaleIcon">FOR SALE</div>}
                      </div>
                      <div className="artworkLabel">{s.title || 'Unknown Artwork'}</div>
                    </div>

                    <div className="cell">{s.sold ? 'Buyer Name' : 'Available'}</div>
                    <div className="cell">{new Date(s.createdAt).toLocaleDateString()}</div>
                    <div className="cell">${s.price || '0'}</div>
                    <div className="cell">
                      <span className={`badge ${s.sold ? 'completed' : 'pending'}`}>
                        {s.sold ? 'Sold' : 'For Sale'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="summary">
            Showing {total === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, total)} of {total} results
          </div>

          <nav className="pagination" aria-label="Pagination">
            <button className="pgBtn" onClick={() => goto(currentPage - 1)} disabled={currentPage === 1}>Previous</button>

            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  className={`pgNum ${p === currentPage ? "active" : ""}`}
                  onClick={() => goto(p)}
                  aria-current={p === currentPage ? "page" : undefined}
                >
                  {p}
                </button>
              );
            })}

            <button className="pgBtn" onClick={() => goto(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
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
          background: #efe8e3;
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
        
        .badge {
          padding: 6px 10px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 13px;
        }
        
        .completed {
          background: #dff7e8;
          color: #1a7a4b;
        }
        
        :root.dark .completed {
          background: #4a3319 !important;
          color: white !important;
        }
        
        .pending {
          background: #fff6da;
          color: #b17a1d;
        }
        
        :root.dark .pending {
          background: #4a3319 !important;
          color: white !important;
        }
        
        .cancelled {
          background: #fde8e8;
          color: #ae3b3b;
        }
        
        :root.dark .cancelled {
          background: #4a3319 !important;
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
          --soft: rgba(0,0,0,0.06);
          --head-bg: #efe8e3;
          --green: #dff7e8;
          --yellow: #fff6da;
          --red: #fde8e8;
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
        h1 { font-family: "Playfair Display", serif; font-size: 36px; margin: 0; }
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
        .tableHead .row.head { display:grid; grid-template-columns: 2fr 1.4fr 1fr 1fr 0.8fr; gap:0; padding: 12px 16px; background: var(--head-bg); color: var(--muted); font-weight:700; align-items:center; }
        .tableBody .row { display:grid; grid-template-columns: 2fr 1.4fr 1fr 1fr 0.8fr; gap:0; align-items:center; padding: 14px 16px; border-top: 1px solid rgba(0,0,0,0.03); }

        .cell { padding: 0 12px; display:flex; align-items:center; gap:12px; color: #a65b2b !important; }
        .artworkCell { display:flex; align-items:center; gap:12px; }
        .thumb { width:48px; height:48px; border-radius:8px; overflow:hidden; background:#efece9; flex-shrink:0; display:flex; align-items:center; justify-content:center; position: relative; }
        .soldIcon { position: absolute; top: -4px; right: -4px; background: #ef4444; color: white; border-radius: 4px; padding: 2px 4px; font-size: 8px; font-weight: 700; }
        .forSaleIcon { position: absolute; top: -4px; right: -4px; background: #22c55e; color: white; border-radius: 4px; padding: 2px 4px; font-size: 8px; font-weight: 700; }
        .artworkLabel { font-weight:600; color: #a65b2b !important; }

        .badge { padding:6px 10px; border-radius:999px; font-weight:600; font-size:13px; display:inline-block; }
        .completed { background: var(--green); color: #1a7a4b; }
        .pending { background: var(--yellow); color: #b17a1d; }
        .cancelled { background: var(--red); color: #ae3b3b; }

        .summary { color: var(--muted); margin-top: 12px; }

        .pagination { display:flex; gap:8px; align-items:center; justify-content:flex-end; margin-top:16px; }
        .pgBtn, .pgNum { padding:8px 12px; border-radius:8px; border:1px solid var(--soft); background: #fff; cursor:pointer; color: var(--muted); }
        .pgNum.active { background: var(--accent); color:#fff; border-color: transparent; box-shadow: 0 6px 18px rgba(166,91,43,0.12); }

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
          .tableHead .row.head, .tableBody .row { grid-template-columns: 1.8fr 1.6fr 1fr 1fr 0.9fr; }
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