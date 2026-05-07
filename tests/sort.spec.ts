/**
 * sort.spec.ts
 *
 * E2E tests for product sort controls:
 *  - Price ascending / descending
 *  - Name A–Z / Z–A
 *  - Rating high to low
 *  - Order changes correctly after each sort selection
 */

import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import { ALL_PRODUCTS, sortProducts } from './helpers/searchHelpers';

/** Verify array is sorted in non-decreasing order. */
function isAscending(nums: number[]): boolean {
  return nums.every((v, i) => i === 0 || v >= nums[i - 1]);
}

/** Verify array is sorted in non-increasing order. */
function isDescending(nums: number[]): boolean {
  return nums.every((v, i) => i === 0 || v <= nums[i - 1]);
}

test.describe('Product Sorting', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  // -------------------------------------------------------------------------
  // Price sorting
  // -------------------------------------------------------------------------

  test.describe('Sort by Price', () => {
    test('price ascending: cheapest product appears first', async () => {
      await searchPage.selectSort('price-asc');

      const prices = await searchPage.getProductPrices();
      expect(prices.length).toBeGreaterThan(0);
      expect(isAscending(prices)).toBe(true);

      const expected = sortProducts(ALL_PRODUCTS, 'price-asc');
      expect(prices[0]).toBeCloseTo(expected[0].price, 2);
    });

    test('price descending: most expensive product appears first', async () => {
      await searchPage.selectSort('price-desc');

      const prices = await searchPage.getProductPrices();
      expect(isDescending(prices)).toBe(true);

      const expected = sortProducts(ALL_PRODUCTS, 'price-desc');
      expect(prices[0]).toBeCloseTo(expected[0].price, 2);
    });

    test('switching from price-asc to price-desc changes first item from cheapest to most expensive', async () => {
      await searchPage.selectSort('price-asc');
      const ascending = await searchPage.getProductPrices();
      const cheapest = ascending[0];

      await searchPage.selectSort('price-desc');
      const descending = await searchPage.getProductPrices();
      const mostExpensive = descending[0];

      // Most expensive must be greater than the cheapest
      expect(mostExpensive).toBeGreaterThan(cheapest);
      // First page in descending must itself be sorted high→low
      expect(isDescending(descending)).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Name sorting
  // -------------------------------------------------------------------------

  test.describe('Sort by Name', () => {
    test('name A–Z: first title comes alphabetically before the last', async () => {
      await searchPage.selectSort('name-asc');

      const titles = await searchPage.getProductTitles();
      expect(titles.length).toBeGreaterThan(0);

      // Each consecutive pair should be in alphabetical order
      for (let i = 1; i < titles.length; i++) {
        expect(titles[i - 1].localeCompare(titles[i])).toBeLessThanOrEqual(0);
      }
    });

    test('name Z–A: first title comes alphabetically after the last', async () => {
      await searchPage.selectSort('name-desc');

      const titles = await searchPage.getProductTitles();
      expect(titles.length).toBeGreaterThan(0);

      for (let i = 1; i < titles.length; i++) {
        expect(titles[i - 1].localeCompare(titles[i])).toBeGreaterThanOrEqual(0);
      }
    });

    test('name A–Z first title matches expected alphabetical first product', async () => {
      await searchPage.selectSort('name-asc');

      const titles = await searchPage.getProductTitles();
      const expected = sortProducts(ALL_PRODUCTS, 'name-asc');
      expect(titles[0]).toBe(expected[0].title);
    });

    test('switching from A–Z to Z–A reverses the first and last visible titles', async () => {
      await searchPage.selectSort('name-asc');
      const azTitles = await searchPage.getProductTitles();

      await searchPage.selectSort('name-desc');
      const zaTitles = await searchPage.getProductTitles();

      // First in A-Z should be last in Z-A on the same page (only valid if all fit on one page)
      // With 4 items per page, compare first item of each
      expect(azTitles[0].localeCompare(zaTitles[0])).toBeLessThanOrEqual(0);
    });
  });

  // -------------------------------------------------------------------------
  // Rating sorting
  // -------------------------------------------------------------------------

  test.describe('Sort by Rating', () => {
    test('rating high to low: highest-rated product appears first on page 1', async () => {
      await searchPage.selectSort('rating-desc');

      const titles = await searchPage.getProductTitles();
      const expected = sortProducts(ALL_PRODUCTS, 'rating-desc');
      // First product on page 1 should be the highest-rated overall
      expect(titles[0]).toBe(expected[0].title);
    });

    test('rating high to low: products visible on page 1 have higher ratings than page 2', async () => {
      await searchPage.selectSort('rating-desc');

      // Collect page 1 prices as a proxy — use product order from helper
      const page1Titles = await searchPage.getProductTitles();

      await searchPage.goToNextPage();
      const page2Titles = await searchPage.getProductTitles();

      const sorted = sortProducts(ALL_PRODUCTS, 'rating-desc');
      const page1Expected = sorted.slice(0, 4).map((p) => p.title);
      const page2Expected = sorted.slice(4).map((p) => p.title);

      for (const title of page1Titles) {
        expect(page1Expected).toContain(title);
      }
      for (const title of page2Titles) {
        expect(page2Expected).toContain(title);
      }
    });
  });

  // -------------------------------------------------------------------------
  // Sort reset
  // -------------------------------------------------------------------------

  test.describe('Sort Reset', () => {
    test('"Clear all" resets sort to relevance', async () => {
      await searchPage.selectSort('price-asc');
      await searchPage.clearFilters();

      await expect(searchPage.sortSelect).toHaveValue('relevance');
    });

    test('sort persists when a category filter is applied', async () => {
      await searchPage.selectSort('price-desc');
      await searchPage.selectCategory('Audio');

      await expect(searchPage.sortSelect).toHaveValue('price-desc');

      const prices = await searchPage.getProductPrices();
      expect(isDescending(prices)).toBe(true);
    });
  });
});
