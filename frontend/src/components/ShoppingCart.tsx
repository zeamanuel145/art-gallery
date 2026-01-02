'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const handleRemove = (artworkId: string, title: string) => {
    removeFromCart(artworkId);
    showToast(`${title} removed from cart`, 'info');
  };

  const handleQuantityChange = (artworkId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(artworkId, newQuantity);
  };

  const handleClearCart = () => {
    clearCart();
    showToast('Cart cleared', 'info');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h2 className="cart-title">Shopping Cart</h2>
          <button className="cart-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p className="cart-empty-text">Your cart is empty</p>
              <button className="cart-empty-btn" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.artwork._id} className="cart-item">
                    <div className="cart-item-image">
                      <img
                        src={item.artwork.imageUrl}
                        alt={item.artwork.title}
                        className="cart-item-img"
                      />
                    </div>
                    <div className="cart-item-details">
                      <h3 className="cart-item-title">{item.artwork.title}</h3>
                      <p className="cart-item-artist">by {item.artwork.artist.username}</p>
                      <p className="cart-item-price">${item.artwork.price}</p>
                      
                      <div className="cart-item-controls">
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.artwork._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.artwork._id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemove(item.artwork._id, item.artwork.title)}
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="cart-item-total">
                        Subtotal: ${((item.artwork.price || 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <span className="cart-total-label">Total:</span>
                  <span className="cart-total-value">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="cart-actions">
                  <button className="clear-cart-btn" onClick={handleClearCart}>
                    Clear Cart
                  </button>
                  <button 
                    className="checkout-btn" 
                    onClick={() => {
                      onClose();
                      router.push('/checkout');
                    }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9998;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 500px;
          background: white;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .cart-title {
          font-size: 24px;
          font-weight: bold;
          color: #a65b2b;
          margin: 0;
        }

        .cart-close-btn {
          background: none;
          border: none;
          font-size: 32px;
          color: #666;
          cursor: pointer;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .cart-close-btn:hover {
          background: #f3f4f6;
        }

        .cart-content {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .cart-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          text-align: center;
        }

        .cart-empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .cart-empty-text {
          font-size: 18px;
          color: #666;
          margin-bottom: 24px;
        }

        .cart-empty-btn {
          background: #a65b2b;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .cart-empty-btn:hover {
          background: #8f4a20;
        }

        .cart-items {
          padding: 16px;
          flex: 1;
          overflow-y: auto;
        }

        .cart-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 16px;
          background: #f9fafb;
        }

        .cart-item-image {
          flex-shrink: 0;
          width: 100px;
          height: 100px;
          border-radius: 8px;
          overflow: hidden;
        }

        .cart-item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cart-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cart-item-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .cart-item-artist {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .cart-item-price {
          font-size: 16px;
          font-weight: 600;
          color: #a65b2b;
          margin: 0;
        }

        .cart-item-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 4px;
        }

        .quantity-btn {
          background: white;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          font-size: 18px;
          font-weight: bold;
          color: #333;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .quantity-btn:hover:not(:disabled) {
          background: #f3f4f6;
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-value {
          min-width: 32px;
          text-align: center;
          font-weight: 600;
          color: #333;
        }

        .remove-btn {
          background: none;
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .remove-btn:hover {
          background: #ef4444;
          color: white;
        }

        .cart-item-total {
          font-size: 14px;
          font-weight: 600;
          color: #666;
          margin-top: 4px;
        }

        .cart-footer {
          border-top: 1px solid #e5e7eb;
          padding: 24px;
          background: white;
        }

        .cart-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }

        .cart-total-label {
          font-size: 20px;
          font-weight: 600;
          color: #333;
        }

        .cart-total-value {
          font-size: 24px;
          font-weight: bold;
          color: #a65b2b;
        }

        .cart-actions {
          display: flex;
          gap: 12px;
        }

        .clear-cart-btn {
          flex: 1;
          background: white;
          border: 2px solid #d1d5db;
          color: #666;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-cart-btn:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        .checkout-btn {
          flex: 2;
          background: #a65b2b;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .checkout-btn:hover {
          background: #8f4a20;
        }

        :root.dark .cart-drawer {
          background: #3d2914;
        }

        :root.dark .cart-header {
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        :root.dark .cart-title {
          color: #a65b2b;
        }

        :root.dark .cart-close-btn {
          color: #ccc;
        }

        :root.dark .cart-close-btn:hover {
          background: #4a3319;
          color: white;
        }

        :root.dark .cart-empty-text {
          color: #ccc;
        }

        :root.dark .cart-item {
          background: #4a3319;
          border-color: rgba(255, 255, 255, 0.1);
        }

        :root.dark .cart-item-title {
          color: white;
        }

        :root.dark .cart-item-artist {
          color: #ccc;
        }

        :root.dark .cart-item-price {
          color: #a65b2b;
        }

        :root.dark .quantity-controls {
          border-color: rgba(255, 255, 255, 0.2);
        }

        :root.dark .quantity-btn {
          background: #3d2914;
          color: white;
        }

        :root.dark .quantity-btn:hover:not(:disabled) {
          background: #4a3319;
        }

        :root.dark .quantity-value {
          color: white;
        }

        :root.dark .cart-item-total {
          color: #ccc;
        }

        :root.dark .cart-footer {
          background: #3d2914;
          border-top-color: rgba(255, 255, 255, 0.1);
        }

        :root.dark .cart-total {
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        :root.dark .cart-total-label {
          color: white;
        }

        :root.dark .clear-cart-btn {
          background: #4a3319;
          border-color: rgba(255, 255, 255, 0.2);
          color: #ccc;
        }

        :root.dark .clear-cart-btn:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        @media (max-width: 640px) {
          .cart-drawer {
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
}

