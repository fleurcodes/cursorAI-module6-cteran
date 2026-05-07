/** Flat-rate shipping cost in USD */
export const SHIPPING_COST = 9.99;

/** Orders at or above this threshold qualify for free shipping */
export const FREE_SHIPPING_THRESHOLD = 75;

/** Tax rate applied to the order subtotal */
export const TAX_RATE = 0.08;

/** Estimated delivery window in days (min / max) */
export const DELIVERY_DAYS_MIN = 5;
export const DELIVERY_DAYS_MAX = 7;

/** sessionStorage key used for persisting the most recent confirmed order */
export const ORDER_SESSION_KEY = 'last_order';
