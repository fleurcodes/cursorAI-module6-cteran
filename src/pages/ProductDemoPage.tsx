import { useEffect, useState } from 'react';
import type { Product, ProductCategory } from '../types/product';
import ProductCard from '../components/products/ProductCard';
import { useCart } from '../contexts/CartContext';

interface ProductDemoPageProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

type PriceRange = 'all' | 'under-50' | '50-100' | '100-200' | 'over-200';
type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating-desc';

const PRICE_RANGE_LABELS: Record<PriceRange, string> = {
  'all': 'All Prices',
  'under-50': 'Under $50',
  '50-100': '$50 – $100',
  '100-200': '$100 – $200',
  'over-200': 'Over $200',
};

const SORT_LABELS: Record<SortOption, string> = {
  'relevance': 'Relevance',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'name-asc': 'Name: A – Z',
  'name-desc': 'Name: Z – A',
  'rating-desc': 'Rating: High to Low',
};

const CATEGORIES: ProductCategory[] = ['Audio', 'Wearables', 'Peripherals', 'Displays', 'Fitness'];

const PAGE_SIZE = 4;

const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'Wireless Noise-Cancelling Headphones Pro',
    description:
      'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio.',
    price: 79.99,
    originalPrice: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    imageAlt: 'Black wireless over-ear headphones on a white background',
    rating: 4.7,
    reviewCount: 2341,
    badge: 'Best Seller',
    inStock: true,
    category: 'Audio',
  },
  {
    id: '2',
    title: 'Minimalist Leather Watch',
    description:
      'Slim, elegant timepiece with a genuine leather strap and scratch-resistant sapphire crystal glass.',
    price: 149.00,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    imageAlt: 'Gold minimalist watch with brown leather strap',
    rating: 4.5,
    reviewCount: 876,
    badge: 'New',
    inStock: true,
    category: 'Wearables',
  },
  {
    id: '3',
    title: 'Portable Bluetooth Speaker',
    description:
      '360° surround sound, IPX7 waterproof rating, and a 12-hour playtime battery — perfect for outdoor adventures.',
    price: 49.95,
    originalPrice: 69.95,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    imageAlt: 'Compact cylindrical Bluetooth speaker in charcoal grey',
    rating: 4.3,
    reviewCount: 1508,
    inStock: true,
    category: 'Audio',
  },
  {
    id: '4',
    title: 'Ergonomic Mechanical Keyboard',
    description:
      'Tenkeyless layout with tactile brown switches, per-key RGB lighting, and a sturdy aluminium frame.',
    price: 119.00,
    originalPrice: 139.00,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    imageAlt: 'Compact mechanical keyboard with RGB backlight',
    rating: 4.8,
    reviewCount: 3012,
    badge: 'Sale',
    inStock: true,
    category: 'Peripherals',
  },
  {
    id: '5',
    title: 'Ultra-Wide 4K Monitor 34"',
    description:
      'Curved IPS panel with 144 Hz refresh rate, HDR600, and USB-C power delivery — designed for productivity and gaming.',
    price: 549.00,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
    imageAlt: 'Curved ultra-wide monitor on a desk',
    rating: 4.6,
    reviewCount: 642,
    inStock: false,
    category: 'Displays',
  },
  {
    id: '6',
    title: 'Smart Fitness Tracker Band',
    description:
      'Track heart rate, sleep, steps, and 20+ workout modes. 7-day battery. Works with iOS and Android.',
    price: 34.99,
    originalPrice: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80',
    imageAlt: 'Black fitness tracker band on a wrist',
    rating: 3.9,
    reviewCount: 4210,
    inStock: true,
    category: 'Fitness',
  },
];

function matchesPriceRange(price: number, range: PriceRange): boolean {
  switch (range) {
    case 'under-50':  return price < 50;
    case '50-100':    return price >= 50 && price <= 100;
    case '100-200':   return price > 100 && price <= 200;
    case 'over-200':  return price > 200;
    default:          return true;
  }
}

export default function ProductDemoPage({ searchQuery, onSearchChange }: ProductDemoPageProps) {
  const { addItem } = useCart();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>('all');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLocalSearch(searchQuery);
    setCurrentPage(1);
  }, [searchQuery]);

  function handleInPageSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setLocalSearch(value);
    onSearchChange(value);
    setCurrentPage(1);
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedCategory(e.target.value as ProductCategory | 'all');
    setCurrentPage(1);
  }

  function handlePriceRangeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedPriceRange(e.target.value as PriceRange);
    setCurrentPage(1);
  }

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSortOption(e.target.value as SortOption);
    setCurrentPage(1);
  }

  function handleClearFilters() {
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSortOption('relevance');
    onSearchChange('');
    setCurrentPage(1);
  }

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedPriceRange !== 'all' ||
    sortOption !== 'relevance' ||
    searchQuery.trim() !== '';

  // 1. Filter
  const filtered = sampleProducts.filter((product) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      product.title.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q);
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = matchesPriceRange(product.price, selectedPriceRange);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // 2. Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':   return a.price - b.price;
      case 'price-desc':  return b.price - a.price;
      case 'name-asc':    return a.title.localeCompare(b.title);
      case 'name-desc':   return b.title.localeCompare(a.title);
      case 'rating-desc': return b.rating - a.rating;
      default:            return 0;
    }
  });

  // 3. Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageProducts = sorted.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Page header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Product Store</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Discover our top picks</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="product-search" className="sr-only">Filter products</label>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <input
                id="product-search"
                data-testid="search-input"
                type="search"
                value={localSearch}
                onChange={handleInPageSearch}
                placeholder="Search products…"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors duration-150 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Category filter */}
          <div>
            <label htmlFor="filter-category" className="sr-only">Filter by category</label>
            <select
              id="filter-category"
              data-testid="filter-category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="py-2 px-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price range filter */}
          <div>
            <label htmlFor="filter-price" className="sr-only">Filter by price</label>
            <select
              id="filter-price"
              data-testid="filter-price"
              value={selectedPriceRange}
              onChange={handlePriceRangeChange}
              className="py-2 px-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {(Object.keys(PRICE_RANGE_LABELS) as PriceRange[]).map((key) => (
                <option key={key} value={key}>{PRICE_RANGE_LABELS[key]}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sort-select" className="sr-only">Sort products</label>
            <select
              id="sort-select"
              data-testid="sort-select"
              value={sortOption}
              onChange={handleSortChange}
              className="py-2 px-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                <option key={key} value={key}>{SORT_LABELS[key]}</option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              type="button"
              data-testid="clear-filters"
              onClick={handleClearFilters}
              className="py-2 px-4 text-sm rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4" data-testid="results-count">
          {sorted.length} product{sorted.length !== 1 ? 's' : ''} found
        </p>

        <section aria-labelledby="products-heading">
          <h2 id="products-heading" className="sr-only">Product listing</h2>

          {sorted.length === 0 ? (
            <p
              className="text-center text-gray-500 dark:text-gray-400 py-20 text-sm"
              data-testid="empty-state"
            >
              No products match your current filters.
            </p>
          ) : (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {pageProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addItem}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  className="mt-10 flex items-center justify-center gap-2"
                  aria-label="Pagination"
                  data-testid="pagination"
                >
                  <button
                    type="button"
                    data-testid="pagination-prev"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    aria-label="Previous page"
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    ‹ Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      data-testid={`pagination-page-${page}`}
                      onClick={() => setCurrentPage(page)}
                      aria-label={`Page ${page}`}
                      aria-current={safePage === page ? 'page' : undefined}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        safePage === page
                          ? 'bg-violet-600 border-violet-600 text-white'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    data-testid="pagination-next"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    aria-label="Next page"
                    className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Next ›
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
