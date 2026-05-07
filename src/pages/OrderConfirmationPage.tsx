import { useState } from 'react';
import { ORDER_SESSION_KEY } from '../constants/cart';
import type { OrderData } from '../types/order';

function loadOrder(): OrderData | null {
  try {
    const raw = sessionStorage.getItem(ORDER_SESSION_KEY);
    return raw ? (JSON.parse(raw) as OrderData) : null;
  } catch {
    return null;
  }
}

export default function OrderConfirmationPage() {
  const [order] = useState<OrderData | null>(loadOrder);

  function handleContinueShopping() {
    sessionStorage.removeItem(ORDER_SESSION_KEY);
    window.location.hash = '#/products';
  }

  // ── No order found ────────────────────────────────────────────────────────

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            No recent order found
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            It looks like you haven't placed an order yet, or your order session has ended.
          </p>
        </div>
        <a
          href="#/products"
          className="px-6 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 transition-colors"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  // ── Order confirmation ────────────────────────────────────────────────────

  const { orderNumber, items, shippingAddress, estimatedDelivery, subtotal, tax, shippingCost, total } = order;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Success header ────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Order number:{' '}
            <span className="font-mono text-violet-600 dark:text-violet-400">{orderNumber}</span>
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Estimated delivery:{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">{estimatedDelivery}</span>
          </p>
        </div>

        <div className="space-y-6">
          {/* ── Items ─────────────────────────────────────────────── */}
          <section
            aria-labelledby="items-heading"
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <h2
              id="items-heading"
              className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4"
            >
              Items Ordered
            </h2>
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={product.imageUrl}
                      alt={product.imageAlt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://placehold.co/48x48?text=?';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      Qty: {quantity} × ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    ${(product.price * quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <dl className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2 text-sm">
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
                <dt className="text-gray-500 dark:text-gray-400">Tax</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                  ${tax.toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <dt className="font-semibold text-gray-900 dark:text-gray-100">Total Charged</dt>
                <dd className="font-bold text-gray-900 dark:text-gray-100 text-base">
                  ${total.toFixed(2)}
                </dd>
              </div>
            </dl>
          </section>

          {/* ── Shipping address ──────────────────────────────────── */}
          <section
            aria-labelledby="shipping-heading"
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <h2
              id="shipping-heading"
              className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3"
            >
              Shipping To
            </h2>
            <address className="not-italic text-sm text-gray-600 dark:text-gray-400 space-y-0.5">
              <p className="font-medium text-gray-800 dark:text-gray-200">{shippingAddress.name}</p>
              <p>{shippingAddress.address1}</p>
              {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
              </p>
              <p>{shippingAddress.country}</p>
            </address>
          </section>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleContinueShopping}
            className="w-full sm:w-auto px-8 py-3 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 transition-colors duration-200"
          >
            Continue Shopping
          </button>
          <a
            href="#/"
            className="w-full sm:w-auto text-center px-8 py-3 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors duration-200"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
