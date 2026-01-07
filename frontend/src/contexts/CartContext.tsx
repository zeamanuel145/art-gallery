'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Artwork, api } from '../lib/api';

export interface CartItem {
  artwork: Artwork;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (artwork: Artwork) => Promise<void>;
  removeFromCart: (artworkId: string) => Promise<void>;
  updateQuantity: (artworkId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isInCart: (artworkId: string) => boolean;
  isLoading: boolean;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from backend when user is logged in
  const syncCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If not logged in, try to load from localStorage as fallback
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error);
        }
      }
      return;
    }

    try {
      setIsLoading(true);
      const cartData = await api.getCart();
      
      if (cartData && cartData.items) {
        const items: CartItem[] = cartData.items.map((item: any) => ({
          artwork: item.artwork,
          quantity: item.quantity,
        }));
        setCartItems(items);
        localStorage.setItem('cart', JSON.stringify(items));
      }
    } catch (error) {
      console.error('Failed to sync cart from backend:', error);
      // Fallback to localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to load cart from localStorage:', e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart on mount
  useEffect(() => {
    syncCart();
  }, []);

  const addToCart = async (artwork: Artwork) => {
    // Only add artworks that are for sale and not sold
    if (!artwork.forSale || artwork.sold || !artwork.price) {
      return;
    }

    const token = localStorage.getItem('token');
    const existingItem = cartItems.find((item) => item.artwork._id === artwork._id);
    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

    // Optimistic update
    setCartItems((prevItems) => {
      if (existingItem) {
        return prevItems.map((item) =>
          item.artwork._id === artwork._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { artwork, quantity: 1 }];
      }
    });

    // Sync with backend if logged in
    if (token) {
      try {
        await api.addToCart(artwork._id, newQuantity);
        await syncCart(); // Refresh from backend
      } catch (error) {
        console.error('Failed to add item to cart on backend:', error);
        // Revert optimistic update on error
        setCartItems((prevItems) => {
          if (existingItem) {
            return prevItems.map((item) =>
              item.artwork._id === artwork._id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            );
          } else {
            return prevItems.filter((item) => item.artwork._id !== artwork._id);
          }
        });
      }
    } else {
      // Save to localStorage if not logged in
      const updatedItems = existingItem
        ? cartItems.map((item) =>
            item.artwork._id === artwork._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...cartItems, { artwork, quantity: 1 }];
      localStorage.setItem('cart', JSON.stringify(updatedItems));
    }
  };

  const removeFromCart = async (artworkId: string) => {
    // Optimistic update
    const previousItems = cartItems;
    setCartItems((prevItems) => prevItems.filter((item) => item.artwork._id !== artworkId));

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.removeFromCart(artworkId);
        await syncCart(); // Refresh from backend
      } catch (error) {
        console.error('Failed to remove item from cart on backend:', error);
        // Revert on error
        setCartItems(previousItems);
      }
    } else {
      const updatedItems = cartItems.filter((item) => item.artwork._id !== artworkId);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
    }
  };

  const updateQuantity = async (artworkId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(artworkId);
      return;
    }

    // Optimistic update
    const previousItems = cartItems;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.artwork._id === artworkId ? { ...item, quantity } : item
      )
    );

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.updateCartItemQuantity(artworkId, quantity);
        await syncCart(); // Refresh from backend
      } catch (error) {
        console.error('Failed to update cart item quantity on backend:', error);
        // Revert on error
        setCartItems(previousItems);
      }
    } else {
      const updatedItems = cartItems.map((item) =>
        item.artwork._id === artworkId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedItems));
    }
  };

  const clearCart = async () => {
    // Optimistic update
    const previousItems = cartItems;
    setCartItems([]);

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.clearCart();
        await syncCart(); // Refresh from backend
      } catch (error) {
        console.error('Failed to clear cart on backend:', error);
        // Revert on error
        setCartItems(previousItems);
      }
    } else {
      localStorage.removeItem('cart');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.artwork.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (artworkId: string) => {
    return cartItems.some((item) => item.artwork._id === artworkId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isInCart,
        isLoading,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

