import { useCart } from '../contexts/CartContext';
import {
  getSubtotal,
  getShippingCost,
  getTax,
} from '../services/cartService';
import { FREE_SHIPPING_THRESHOLD } from '../constants/cart';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalCount } = useCart();

  const subtotal = getSubtotal(items);
  const shippingCost = getShippingCost(subtotal);
  const tax = getTax(subtotal);
  const total = subtotal + shippingCost + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Shopping Cart{totalCount > 0 && (
            <span className="ml-2 text-base font-normal text-gray-500 dark:text-gray-400">
              ({totalCount} item{totalCount !== 1 ? 's' : ''})
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          /* ── Empty state ───────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg
              className="w-20 h-20 text-gray-300 dark:text-gray-700 mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Looks like you haven't added anything yet.
            </p>
            <a
              href="#/products"
              className="px-6 py-3 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 transition-colors duration-200"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          /* ── Cart with items ───────────────────────────────────────── */
          <div className="lg:grid lg:grid-cols-3 lg:gap-8 items-start">
            {/* ── Item list ────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  {/* Thumbnail */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={product.imageUrl}
                      alt={product.imageAlt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://placehold.co/96x96?text=No+Image';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                          {product.title}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {product.category}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        ${(product.price * quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-1" role="group" aria-label={`Quantity for ${product.title}`}>
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8z" />
                          </svg>
                        </button>

                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={quantity}
                          aria-label={`Quantity: ${quantity}`}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val >= 1) updateQuantity(product.id, val);
                          }}
                          className="w-10 text-center text-sm font-medium bg-transparent text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg py-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5z" />
                          </svg>
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        aria-label={`Remove ${product.title} from cart`}
                        className="text-xs text-rose-500 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order summary ────────────────────────────────────── */}
            <div className="mt-8 lg:mt-0 lg:sticky lg:top-24">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Order Summary
                </h2>

                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Subtotal</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">
                      ${subtotal.toFixed(2)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Shipping</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">
                      {shippingCost === 0 ? (
                        <span className="text-emerald-600">Free</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Tax (8%)</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">
                      ${tax.toFixed(2)}
                    </dd>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3 flex justify-between">
                    <dt className="font-semibold text-gray-900 dark:text-gray-100">Total</dt>
                    <dd className="font-bold text-gray-900 dark:text-gray-100 text-base">
                      ${total.toFixed(2)}
                    </dd>
                  </div>
                </dl>

                <a
                  href="#/checkout"
                  className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 transition-colors duration-200"
                >
                  Proceed to Checkout
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>

                <a
                  href="#/products"
                  className="mt-3 w-full flex items-center justify-center text-sm text-violet-600 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded py-1 transition-colors"
                >
                  ← Continue Shopping
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
