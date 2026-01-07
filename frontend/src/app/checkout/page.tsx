'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { api, User } from '../../lib/api';
import Navbar from '../../components/Navbar';
import '../../styles/globals.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Ethiopia',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_banking' | 'cash_on_delivery'>('card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    mobileProvider: '',
    mobileNumber: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const userData = await api.getProfile();
        setUser(userData);
        setFormData(prev => ({
          ...prev,
          fullName: userData.name || '',
          phone: userData.phone || '',
        }));

        // Load saved addresses
        const addresses = await api.getShippingAddresses();
        setSavedAddresses(addresses);
        const defaultAddress = addresses.find((a: any) => a.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
          setUseNewAddress(false);
          setFormData({
            fullName: defaultAddress.fullName,
            phone: defaultAddress.phone,
            address: defaultAddress.address,
            city: defaultAddress.city,
            state: defaultAddress.state,
            zipCode: defaultAddress.zipCode,
            country: defaultAddress.country || 'Ethiopia',
          });
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h1>Your cart is empty</h1>
          <button onClick={() => router.push('/new-arrivals')} style={{ marginTop: '20px', padding: '12px 24px', background: '#a65b2b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shippingCost = 50; // Fixed shipping cost
  const tax = subtotal * 0.15; // 15% tax
  const total = subtotal + shippingCost + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = cartItems.map(item => ({
        artwork: item.artwork._id,
        quantity: item.quantity,
        price: item.artwork.price || 0,
        subtotal: (item.artwork.price || 0) * item.quantity,
      }));

      const orderData = {
        items: orderItems,
        subtotal,
        shippingCost,
        tax,
        total,
        shippingAddress: formData,
        paymentMethod,
      };

      const order = await api.createOrder(orderData);

      // Process payment based on method
      if (paymentMethod === 'cash_on_delivery') {
        // For COD, payment status remains pending
        showToast('Order placed successfully! Payment on delivery.', 'success');
      } else if (paymentMethod === 'card' || paymentMethod === 'mobile_banking') {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        await api.updatePaymentStatus(order._id, 'paid', `TXN-${Date.now()}`);
        showToast('Payment successful! Order confirmed.', 'success');
      }

      clearCart();
      router.push(`/orders/${order._id}/confirmation`);
    } catch (error: any) {
      console.error('Checkout error:', error);
      showToast(error.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address: any) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country || 'Ethiopia',
    });
    setSelectedAddressId(address._id);
    setUseNewAddress(false);
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '32px', color: '#a65b2b' }}>Checkout</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
          {/* Left Column - Forms */}
          <div>
            {/* Shipping Address */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>Shipping Address</h2>

              {savedAddresses.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>
                    <input
                      type="radio"
                      checked={!useNewAddress}
                      onChange={() => setUseNewAddress(false)}
                      style={{ marginRight: '8px' }}
                    />
                    Use saved address
                  </label>
                  {!useNewAddress && (
                    <div style={{ marginLeft: '24px', marginBottom: '16px' }}>
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr._id}
                          onClick={() => handleAddressSelect(addr)}
                          style={{
                            padding: '12px',
                            border: selectedAddressId === addr._id ? '2px solid #a65b2b' : '1px solid #ddd',
                            borderRadius: '8px',
                            marginBottom: '8px',
                            cursor: 'pointer',
                            background: selectedAddressId === addr._id ? '#fef3e8' : 'white',
                          }}
                        >
                          <div style={{ fontWeight: '600' }}>{addr.fullName}</div>
                          <div style={{ fontSize: '14px', color: '#666' }}>
                            {addr.address}, {addr.city}, {addr.state} {addr.zipCode}
                          </div>
                          <div style={{ fontSize: '14px', color: '#666' }}>{addr.phone}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <label style={{ display: 'block', marginTop: '12px', fontWeight: '600' }}>
                    <input
                      type="radio"
                      checked={useNewAddress}
                      onChange={() => setUseNewAddress(true)}
                      style={{ marginRight: '8px' }}
                    />
                    Use new address
                  </label>
                </div>
              )}

              {useNewAddress && (
                <form>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Zip Code</label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        required
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Payment Method */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>Payment Method</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: paymentMethod === 'card' ? '2px solid #a65b2b' : '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="radio" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value as any)} style={{ marginRight: '12px' }} />
                  <span>💳 Credit/Debit Card</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: paymentMethod === 'mobile_banking' ? '2px solid #a65b2b' : '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="radio" value="mobile_banking" checked={paymentMethod === 'mobile_banking'} onChange={(e) => setPaymentMethod(e.target.value as any)} style={{ marginRight: '12px' }} />
                  <span>📱 Mobile Banking</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: paymentMethod === 'cash_on_delivery' ? '2px solid #a65b2b' : '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="radio" value="cash_on_delivery" checked={paymentMethod === 'cash_on_delivery'} onChange={(e) => setPaymentMethod(e.target.value as any)} style={{ marginRight: '12px' }} />
                  <span>💰 Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div style={{ marginTop: '20px', padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={paymentDetails.expiryDate}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={paymentDetails.cvv}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={paymentDetails.cardholderName}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardholderName: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'mobile_banking' && (
                <div style={{ marginTop: '20px', padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Provider</label>
                    <select
                      value={paymentDetails.mobileProvider}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, mobileProvider: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                    >
                      <option value="">Select provider</option>
                      <option value="m-pesa">M-Pesa</option>
                      <option value="telebirr">Telebirr</option>
                      <option value="m-birr">M-Birr</option>
                      <option value="cbe-birr">CBE Birr</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="0912345678"
                      value={paymentDetails.mobileNumber}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, mobileNumber: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: '20px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>Order Summary</h2>

              <div style={{ marginBottom: '20px' }}>
                {cartItems.map((item) => (
                  <div key={item.artwork._id} style={{ display: 'flex', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                    <img src={item.artwork.imageUrl} alt={item.artwork.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.artwork.title}</div>
                      <div style={{ fontSize: '14px', color: '#666' }}>Qty: {item.quantity}</div>
                      <div style={{ fontWeight: '600', color: '#a65b2b', marginTop: '4px' }}>${((item.artwork.price || 0) * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', paddingTop: '12px', borderTop: '2px solid #eee' }}>
                  <span>Total</span>
                  <span style={{ color: '#a65b2b' }}>${total.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: loading ? '#ccc' : '#a65b2b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                </button>
              </form>
            </div>
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

