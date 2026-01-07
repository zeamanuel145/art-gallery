'use client';

import React from 'react';
import { CartProvider } from '../contexts/CartContext';
import { ToastProvider } from '../contexts/ToastContext';
import ToastContainer from './ToastContainer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>
        {children}
        <ToastContainer />
      </ToastProvider>
    </CartProvider>
  );
}

