'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, User } from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import AdminSidebar from '../../../components/AdminSidebar';
import { useToast } from '../../../contexts/ToastContext';
import OrderTrackingInput from './OrderTrackingInput';

export default function AdminOrdersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
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

        const ordersData = await api.getAllOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to load data:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showToast('Order status updated successfully', 'success');
      const ordersData = await api.getAllOrders();
      setOrders(ordersData);
    } catch (error: any) {
      showToast(error.message || 'Failed to update order status', 'error');
    }
  };

  const handleTrackingUpdate = async (orderId: string, trackingNumber: string) => {
    if (!trackingNumber.trim()) {
      showToast('Please enter a tracking number', 'warning');
      return;
    }

    try {
      await api.addTrackingNumber(orderId, trackingNumber);
      showToast('Tracking number added successfully', 'success');
      const ordersData = await api.getAllOrders();
      setOrders(ordersData);
    } catch (error: any) {
      showToast(error.message || 'Failed to add tracking number', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#fef3c7', color: '#92400e' };
      case 'processing':
        return { bg: '#dbeafe', color: '#1e40af' };
      case 'shipped':
        return { bg: '#dbeafe', color: '#1e40af' };
      case 'delivered':
        return { bg: '#d1fae5', color: '#065f46' };
      case 'cancelled':
        return { bg: '#fee2e2', color: '#991b1b' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
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
      <AdminSidebar activePage="admin-orders" />
      <div style={{ flex: 1, background: '#fbfaf8' }}>
        <Navbar />
        <div style={{ padding: '32px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '32px', color: '#a65b2b' }}>Order Management</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map((order) => {
              const statusStyle = getStatusColor(order.status);

              return (
                <div key={order._id} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                        Order #{order.orderNumber}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                        Customer: {order.user?.name || order.user?.username || order.user?.email}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          background: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <div style={{
                        padding: '6px 16px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        textTransform: 'capitalize',
                      }}>
                        {order.status}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    {order.items.slice(0, 3).map((item: any, index: number) => (
                      <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
                        <img
                          src={item.artwork?.imageUrl || '/placeholder.svg'}
                          alt={item.artwork?.title}
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.artwork?.title}</div>
                          <div style={{ fontSize: '14px', color: '#666' }}>
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#a65b2b' }}>
                        Total: ${order.total.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                        Payment: <span style={{ textTransform: 'capitalize', fontWeight: '600' }}>{order.paymentStatus}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {order.status === 'processing' && (
                        <OrderTrackingInput
                          orderId={order._id}
                          currentTrackingNumber={order.trackingNumber}
                          onUpdate={handleTrackingUpdate}
                        />
                      )}
                      <Link
                        href={`/orders/${order._id}`}
                        style={{
                          padding: '8px 16px',
                          background: '#a65b2b',
                          color: 'white',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

