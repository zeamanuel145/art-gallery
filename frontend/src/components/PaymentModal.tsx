'use client';

import { useState } from 'react';

interface PaymentModalProps {
  artwork: {
    title: string;
    price: number;
    artist: { username: string };
  };
  user: { email: string } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ artwork, user, onClose, onSuccess }: PaymentModalProps) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
  });
  const [processing, setProcessing] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    
    // Validate email matches logged-in user
    if (user && formData.email.toLowerCase() !== user.email.toLowerCase()) {
      setEmailError('Wrong email. Please use your registered email address.');
      return;
    }
    
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay text-black" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Complete Purchase</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="artwork-info">
          <h3>{artwork.title}</h3>
          <p>by {artwork.artist.username}</p>
          <div className="price">${artwork.price}</div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="your@email.com"
              className={emailError ? 'error' : ''}
            />
            {emailError && <div className="error-message">{emailError}</div>}
          </div>

          <div className="form-group">
            <label>Cardholder Name</label>
            <input
              type="text"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleInputChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              required
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                required
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>

          <button type="submit" className="pay-btn" disabled={processing}>
            {processing ? 'Processing...' : `Pay $${artwork.price}`}
          </button>
        </form>
      </div>

      <style jsx>{`
        

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 450px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #f0f0f0;
        }

        .modal-header h2 {
          margin: 0;
          color: #000;
          font-size: 20px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .artwork-info {
          padding: 20px 24px;
          border-bottom: 1px solid #f0f0f0;
          text-align: center;
        }

        .artwork-info h3 {
          margin: 0 0 8px 0;
          color: #a65b2b;
          font-size: 18px;
        }

        .artwork-info p {
          margin: 0 0 12px 0;
          color: #666;
          font-size: 14px;
        }

        .price {
          font-size: 24px;
          font-weight: bold;
          color: #a65b2b;
        }

        .payment-form {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-row {
          display: flex;
          gap: 12px;
        }

        .form-row .form-group {
          flex: 1;
        }

        label {
          display: block;
          margin-bottom: 6px;
          color: #333;
          font-weight: 600;
          font-size: 14px;
        }

        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        input:focus {
          outline: none;
          border-color: #a65b2b;
        }

        input.error {
          border-color: #e74c3c;
        }

        .error-message {
          color: #e74c3c;
          font-size: 12px;
          margin-top: 4px;
        }

        .pay-btn {
          width: 100%;
          background: #a65b2b;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .pay-btn:hover:not(:disabled) {
          background: #8f4a20;
        }

        .pay-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        :root.dark .modal-content {
          background: #4a3319;
        }

        :root.dark .modal-header h2 {
          color: white;
        }

        :root.dark .artwork-info h3 {
          color: white;
        }

        :root.dark .artwork-info p {
          color: #ccc;
        }

        :root.dark .price {
          color: #a65b2b;
        }

        :root.dark label {
          color: white;
        }

        :root.dark input {
          background: #3d2914;
          border-color: #666;
          color: white;
        }

        :root.dark input:focus {
          border-color: #a65b2b;
        }

        :root.dark .close-btn {
          color: white;
        }
      `}</style>
    </div>
  );
}