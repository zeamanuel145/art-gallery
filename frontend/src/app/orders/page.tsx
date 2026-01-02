'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';
import Navbar from '../../components/Navbar';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const ordersData = await api.getOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

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

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <div>Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '32px', color: '#a65b2b' }}>My Orders</h1>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
            <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#333' }}>No orders yet</h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>Start shopping to see your orders here</p>
            <Link
              href="/new-arrivals"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: '#a65b2b',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              Browse Artworks
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map((order) => {
              const statusStyle = getStatusColor(order.status);
              return (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  style={{
                    display: 'block',
                    background: 'white',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                        Order #{order.orderNumber}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
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

                  <div style={{ marginBottom: '20px' }}>
                    {order.items.slice(0, 3).map((item: any, index: number) => (
                      <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
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
                    {order.items.length > 3 && (
                      <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                        +{order.items.length - 3} more item(s)
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                    <div>
                      <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Total</div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#a65b2b' }}>
                        ${order.total.toFixed(2)}
                      </div>
                    </div>
                    <div style={{
                      padding: '8px 16px',
                      background: '#f3f4f6',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333',
                    }}>
                      View Details →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        :root.dark body {
          background: #3d2914;
        }
      `}</style>
    </div>
  );
}

