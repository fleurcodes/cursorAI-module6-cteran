/**
 * searchHelpers.ts
 *
 * Reusable query builders and filter state utilities for product search tests.
 */

import type { SearchPage, SortOption, PriceRange, ProductCategory } from '../../pages/SearchPage';

// ---------------------------------------------------------------------------
// Product data mirrors (source of truth for assertions)
// ---------------------------------------------------------------------------

export interface ProductFixture {
  id: string;
  title: string;
  price: number;
  rating: number;
  category: ProductCategory;
}

/** All sample products defined in ProductDemoPage, ordered by id. */
export const ALL_PRODUCTS: ProductFixture[] = [
  { id: '1', title: 'Wireless Noise-Cancelling Headphones Pro', price: 79.99,  rating: 4.7, category: 'Audio' },
  { id: '2', title: 'Minimalist Leather Watch',                  price: 149.00, rating: 4.5, category: 'Wearables' },
  { id: '3', title: 'Portable Bluetooth Speaker',                price: 49.95,  rating: 4.3, category: 'Audio' },
  { id: '4', title: 'Ergonomic Mechanical Keyboard',             price: 119.00, rating: 4.8, category: 'Peripherals' },
  { id: '5', title: 'Ultra-Wide 4K Monitor 34"',                 price: 549.00, rating: 4.6, category: 'Displays' },
  { id: '6', title: 'Smart Fitness Tracker Band',                price: 34.99,  rating: 3.9, category: 'Fitness' },
];

// ---------------------------------------------------------------------------
// Query builders
// ---------------------------------------------------------------------------

export interface FilterState {
  search?: string;
  category?: ProductCategory;
  priceRange?: PriceRange;
  sort?: SortOption;
}

/**
 * Apply a complete filter state to the SearchPage POM in a single call.
 * Only the provided fields are changed; others are left at their current values.
 */
export async function applyFilters(searchPage: SearchPage, state: FilterState): Promise<void> {
  if (state.search !== undefined) {
    await searchPage.search(state.search);
  }
  if (state.category !== undefined) {
    await searchPage.selectCategory(state.category);
  }
  if (state.priceRange !== undefined) {
    await searchPage.selectPriceRange(state.priceRange);
  }
  if (state.sort !== undefined) {
    await searchPage.selectSort(state.sort);
  }
}

// ---------------------------------------------------------------------------
// Filter-state utilities
// ---------------------------------------------------------------------------

/** Return products that would survive an in-memory search query. */
export function filterBySearch(products: ProductFixture[], query: string): ProductFixture[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q),
  );
}

/** Return products belonging to the given category. */
export function filterByCategory(
  products: ProductFixture[],
  category: ProductCategory,
): ProductFixture[] {
  if (category === 'all') return products;
  return products.filter((p) => p.category === category);
}

/** Return products within the given price range. */
export function filterByPriceRange(
  products: ProductFixture[],
  range: PriceRange,
): ProductFixture[] {
  switch (range) {
    case 'under-50':  return products.filter((p) => p.price < 50);
    case '50-100':    return products.filter((p) => p.price >= 50 && p.price <= 100);
    case '100-200':   return products.filter((p) => p.price > 100 && p.price <= 200);
    case 'over-200':  return products.filter((p) => p.price > 200);
    default:          return products;
  }
}

/** Sort products according to the given sort option. */
export function sortProducts(
  products: ProductFixture[],
  option: SortOption,
): ProductFixture[] {
  const copy = [...products];
  switch (option) {
    case 'price-asc':   return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':  return copy.sort((a, b) => b.price - a.price);
    case 'name-asc':    return copy.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-desc':   return copy.sort((a, b) => b.title.localeCompare(a.title));
    case 'rating-desc': return copy.sort((a, b) => b.rating - a.rating);
    default:            return copy;
  }
}

/** Convenience: apply search + category + price filters and sort. */
export function buildExpectedProducts(state: FilterState): ProductFixture[] {
  let result = ALL_PRODUCTS;
  if (state.search) result = filterBySearch(result, state.search);
  if (state.category && state.category !== 'all') result = filterByCategory(result, state.category);
  if (state.priceRange && state.priceRange !== 'all') result = filterByPriceRange(result, state.priceRange);
  if (state.sort) result = sortProducts(result, state.sort);
  return result;
}
