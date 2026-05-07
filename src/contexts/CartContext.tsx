import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartContextValue, CartItem } from '../types/cart';
import type { Product } from '../types/product';
import * as cartService from '../services/cartService';

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => cartService.loadCart());

  // Persist to localStorage whenever items change
  useEffect(() => {
    cartService.saveCart(items);
  }, [items]);

  const addItem = (product: Product, qty = 1) => {
    setItems((prev) => cartService.addItem(prev, product, qty));
  };

  const removeItem = (productId: string) => {
    setItems((prev) => cartService.removeItem(prev, productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) => cartService.updateQuantity(prev, productId, quantity));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalCount, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
