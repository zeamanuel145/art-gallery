'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import { useToast } from '../../../contexts/ToastContext';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { showToast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const orderData = await api.getOrder(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        showToast('Failed to load order details', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, router, showToast]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
    try {
      await api.cancelOrder(orderId);
      showToast('Order cancelled successfully', 'success');
      const orderData = await api.getOrder(orderId);
      setOrder(orderData);
    } catch (error: any) {
      showToast(error.message || 'Failed to cancel order', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <div>Loading order details...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h1>Order not found</h1>
          <Link href="/orders" style={{ marginTop: '20px', display: 'inline-block', padding: '12px 24px', background: '#a65b2b', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

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

  const statusStyle = getStatusColor(order.status);

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <Link href="/orders" style={{ display: 'inline-block', marginBottom: '24px', color: '#a65b2b', textDecoration: 'none', fontWeight: '600' }}>
          ← Back to Orders
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#333' }}>Order #{order.orderNumber}</h1>
            <div style={{ fontSize: '16px', color: '#666' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
          <div style={{
            padding: '8px 20px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            background: statusStyle.bg,
            color: statusStyle.color,
            textTransform: 'capitalize',
          }}>
            {order.status}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column */}
          <div>
            {/* Items */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>Order Items</h2>
              {order.items.map((item: any, index: number) => (
                <div key={index} style={{ display: 'flex', gap: '16px', padding: '16px', background: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>
                  <img
                    src={item.artwork?.imageUrl || '/placeholder.svg'}
                    alt={item.artwork?.title}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px' }}>{item.artwork?.title}</div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                      by {item.artwork?.artist?.username || 'Unknown'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>Quantity: {item.quantity}</span>
                      <span style={{ fontWeight: '600', fontSize: '18px', color: '#a65b2b' }}>
                        ${(item.subtotal ?? 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>Shipping Address</h2>
              <div style={{ lineHeight: '1.8', color: '#333' }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>{order.shippingAddress.fullName}</div>
                <div>{order.shippingAddress.address}</div>
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </div>
                <div>{order.shippingAddress.country}</div>
                <div style={{ marginTop: '12px' }}>📞 {order.shippingAddress.phone}</div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>Order Summary</h2>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span>Subtotal</span>
                  <span>${(order.subtotal ?? 0).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span>Shipping</span>
                  <span>${(order.shippingCost ?? 0).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span>Tax</span>
                  <span>${(order.tax ?? 0).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '20px', paddingTop: '12px', borderTop: '2px solid #eee' }}>
                  <span>Total</span>
                  <span style={{ color: '#a65b2b' }}>${(order.total ?? 0).toFixed(2)}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Payment Method</div>
                  <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                    {order.paymentMethod === 'mobile_banking' ? 'Mobile Banking' : order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Card'}
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Payment Status</div>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    background: order.paymentStatus === 'paid' ? '#d1fae5' : '#fef3c7',
                    color: order.paymentStatus === 'paid' ? '#065f46' : '#92400e',
                    textTransform: 'capitalize',
                  }}>
                    {order.paymentStatus}
                  </div>
                </div>
                {order.trackingNumber && (
                  <div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>Tracking Number</div>
                    <div style={{ fontWeight: '600', fontFamily: 'monospace' }}>{order.trackingNumber}</div>
                  </div>
                )}
              </div>
            </div>

            {(order.status === 'pending' || order.status === 'processing') && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: cancelling ? '#ccc' : 'white',
                  color: cancelling ? '#666' : '#ef4444',
                  border: '2px solid #ef4444',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: cancelling ? 'not-allowed' : 'pointer',
                }}
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root.dark body {
          background: #3d2914;
        }
      `}</style>
    </div>
  );
}

