import type { Page, Locator } from '@playwright/test';

export type SortOption =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'rating-desc';

export type PriceRange = 'all' | 'under-50' | '50-100' | '100-200' | 'over-200';

export type ProductCategory = 'all' | 'Audio' | 'Wearables' | 'Peripherals' | 'Displays' | 'Fitness';

export class SearchPage {
  readonly page: Page;

  // Controls
  readonly searchInput: Locator;
  readonly categoryFilter: Locator;
  readonly priceFilter: Locator;
  readonly sortSelect: Locator;
  readonly clearFiltersBtn: Locator;

  // Results
  readonly productCards: Locator;
  readonly emptyState: Locator;
  readonly resultsCount: Locator;

  // Pagination
  readonly pagination: Locator;
  readonly prevPageBtn: Locator;
  readonly nextPageBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchInput = page.getByTestId('search-input');
    this.categoryFilter = page.getByTestId('filter-category');
    this.priceFilter = page.getByTestId('filter-price');
    this.sortSelect = page.getByTestId('sort-select');
    this.clearFiltersBtn = page.getByTestId('clear-filters');

    this.productCards = page.getByTestId('product-card');
    this.emptyState = page.getByTestId('empty-state');
    this.resultsCount = page.getByTestId('results-count');

    this.pagination = page.getByTestId('pagination');
    this.prevPageBtn = page.getByTestId('pagination-prev');
    this.nextPageBtn = page.getByTestId('pagination-next');
  }

  /** Navigate to the product store page. */
  async goto(): Promise<void> {
    await this.page.goto('/#/products');
  }

  /** Type a query into the search input and wait for the DOM to settle. */
  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  /** Clear the search input. */
  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
  }

  /** Select a category from the category filter dropdown. */
  async selectCategory(category: ProductCategory): Promise<void> {
    await this.categoryFilter.selectOption(category);
  }

  /** Select a price range from the price filter dropdown. */
  async selectPriceRange(range: PriceRange): Promise<void> {
    await this.priceFilter.selectOption(range);
  }

  /** Select a sort option from the sort dropdown. */
  async selectSort(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  /** Click the "Clear all" button to reset all active filters. */
  async clearFilters(): Promise<void> {
    await this.clearFiltersBtn.click();
  }

  /** Navigate to the next results page. */
  async goToNextPage(): Promise<void> {
    await this.nextPageBtn.click();
  }

  /** Navigate to the previous results page. */
  async goToPrevPage(): Promise<void> {
    await this.prevPageBtn.click();
  }

  /** Click a specific page number button. */
  async goToPage(pageNumber: number): Promise<void> {
    await this.page.getByTestId(`pagination-page-${pageNumber}`).click();
  }

  /** Return the current page button with aria-current="page". */
  activePage(): Locator {
    return this.page.locator('[data-testid^="pagination-page-"][aria-current="page"]');
  }

  /** Return all rendered product title text values. */
  async getProductTitles(): Promise<string[]> {
    return this.page.getByTestId('product-title').allTextContents();
  }

  /** Return all rendered product price numeric values (parsed from data-price). */
  async getProductPrices(): Promise<number[]> {
    const prices = await this.page
      .getByTestId('product-price')
      .evaluateAll((els) =>
        els.map((el) => parseFloat((el as HTMLElement).dataset['price'] ?? '0')),
      );
    return prices;
  }

  /** Return the total number of products shown on the current page. */
  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  /** Return the results-count text content. */
  async getResultsCountText(): Promise<string> {
    return (await this.resultsCount.textContent()) ?? '';
  }
}
