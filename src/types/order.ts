import type { CartItem } from './cart';

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderData {
  orderNumber: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  estimatedDelivery: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
}
