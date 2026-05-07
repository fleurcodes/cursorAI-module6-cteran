import { useState } from 'react';
import type { ProductCardProps } from '../../types/product'
import RatingStars from './RatingStars';

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null;

  function handleAddToCart() {
    if (!product.inStock || added) return;
    setAdded(true);
    onAddToCart?.(product);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article
      className="
        group relative flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md
        overflow-hidden border border-gray-100 dark:border-gray-700
        transition-all duration-300 ease-in-out
        hover:shadow-xl hover:-translate-y-1
      "
      aria-label={product.title}
      data-testid="product-card"
      data-product-id={product.id}
      data-product-category={product.category}
    >
      {/* Badge */}
      {product.badge && (
        <span
          className="
            absolute top-3 left-3 z-10 px-2.5 py-1 text-xs font-semibold
            rounded-full bg-violet-600 text-white shadow-sm select-none
          "
          aria-label={`Badge: ${product.badge}`}
        >
          {product.badge}
        </span>
      )}

      {/* Discount badge */}
      {discount && (
        <span
          className="
            absolute top-3 right-3 z-10 px-2 py-1 text-xs font-bold
            rounded-full bg-rose-500 text-white shadow-sm select-none
          "
          aria-label={`${discount}% off`}
        >
          -{discount}%
        </span>
      )}

      {/* Product image */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-700 aspect-square">
        {!imgError ? (
          <img
            src={product.imageUrl}
            alt={product.imageAlt}
            className="
              w-full h-full object-cover
              transition-transform duration-500 ease-in-out
              group-hover:scale-105
            "
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700"
            aria-label={`Image unavailable for ${product.title}`}
          >
            <svg
              className="w-16 h-16 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title */}
        <h2
          className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 min-h-[2.5rem]"
          title={product.title}
          data-testid="product-title"
        >
          {product.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Rating */}
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span
            className="text-xl font-bold text-gray-900 dark:text-gray-100"
            aria-label={`Price: $${product.price.toFixed(2)}`}
            data-testid="product-price"
            data-price={product.price}
          >
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span
              className="text-sm text-gray-400 line-through"
              aria-label={`Original price: $${product.originalPrice.toFixed(2)}`}
            >
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock || added}
          aria-disabled={!product.inStock || added}
          aria-label={
            !product.inStock
              ? `${product.title} is out of stock`
              : added
              ? 'Added to cart'
              : `Add ${product.title} to cart`
          }
          className="
            mt-1 w-full py-2.5 px-4 rounded-xl text-sm font-semibold
            transition-all duration-200 ease-in-out
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2
            disabled:cursor-not-allowed
            active:scale-95
            "
          style={{
            backgroundColor: !product.inStock
              ? '#e5e7eb'
              : added
              ? '#16a34a'
              : '#7c3aed',
            color: !product.inStock ? '#9ca3af' : '#ffffff',
          }}
        >
          {!product.inStock ? (
            'Out of Stock'
          ) : added ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Added!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Add to Cart
            </span>
          )}
        </button>
      </div>
    </article>
  );
}
