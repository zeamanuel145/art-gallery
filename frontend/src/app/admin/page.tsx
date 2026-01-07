'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, User } from '../../lib/api';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const userData = await api.getProfile();
        setUser(userData);

        if (userData.role !== 'admin') {
          router.push('/dashboard');
          return;
        }

        const statsData = await api.getAdminDashboard();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load admin data:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar activePage="admin" />
      <div style={{ flex: 1, background: '#fbfaf8' }}>
        <Navbar />
        <div style={{ padding: '32px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '32px', color: '#a65b2b' }}>Admin Dashboard</h1>

          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Users</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#a65b2b' }}>{stats.totalUsers}</div>
              </div>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Artworks</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#a65b2b' }}>{stats.totalArtworks}</div>
              </div>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Orders</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#a65b2b' }}>{stats.totalOrders}</div>
              </div>
              <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Revenue</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22c55e' }}>${stats.totalRevenue.toFixed(2)}</div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <Link href="/admin/users" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                <h2 style={{ fontSize: '20px', marginBottom: '8px', color: '#333' }}>Manage Users</h2>
                <p style={{ color: '#666', fontSize: '14px' }}>View and manage user accounts</p>
              </div>
            </Link>

            <Link href="/admin/artworks" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
                <h2 style={{ fontSize: '20px', marginBottom: '8px', color: '#333' }}>Manage Artworks</h2>
                <p style={{ color: '#666', fontSize: '14px' }}>View and manage all artworks</p>
              </div>
            </Link>

            <Link href="/admin/orders" style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                <h2 style={{ fontSize: '20px', marginBottom: '8px', color: '#333' }}>Manage Orders</h2>
                <p style={{ color: '#666', fontSize: '14px' }}>View and manage all orders</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

