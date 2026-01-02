'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '../../../../lib/api';
import Navbar from '../../../../components/Navbar';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await api.getOrder(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

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

  if (!order) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h1>Order not found</h1>
          <Link href="/orders" style={{ marginTop: '20px', display: 'inline-block', padding: '12px 24px', background: '#a65b2b', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
          <h1 style={{ fontSize: '32px', color: '#22c55e', marginBottom: '12px' }}>Order Confirmed!</h1>
          <p style={{ fontSize: '18px', color: '#666' }}>Thank you for your purchase</p>
          <div style={{ marginTop: '20px', fontSize: '20px', fontWeight: '600', color: '#a65b2b' }}>
            Order #{order.orderNumber}
          </div>
        </div>

        <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#333' }}>Order Details</h2>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#666' }}>Items</h3>
            {order.items.map((item: any, index: number) => (
              <div key={index} style={{ display: 'flex', gap: '16px', padding: '16px', background: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>
                <img
                  src={item.artwork?.imageUrl || '/placeholder.svg'}
                  alt={item.artwork?.title}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.artwork?.title}</div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    by {item.artwork?.artist?.username || 'Unknown'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>Qty: {item.quantity}</span>
                    <span style={{ fontWeight: '600', color: '#a65b2b' }}>${item.subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Shipping</span>
              <span>${order.shippingCost.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '20px', paddingTop: '12px', borderTop: '2px solid #eee' }}>
              <span>Total</span>
              <span style={{ color: '#a65b2b' }}>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#666' }}>Shipping Address</h3>
            <div style={{ lineHeight: '1.8', color: '#333' }}>
              <div>{order.shippingAddress.fullName}</div>
              <div>{order.shippingAddress.address}</div>
              <div>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </div>
              <div>{order.shippingAddress.country}</div>
              <div style={{ marginTop: '8px' }}>Phone: {order.shippingAddress.phone}</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '24px', marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: '600' }}>Payment Method</span>
              <span style={{ textTransform: 'capitalize' }}>
                {order.paymentMethod === 'mobile_banking' ? 'Mobile Banking' : order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Card'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: '600' }}>Payment Status</span>
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                background: order.paymentStatus === 'paid' ? '#d1fae5' : '#fef3c7',
                color: order.paymentStatus === 'paid' ? '#065f46' : '#92400e',
              }}>
                {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600' }}>Order Status</span>
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                background: order.status === 'pending' ? '#fef3c7' : order.status === 'shipped' ? '#dbeafe' : order.status === 'delivered' ? '#d1fae5' : '#fee2e2',
                color: order.status === 'pending' ? '#92400e' : order.status === 'shipped' ? '#1e40af' : order.status === 'delivered' ? '#065f46' : '#991b1b',
                textTransform: 'capitalize',
              }}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link
            href="/orders"
            style={{
              padding: '12px 24px',
              background: '#a65b2b',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            View My Orders
          </Link>
          <Link
            href="/new-arrivals"
            style={{
              padding: '12px 24px',
              background: 'white',
              color: '#a65b2b',
              border: '2px solid #a65b2b',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Continue Shopping
          </Link>
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

