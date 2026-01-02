'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AdminSidebarProps {
  activePage?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePage = "admin" }) => {
  return (
    <aside className="sidebar" aria-label="Admin navigation">
      <div className="brand">
        <Image src="/assets/logo.png" alt="BRANA Arts logo" width={80} height={80} priority className="logo" style={{ borderRadius: '50%', objectFit: 'cover' }} />
        <div className="brandSub">Admin Panel</div>
      </div>

      <nav className="nav" aria-label="Main">
        <Link className={`item ${activePage === "admin" ? "active" : ""}`} href="/admin">
          <span className="icon">🏠</span>
          <span>Dashboard</span>
        </Link>

        <Link className={`item ${activePage === "admin-users" ? "active" : ""}`} href="/admin/users">
          <span className="icon">👥</span>
          <span>Users</span>
        </Link>

        <Link className={`item ${activePage === "admin-artworks" ? "active" : ""}`} href="/admin/artworks">
          <span className="icon">🎨</span>
          <span>Artworks</span>
        </Link>

        <Link className={`item ${activePage === "admin-orders" ? "active" : ""}`} href="/admin/orders">
          <span className="icon">📦</span>
          <span>Orders</span>
        </Link>

        <Link className={`item ${activePage === "admin-reports" ? "active" : ""}`} href="/admin/reports">
          <span className="icon">📊</span>
          <span>Reports</span>
        </Link>
      </nav>

      <div className="bottom">
        <Link className={`smallItem ${activePage === "dashboard" ? "active" : ""}`} href="/dashboard">
          <span className="icon">←</span>
          <span>Artist Dashboard</span>
        </Link>
      </div>

      <style jsx global>{`
        .sidebar {
          background: #fffaf8;
          border-right: 1px solid rgba(166, 91, 43, 0.1);
          width: 220px;
          min-width: 220px;
          padding: 28px 18px;
          height: calc(100vh - 0px);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        :root.dark .sidebar {
          background: #3d2914 !important;
          border-right: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        .brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .logo {
          border-radius: 50% !important;
          object-fit: cover;
          width: 80px !important;
          height: 80px !important;
        }

        .brandSub {
          font-size: 12px;
          margin-top: 8px;
          margin-bottom: 2px;
          color: #6b625d;
        }
        
        :root.dark .brandSub {
          color: white !important;
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 0px;
        }

        .item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          color: #6b625d;
          transition: all 0.2s ease;
        }
        
        :root.dark .item {
          color: white !important;
        }

        .item:hover {
          background: rgba(166, 91, 43, 0.04);
          color: #a65b2b;
        }
        
        :root.dark .item:hover {
          background: rgba(255,255,255,0.1) !important;
          color: white !important;
        }

        .active {
          background: #efe6df;
          color: #a65b2b;
          box-shadow: 0 6px 16px rgba(166, 91, 43, 0.06);
        }
        
        :root.dark .active {
          background: #4a3319 !important;
          color: white !important;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3) !important;
        }

        .icon {
          font-size: 18px;
          line-height: 1;
        }

        .bottom {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 32px;
        }

        .smallItem {
          display: flex;
          gap: 10px;
          text-decoration: none;
          padding: 8px 10px;
          border-radius: 8px;
          color: #6b625d;
        }
        
        :root.dark .smallItem {
          color: white !important;
        }

        .smallItem:hover {
          background: rgba(0, 0, 0, 0.02);
        }
        
        :root.dark .smallItem:hover {
          background: rgba(255,255,255,0.1) !important;
        }

        .smallItem.active {
          background: #efe6df;
          color: #a65b2b;
        }
        
        :root.dark .smallItem.active {
          background: #4a3319 !important;
          color: white !important;
        }
      `}</style>
    </aside>
  );
};

export default AdminSidebar;

