'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, User } from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import AdminSidebar from '../../../components/AdminSidebar';

export default function AdminReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

        const reportData = await api.getSalesReport();
        setReport(reportData);
      } catch (error) {
        console.error('Failed to load data:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleGenerateReport = async () => {
    try {
      const reportData = await api.getSalesReport(startDate || undefined, endDate || undefined);
      setReport(reportData);
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  if (loading || !user || user.role !== 'admin') {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar activePage="admin-reports" />
      <div style={{ flex: 1, background: '#fbfaf8' }}>
        <Navbar />
        <div style={{ padding: '32px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '32px', color: '#a65b2b' }}>Sales Reports</h1>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>Filter Report</h2>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', width: '200px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', width: '200px' }}
                />
              </div>
              <button
                onClick={handleGenerateReport}
                style={{
                  padding: '10px 24px',
                  background: '#a65b2b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Generate Report
              </button>
            </div>
          </div>

          {report && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Orders</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#a65b2b' }}>{report.totalOrders}</div>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Revenue</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22c55e' }}>${report.totalRevenue.toFixed(2)}</div>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Pending Orders</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>{report.pendingOrders}</div>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Completed Orders</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22c55e' }}>{report.completedOrders}</div>
                </div>
              </div>

              <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '20px', color: '#333' }}>Order Details</h2>
                </div>
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f9fafb', position: 'sticky', top: 0 }}>
                      <tr>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Order #</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Customer</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Date</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#333' }}>Status</th>
                        <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#333' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.orders.map((order: any) => (
                        <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '16px', color: '#333', fontWeight: '600' }}>{order.orderNumber}</td>
                          <td style={{ padding: '16px', color: '#333' }}>{order.user?.name || order.user?.email}</td>
                          <td style={{ padding: '16px', color: '#666', fontSize: '14px' }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: order.status === 'delivered' ? '#d1fae5' : order.status === 'pending' ? '#fef3c7' : '#dbeafe',
                              color: order.status === 'delivered' ? '#065f46' : order.status === 'pending' ? '#92400e' : '#1e40af',
                              textTransform: 'capitalize',
                            }}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#a65b2b' }}>
                            ${order.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

