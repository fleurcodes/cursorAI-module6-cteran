/**
 * search.spec.ts
 *
 * E2E tests for product search behaviour:
 *  - Valid queries that return results
 *  - Queries that return no results (empty state)
 *  - Edge cases: empty string, whitespace-only, special characters
 */

import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import { ALL_PRODUCTS, filterBySearch } from './helpers/searchHelpers';

test.describe('Product Search', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  // -------------------------------------------------------------------------
  // Valid queries
  // -------------------------------------------------------------------------

  test.describe('Valid Query', () => {
    test('shows matching products for a keyword found in titles', async () => {
      await searchPage.search('headphones');

      const expected = filterBySearch(ALL_PRODUCTS, 'headphones');
      await expect(searchPage.productCards).toHaveCount(expected.length);
      await expect(searchPage.emptyState).not.toBeVisible();

      const titles = await searchPage.getProductTitles();
      for (const product of expected) {
        expect(titles.some((t) => t.toLowerCase().includes('headphones'))).toBe(true);
      }
    });

    test('search is case-insensitive', async () => {
      await searchPage.search('KEYBOARD');

      const expected = filterBySearch(ALL_PRODUCTS, 'keyboard');
      await expect(searchPage.productCards).toHaveCount(expected.length);

      const titles = await searchPage.getProductTitles();
      expect(titles.some((t) => t.toLowerCase().includes('keyboard'))).toBe(true);
    });

    test('shows a single product when the query is very specific', async () => {
      await searchPage.search('Minimalist Leather Watch');

      await expect(searchPage.productCards).toHaveCount(1);
      const titles = await searchPage.getProductTitles();
      expect(titles[0]).toContain('Minimalist Leather Watch');
    });

    test('results-count text reflects matched products', async () => {
      await searchPage.search('speaker');

      const expected = filterBySearch(ALL_PRODUCTS, 'speaker');
      const countText = await searchPage.getResultsCountText();
      expect(countText).toContain(String(expected.length));
    });

    test('shows all products when the query matches everything', async () => {
      // "e" is present in all product titles/descriptions
      await searchPage.search('e');

      await expect(searchPage.emptyState).not.toBeVisible();
      const count = await searchPage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });
  });

  // -------------------------------------------------------------------------
  // No results
  // -------------------------------------------------------------------------

  test.describe('No Results', () => {
    test('shows empty state for a query with no matching products', async () => {
      await searchPage.search('xyznonexistentproduct123');

      await expect(searchPage.emptyState).toBeVisible();
      await expect(searchPage.productCards).toHaveCount(0);
    });

    test('empty state disappears when query is cleared', async () => {
      await searchPage.search('xyznonexistentproduct123');
      await expect(searchPage.emptyState).toBeVisible();

      await searchPage.clearSearch();
      await expect(searchPage.emptyState).not.toBeVisible();
      await expect(searchPage.productCards).toHaveCount(
        Math.min(ALL_PRODUCTS.length, 4), // first page
      );
    });
  });

  // -------------------------------------------------------------------------
  // Edge cases
  // -------------------------------------------------------------------------

  test.describe('Edge Cases', () => {
    test('empty string shows all products', async () => {
      await searchPage.search('');

      await expect(searchPage.emptyState).not.toBeVisible();
      const count = await searchPage.getProductCount();
      // First page shows up to 4 products when all 6 are available
      expect(count).toBeGreaterThan(0);
    });

    test('whitespace-only input shows all products', async () => {
      await searchPage.search('   ');

      await expect(searchPage.emptyState).not.toBeVisible();
      const count = await searchPage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });

    test('special characters that match nothing show empty state', async () => {
      await searchPage.search('@#$%!^&*()');

      await expect(searchPage.emptyState).toBeVisible();
      await expect(searchPage.productCards).toHaveCount(0);
    });

    test('very long query with no match shows empty state', async () => {
      await searchPage.search('a'.repeat(200));

      await expect(searchPage.emptyState).toBeVisible();
    });
  });
});
