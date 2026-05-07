import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD, TAX_RATE } from '../constants/cart';

const STORAGE_KEY = 'cart_items';

// ── Persistence ──────────────────────────────────────────────────────────────

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// ── Mutations (pure – return new arrays) ─────────────────────────────────────

export function addItem(items: CartItem[], product: Product, qty = 1): CartItem[] {
  const existing = items.find((i) => i.product.id === product.id);
  if (existing) {
    return items.map((i) =>
      i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i,
    );
  }
  return [...items, { product, quantity: qty }];
}

export function removeItem(items: CartItem[], productId: string): CartItem[] {
  return items.filter((i) => i.product.id !== productId);
}

export function updateQuantity(
  items: CartItem[],
  productId: string,
  quantity: number,
): CartItem[] {
  if (quantity <= 0) return removeItem(items, productId);
  return items.map((i) =>
    i.product.id === productId ? { ...i, quantity } : i,
  );
}

// ── Calculations ─────────────────────────────────────────────────────────────

export function getSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
}

export function getShippingCost(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

export function getTax(subtotal: number): number {
  return subtotal * TAX_RATE;
}

export function getTotal(items: CartItem[]): number {
  const subtotal = getSubtotal(items);
  return subtotal + getShippingCost(subtotal) + getTax(subtotal);
}
