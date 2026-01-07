'use client';

import React from 'react';
import { useToast } from '../contexts/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          <span className="toast-icon">
            {toast.type === 'success' && '✓'}
            {toast.type === 'error' && '✕'}
            {toast.type === 'warning' && '⚠'}
            {toast.type === 'info' && 'ℹ'}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}>
            ×
          </button>
        </div>
      ))}
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 400px;
        }

        .toast {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          animation: slideIn 0.3s ease-out;
          min-width: 300px;
          border-left: 4px solid;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast-success {
          border-left-color: #22c55e;
        }

        .toast-error {
          border-left-color: #ef4444;
        }

        .toast-warning {
          border-left-color: #f59e0b;
        }

        .toast-info {
          border-left-color: #3b82f6;
        }

        .toast-icon {
          font-size: 20px;
          font-weight: bold;
          flex-shrink: 0;
        }

        .toast-success .toast-icon {
          color: #22c55e;
        }

        .toast-error .toast-icon {
          color: #ef4444;
        }

        .toast-warning .toast-icon {
          color: #f59e0b;
        }

        .toast-info .toast-icon {
          color: #3b82f6;
        }

        .toast-message {
          flex: 1;
          color: #333;
          font-size: 14px;
          line-height: 1.5;
        }

        .toast-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #666;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          line-height: 1;
        }

        .toast-close:hover {
          color: #333;
        }

        :root.dark .toast {
          background: #4a3319;
          border-color: rgba(255, 255, 255, 0.1);
        }

        :root.dark .toast-message {
          color: white;
        }

        :root.dark .toast-close {
          color: #ccc;
        }

        :root.dark .toast-close:hover {
          color: white;
        }

        @media (max-width: 640px) {
          .toast-container {
            right: 10px;
            left: 10px;
            max-width: none;
          }

          .toast {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}

