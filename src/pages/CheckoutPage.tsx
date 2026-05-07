import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import {
  getSubtotal,
  getShippingCost,
  getTax,
} from '../services/cartService';
import {
  DELIVERY_DAYS_MIN,
  DELIVERY_DAYS_MAX,
  ORDER_SESSION_KEY,
} from '../constants/cart';
import type { OrderData, ShippingAddress } from '../types/order';

// ── Types ─────────────────────────────────────────────────────────────────────

type CheckoutStep = 'contact' | 'shipping' | 'payment';

interface ContactData {
  name: string;
  email: string;
  phone: string;
}

interface ShippingData {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PaymentData {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

type FormErrors = Partial<Record<string, string>>;

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: 'contact', label: 'Contact' },
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
];

// ── Validators ────────────────────────────────────────────────────────────────

function validateContact(d: ContactData): FormErrors {
  const e: FormErrors = {};
  if (!d.name.trim()) e.name = 'Full name is required';
  if (!d.email.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = 'Enter a valid email';
  if (!d.phone.trim()) e.phone = 'Phone number is required';
  else if (!/^\+?[\d\s\-().]{7,}$/.test(d.phone)) e.phone = 'Enter a valid phone number';
  return e;
}

function validateShipping(d: ShippingData): FormErrors {
  const e: FormErrors = {};
  if (!d.address1.trim()) e.address1 = 'Address is required';
  if (!d.city.trim()) e.city = 'City is required';
  if (!d.state.trim()) e.state = 'State / Province is required';
  if (!d.zip.trim()) e.zip = 'ZIP / Postal code is required';
  if (!d.country.trim()) e.country = 'Country is required';
  return e;
}

function validatePayment(d: PaymentData): FormErrors {
  const e: FormErrors = {};
  if (!d.cardholderName.trim()) e.cardholderName = 'Cardholder name is required';
  const digits = d.cardNumber.replace(/\s/g, '');
  if (!digits) e.cardNumber = 'Card number is required';
  else if (!/^\d{16}$/.test(digits)) e.cardNumber = 'Card number must be 16 digits';
  if (!d.expiry.trim()) e.expiry = 'Expiry date is required';
  else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(d.expiry)) e.expiry = 'Use MM/YY format';
  if (!d.cvv.trim()) e.cvv = 'CVV is required';
  else if (!/^\d{3,4}$/.test(d.cvv)) e.cvv = 'CVV must be 3 or 4 digits';
  return e;
}

// ── Formatters ────────────────────────────────────────────────────────────────

function formatCardNumber(raw: string) {
  return raw
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}

function inputCls(error?: string) {
  return [
    'w-full px-3 py-2 text-sm rounded-xl border bg-white dark:bg-gray-800',
    'text-gray-900 dark:text-gray-100 placeholder:text-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors duration-150',
    error
      ? 'border-rose-400 dark:border-rose-500'
      : 'border-gray-200 dark:border-gray-700',
  ].join(' ');
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, clearCart } = useCart();

  const [step, setStep] = useState<CheckoutStep>('contact');
  const [contact, setContact] = useState<ContactData>({ name: '', email: '', phone: '' });
  const [shipping, setShipping] = useState<ShippingData>({
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [payment, setPayment] = useState<PaymentData>({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Redirect to cart if empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Your cart is empty. Add some items before checking out.
        </p>
        <a
          href="#/products"
          className="px-6 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 transition-colors"
        >
          Browse Products
        </a>
      </div>
    );
  }

  const subtotal = getSubtotal(items);
  const shippingCost = getShippingCost(subtotal);
  const tax = getTax(subtotal);
  const total = subtotal + shippingCost + tax;

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  // ── Advance / Back ──────────────────────────────────────────────────────────

  function handleNext() {
    let errs: FormErrors = {};
    if (step === 'contact') errs = validateContact(contact);
    if (step === 'shipping') errs = validateShipping(shipping);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStep(STEPS[stepIndex + 1].key);
    }
  }

  function handleBack() {
    setErrors({});
    setStep(STEPS[stepIndex - 1].key);
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validatePayment(payment);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsProcessing(true);
    setSubmitError('');

    try {
      // Mock async processing delay
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));

      const orderNumber =
        'ORD-' + Math.random().toString(36).slice(2, 9).toUpperCase();

      const today = new Date();
      const deliveryOffset =
        DELIVERY_DAYS_MIN +
        Math.floor(Math.random() * (DELIVERY_DAYS_MAX - DELIVERY_DAYS_MIN + 1));
      const deliveryDate = new Date(
        today.getTime() + deliveryOffset * 24 * 60 * 60 * 1000,
      );
      const estimatedDelivery = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const shippingAddress: ShippingAddress = {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        ...shipping,
      };

      const orderData: OrderData = {
        orderNumber,
        items: items.map((i) => ({ ...i })),
        shippingAddress,
        estimatedDelivery,
        subtotal,
        tax,
        shippingCost,
        total,
      };

      sessionStorage.setItem(ORDER_SESSION_KEY, JSON.stringify(orderData));

      // Clear sensitive payment data (was only in local state)
      setPayment({ cardholderName: '', cardNumber: '', expiry: '', cvv: '' });

      // Clear cart
      clearCart();

      window.location.hash = '#/order-confirmation';
    } catch {
      setSubmitError('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  }

  // ── Keyboard: advance step on Enter in non-textarea fields ─────────────────

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && step !== 'payment') {
      e.preventDefault();
      handleNext();
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Checkout</h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8 items-start">
          {/* ── Form panel ───────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* Step indicator */}
            <nav aria-label="Checkout steps" className="mb-8">
              <ol className="flex items-center gap-0">
                {STEPS.map((s, idx) => {
                  const isCompleted = idx < stepIndex;
                  const isCurrent = s.key === step;
                  return (
                    <li key={s.key} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={[
                            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-violet-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
                          ].join(' ')}
                          aria-current={isCurrent ? 'step' : undefined}
                        >
                          {isCompleted ? (
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <span
                          className={[
                            'mt-1 text-xs font-medium',
                            isCurrent
                              ? 'text-violet-600 dark:text-violet-400'
                              : isCompleted
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-gray-400 dark:text-gray-500',
                          ].join(' ')}
                        >
                          {s.label}
                        </span>
                      </div>
                      {idx < STEPS.length - 1 && (
                        <div
                          className={[
                            'h-0.5 flex-1 mx-2 mb-5 transition-colors',
                            isCompleted
                              ? 'bg-emerald-400'
                              : 'bg-gray-200 dark:bg-gray-700',
                          ].join(' ')}
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>

            {/* Form card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              {/* ── Contact ──────────────────────────────────────────── */}
              {step === 'contact' && (
                <div onKeyDown={handleKeyDown}>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-5">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <Field id="co-name" label="Full Name" error={errors.name}>
                      <input
                        id="co-name"
                        type="text"
                        autoComplete="name"
                        value={contact.name}
                        onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Jane Smith"
                        className={inputCls(errors.name)}
                      />
                    </Field>
                    <Field id="co-email" label="Email Address" error={errors.email}>
                      <input
                        id="co-email"
                        type="email"
                        autoComplete="email"
                        value={contact.email}
                        onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                        placeholder="jane@example.com"
                        className={inputCls(errors.email)}
                      />
                    </Field>
                    <Field id="co-phone" label="Phone Number" error={errors.phone}>
                      <input
                        id="co-phone"
                        type="tel"
                        autoComplete="tel"
                        value={contact.phone}
                        onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="+1 555 000 0000"
                        className={inputCls(errors.phone)}
                      />
                    </Field>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 transition-colors"
                    >
                      Continue to Shipping
                    </button>
                  </div>
                </div>
              )}

              {/* ── Shipping ─────────────────────────────────────────── */}
              {step === 'shipping' && (
                <div onKeyDown={handleKeyDown}>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-5">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <Field id="sh-address1" label="Address Line 1" error={errors.address1}>
                      <input
                        id="sh-address1"
                        type="text"
                        autoComplete="address-line1"
                        value={shipping.address1}
                        onChange={(e) => setShipping((p) => ({ ...p, address1: e.target.value }))}
                        placeholder="123 Main St"
                        className={inputCls(errors.address1)}
                      />
                    </Field>
                    <Field id="sh-address2" label="Address Line 2 (optional)" error={errors.address2}>
                      <input
                        id="sh-address2"
                        type="text"
                        autoComplete="address-line2"
                        value={shipping.address2}
                        onChange={(e) => setShipping((p) => ({ ...p, address2: e.target.value }))}
                        placeholder="Apt 4B"
                        className={inputCls(errors.address2)}
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field id="sh-city" label="City" error={errors.city}>
                        <input
                          id="sh-city"
                          type="text"
                          autoComplete="address-level2"
                          value={shipping.city}
                          onChange={(e) => setShipping((p) => ({ ...p, city: e.target.value }))}
                          placeholder="New York"
                          className={inputCls(errors.city)}
                        />
                      </Field>
                      <Field id="sh-state" label="State / Province" error={errors.state}>
                        <input
                          id="sh-state"
                          type="text"
                          autoComplete="address-level1"
                          value={shipping.state}
                          onChange={(e) => setShipping((p) => ({ ...p, state: e.target.value }))}
                          placeholder="NY"
                          className={inputCls(errors.state)}
                        />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field id="sh-zip" label="ZIP / Postal Code" error={errors.zip}>
                        <input
                          id="sh-zip"
                          type="text"
                          autoComplete="postal-code"
                          value={shipping.zip}
                          onChange={(e) => setShipping((p) => ({ ...p, zip: e.target.value }))}
                          placeholder="10001"
                          className={inputCls(errors.zip)}
                        />
                      </Field>
                      <Field id="sh-country" label="Country" error={errors.country}>
                        <input
                          id="sh-country"
                          type="text"
                          autoComplete="country-name"
                          value={shipping.country}
                          onChange={(e) => setShipping((p) => ({ ...p, country: e.target.value }))}
                          placeholder="United States"
                          className={inputCls(errors.country)}
                        />
                      </Field>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* ── Payment ──────────────────────────────────────────── */}
              {step === 'payment' && (
                <form onSubmit={handleSubmit} noValidate>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Payment Details
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
                    Mock checkout — no real payment is processed.
                  </p>

                  <div className="space-y-4">
                    <Field id="py-name" label="Cardholder Name" error={errors.cardholderName}>
                      <input
                        id="py-name"
                        type="text"
                        autoComplete="cc-name"
                        value={payment.cardholderName}
                        onChange={(e) =>
                          setPayment((p) => ({ ...p, cardholderName: e.target.value }))
                        }
                        placeholder="Jane Smith"
                        className={inputCls(errors.cardholderName)}
                      />
                    </Field>
                    <Field id="py-card" label="Card Number" error={errors.cardNumber}>
                      <input
                        id="py-card"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        value={payment.cardNumber}
                        onChange={(e) =>
                          setPayment((p) => ({
                            ...p,
                            cardNumber: formatCardNumber(e.target.value),
                          }))
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={inputCls(errors.cardNumber)}
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field id="py-expiry" label="Expiry (MM/YY)" error={errors.expiry}>
                        <input
                          id="py-expiry"
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          value={payment.expiry}
                          onChange={(e) =>
                            setPayment((p) => ({
                              ...p,
                              expiry: formatExpiry(e.target.value),
                            }))
                          }
                          placeholder="MM/YY"
                          maxLength={5}
                          className={inputCls(errors.expiry)}
                        />
                      </Field>
                      <Field id="py-cvv" label="CVV" error={errors.cvv}>
                        <input
                          id="py-cvv"
                          type="password"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          value={payment.cvv}
                          onChange={(e) =>
                            setPayment((p) => ({
                              ...p,
                              cvv: e.target.value.replace(/\D/g, '').slice(0, 4),
                            }))
                          }
                          placeholder="•••"
                          maxLength={4}
                          className={inputCls(errors.cvv)}
                        />
                      </Field>
                    </div>
                  </div>

                  {submitError && (
                    <p role="alert" className="mt-4 text-sm text-rose-600 dark:text-rose-400">
                      {submitError}
                    </p>
                  )}

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={isProcessing}
                      className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                    >
                      {isProcessing ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Processing…
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ── Order summary sidebar ─────────────────────────────────── */}
          <div className="mt-8 lg:mt-0 lg:sticky lg:top-24">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Order Summary
              </h2>

              <ul className="space-y-3 mb-4">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={product.imageUrl}
                        alt={product.imageAlt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://placehold.co/40x40?text=?';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-gray-400">Qty: {quantity}</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      ${(product.price * quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="space-y-2 text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
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
                <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                  <dt className="font-semibold text-gray-900 dark:text-gray-100">Total</dt>
                  <dd className="font-bold text-gray-900 dark:text-gray-100">
                    ${total.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
