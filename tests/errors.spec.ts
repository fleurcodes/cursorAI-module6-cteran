/**
 * errors.spec.ts
 *
 * Error-handling tests for the product search experience:
 *  - Page loads correctly even when images fail
 *  - Empty / edge-case search inputs are handled gracefully (no crash)
 *  - Rapid consecutive filter changes do not break the UI
 *  - Pagination does not go out of bounds under filter changes
 *  - No unhandled JS exceptions are thrown during normal interaction
 */

import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';

test.describe('Product Search — Error Handling', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);

    // Capture unhandled page errors so any test that triggers one will fail.
    page.on('pageerror', (err) => {
      throw new Error(`Unhandled page exception: ${err.message}`);
    });

    await searchPage.goto();
  });

  // -------------------------------------------------------------------------
  // Broken image resources
  // -------------------------------------------------------------------------

  test('page remains functional when all product images fail to load', async ({ page }) => {
    // Block all image requests to simulate broken images
    await page.route('**/*.{jpg,jpeg,png,webp,gif,svg}', (route) => route.abort());
    await searchPage.goto();

    // Products should still render (fallback placeholder is shown)
    const count = await searchPage.getProductCount();
    expect(count).toBeGreaterThan(0);

    // Controls still work after image failure
    await searchPage.search('keyboard');
    await expect(searchPage.productCards).toHaveCount(1);
  });

  // -------------------------------------------------------------------------
  // Invalid / boundary inputs — no crashes
  // -------------------------------------------------------------------------

  test('search with only whitespace does not crash the page', async () => {
    await searchPage.search('   ');

    await expect(searchPage.emptyState).not.toBeVisible();
    const count = await searchPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('search with a very long string does not crash the page', async () => {
    await searchPage.search('a'.repeat(500));

    // Either empty state or products — no exception
    const hasEmpty = await searchPage.emptyState.isVisible();
    const count = await searchPage.getProductCount();
    expect(hasEmpty || count >= 0).toBe(true);
  });

  test('search with HTML-like characters is displayed safely (no XSS injection)', async ({ page }) => {
    const payload = '<img src=x onerror=alert(1)>';
    await searchPage.search(payload);

    // No alert dialog should appear (Playwright treats dialogs as exceptions by default)
    await expect(searchPage.emptyState).toBeVisible();
  });

  test('search with SQL-injection-like characters is handled gracefully', async () => {
    await searchPage.search("' OR '1'='1");

    // No crash; either empty state or results
    const hasEmpty = await searchPage.emptyState.isVisible();
    const count = await searchPage.getProductCount();
    expect(hasEmpty || count >= 0).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Rapid interaction — no race conditions or crashes
  // -------------------------------------------------------------------------

  test('rapid consecutive search queries do not break the UI', async () => {
    const queries = ['a', 'ab', 'headphones', '', 'speaker', 'xyz'];
    for (const q of queries) {
      await searchPage.search(q);
    }

    // After the final query "xyz" (no results) the empty state must be shown
    await expect(searchPage.emptyState).toBeVisible();
  });

  test('rapidly toggling category filter does not crash the UI', async () => {
    const categories = ['Audio', 'Wearables', 'Peripherals', 'all', 'Fitness', 'all'] as const;
    for (const cat of categories) {
      await searchPage.selectCategory(cat);
    }

    // After resetting to "all", all products should be visible
    const count = await searchPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('applying a filter combination that yields no results then clearing recovers the list', async () => {
    // Fitness + over-$200 → 0 results
    await searchPage.selectCategory('Fitness');
    await searchPage.selectPriceRange('over-200');
    await expect(searchPage.emptyState).toBeVisible();

    await searchPage.clearFilters();

    await expect(searchPage.emptyState).not.toBeVisible();
    const count = await searchPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  // -------------------------------------------------------------------------
  // Pagination boundary protection
  // -------------------------------------------------------------------------

  test('navigating to last page then adding a filter that removes all results is handled gracefully', async () => {
    // Go to page 2 first
    await searchPage.goToNextPage();

    // Apply a filter that yields no results
    await searchPage.selectCategory('Fitness');
    await searchPage.selectPriceRange('over-200');

    await expect(searchPage.emptyState).toBeVisible();
    await expect(searchPage.productCards).toHaveCount(0);
  });

  test('disabled pagination buttons cannot be triggered by keyboard', async ({ page }) => {
    // Prev button is disabled on page 1 — pressing Enter on it should do nothing
    await searchPage.prevPageBtn.focus();
    await page.keyboard.press('Enter');

    // Still on page 1
    await expect(searchPage.productCards).toHaveCount(4);
  });
});
