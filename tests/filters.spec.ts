/**
 * filters.spec.ts
 *
 * E2E tests for product filter controls:
 *  - Single category filter
 *  - Single price-range filter
 *  - Multiple filters combined
 *  - Clear all filters
 */

import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import {
  ALL_PRODUCTS,
  filterByCategory,
  filterByPriceRange,
  buildExpectedProducts,
} from './helpers/searchHelpers';

test.describe('Product Filters', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  // -------------------------------------------------------------------------
  // Single filter — Category
  // -------------------------------------------------------------------------

  test.describe('Single Category Filter', () => {
    test('filtering by "Audio" shows only Audio products', async () => {
      await searchPage.selectCategory('Audio');

      const expected = filterByCategory(ALL_PRODUCTS, 'Audio');
      await expect(searchPage.productCards).toHaveCount(expected.length);

      const titles = await searchPage.getProductTitles();
      for (const title of titles) {
        const match = expected.find((p) => p.title === title);
        expect(match).toBeDefined();
      }
    });

    test('filtering by "Wearables" shows only Wearables products', async () => {
      await searchPage.selectCategory('Wearables');

      const expected = filterByCategory(ALL_PRODUCTS, 'Wearables');
      await expect(searchPage.productCards).toHaveCount(expected.length);
    });

    test('filtering by "Peripherals" shows only Peripherals products', async () => {
      await searchPage.selectCategory('Peripherals');

      const expected = filterByCategory(ALL_PRODUCTS, 'Peripherals');
      await expect(searchPage.productCards).toHaveCount(expected.length);

      const titles = await searchPage.getProductTitles();
      expect(titles[0]).toContain('Keyboard');
    });

    test('filtering by "Displays" shows only Displays products', async () => {
      await searchPage.selectCategory('Displays');

      const expected = filterByCategory(ALL_PRODUCTS, 'Displays');
      await expect(searchPage.productCards).toHaveCount(expected.length);
    });

    test('filtering by "Fitness" shows only Fitness products', async () => {
      await searchPage.selectCategory('Fitness');

      const expected = filterByCategory(ALL_PRODUCTS, 'Fitness');
      await expect(searchPage.productCards).toHaveCount(expected.length);

      const titles = await searchPage.getProductTitles();
      expect(titles[0]).toContain('Fitness Tracker');
    });

    test('switching back to "All Categories" restores the full list', async () => {
      await searchPage.selectCategory('Audio');
      await searchPage.selectCategory('all');

      // All products fit on two pages; first page shows 4
      const count = await searchPage.getProductCount();
      expect(count).toBe(4);
    });
  });

  // -------------------------------------------------------------------------
  // Single filter — Price range
  // -------------------------------------------------------------------------

  test.describe('Single Price-Range Filter', () => {
    test('"Under $50" shows only products priced below $50', async () => {
      await searchPage.selectPriceRange('under-50');

      const expected = filterByPriceRange(ALL_PRODUCTS, 'under-50');
      await expect(searchPage.productCards).toHaveCount(expected.length);

      const prices = await searchPage.getProductPrices();
      for (const price of prices) {
        expect(price).toBeLessThan(50);
      }
    });

    test('"$50–$100" shows only products in that range', async () => {
      await searchPage.selectPriceRange('50-100');

      const expected = filterByPriceRange(ALL_PRODUCTS, '50-100');
      await expect(searchPage.productCards).toHaveCount(expected.length);

      const prices = await searchPage.getProductPrices();
      for (const price of prices) {
        expect(price).toBeGreaterThanOrEqual(50);
        expect(price).toBeLessThanOrEqual(100);
      }
    });

    test('"$100–$200" shows only products in that range', async () => {
      await searchPage.selectPriceRange('100-200');

      const expected = filterByPriceRange(ALL_PRODUCTS, '100-200');
      await expect(searchPage.productCards).toHaveCount(expected.length);

      const prices = await searchPage.getProductPrices();
      for (const price of prices) {
        expect(price).toBeGreaterThan(100);
        expect(price).toBeLessThanOrEqual(200);
      }
    });

    test('"Over $200" shows only products above $200', async () => {
      await searchPage.selectPriceRange('over-200');

      const expected = filterByPriceRange(ALL_PRODUCTS, 'over-200');
      await expect(searchPage.productCards).toHaveCount(expected.length);

      const prices = await searchPage.getProductPrices();
      for (const price of prices) {
        expect(price).toBeGreaterThan(200);
      }
    });
  });

  // -------------------------------------------------------------------------
  // Multiple filters combined
  // -------------------------------------------------------------------------

  test.describe('Multiple Filters Combined', () => {
    test('category + price range: Audio & Under $50', async () => {
      await searchPage.selectCategory('Audio');
      await searchPage.selectPriceRange('under-50');

      const expected = buildExpectedProducts({ category: 'Audio', priceRange: 'under-50' });
      await expect(searchPage.productCards).toHaveCount(expected.length);

      const prices = await searchPage.getProductPrices();
      for (const price of prices) {
        expect(price).toBeLessThan(50);
      }
    });

    test('search + category: "watch" & Wearables', async () => {
      await searchPage.search('watch');
      await searchPage.selectCategory('Wearables');

      const expected = buildExpectedProducts({ search: 'watch', category: 'Wearables' });
      await expect(searchPage.productCards).toHaveCount(expected.length);
    });

    test('category + price that yields no results shows empty state', async () => {
      // Fitness products are all under $50; $100-$200 range yields nothing
      await searchPage.selectCategory('Fitness');
      await searchPage.selectPriceRange('100-200');

      await expect(searchPage.emptyState).toBeVisible();
      await expect(searchPage.productCards).toHaveCount(0);
    });

    test('three simultaneous filters narrow results correctly', async () => {
      await searchPage.search('speaker');
      await searchPage.selectCategory('Audio');
      await searchPage.selectPriceRange('under-50');

      const expected = buildExpectedProducts({
        search: 'speaker',
        category: 'Audio',
        priceRange: 'under-50',
      });
      await expect(searchPage.productCards).toHaveCount(expected.length);
    });
  });

  // -------------------------------------------------------------------------
  // Clear all filters
  // -------------------------------------------------------------------------

  test.describe('Clear All Filters', () => {
    test('"Clear all" button appears only when filters are active', async () => {
      await expect(searchPage.clearFiltersBtn).not.toBeVisible();

      await searchPage.selectCategory('Audio');
      await expect(searchPage.clearFiltersBtn).toBeVisible();
    });

    test('clears category filter and restores full product list', async () => {
      await searchPage.selectCategory('Audio');
      await searchPage.clearFilters();

      await expect(searchPage.categoryFilter).toHaveValue('all');
      const count = await searchPage.getProductCount();
      expect(count).toBe(4); // first page of 6 products
    });

    test('clears price filter', async () => {
      await searchPage.selectPriceRange('under-50');
      await searchPage.clearFilters();

      await expect(searchPage.priceFilter).toHaveValue('all');
    });

    test('clears search input', async () => {
      await searchPage.search('keyboard');
      await searchPage.clearFilters();

      await expect(searchPage.searchInput).toHaveValue('');
      const count = await searchPage.getProductCount();
      expect(count).toBe(4);
    });

    test('clears all filters at once and shows full product list', async () => {
      await searchPage.search('monitor');
      await searchPage.selectCategory('Displays');
      await searchPage.selectPriceRange('over-200');

      // Should have exactly 1 product visible
      await expect(searchPage.productCards).toHaveCount(1);

      await searchPage.clearFilters();

      await expect(searchPage.emptyState).not.toBeVisible();
      await expect(searchPage.categoryFilter).toHaveValue('all');
      await expect(searchPage.priceFilter).toHaveValue('all');
      await expect(searchPage.sortSelect).toHaveValue('relevance');
      const count = await searchPage.getProductCount();
      expect(count).toBe(4);
    });
  });
});
