/**
 * pagination.spec.ts
 *
 * E2E tests for product list pagination:
 *  - Navigate to next / previous pages
 *  - Correct products shown per page
 *  - Boundary pages (first and last)
 *  - Page state resets when filters change
 */

import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import { ALL_PRODUCTS } from './helpers/searchHelpers';

/** Total products in the fixture data. */
const TOTAL_PRODUCTS = ALL_PRODUCTS.length; // 6
/** Items per page as configured in ProductDemoPage. */
const PAGE_SIZE = 4;
const TOTAL_PAGES = Math.ceil(TOTAL_PRODUCTS / PAGE_SIZE); // 2

test.describe('Product Pagination', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  // -------------------------------------------------------------------------
  // Pagination visibility
  // -------------------------------------------------------------------------

  test('pagination controls are visible when there are multiple pages', async () => {
    await expect(searchPage.pagination).toBeVisible();
    await expect(searchPage.prevPageBtn).toBeVisible();
    await expect(searchPage.nextPageBtn).toBeVisible();
  });

  test(`page 1 shows ${PAGE_SIZE} products`, async () => {
    await expect(searchPage.productCards).toHaveCount(PAGE_SIZE);
  });

  test('page 1 "Previous" button is disabled', async () => {
    await expect(searchPage.prevPageBtn).toBeDisabled();
  });

  test(`page ${TOTAL_PAGES} "Next" button is disabled`, async () => {
    await searchPage.goToNextPage();
    await expect(searchPage.nextPageBtn).toBeDisabled();
  });

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------

  test('clicking "Next" navigates to page 2 with the remaining products', async () => {
    const page1Titles = await searchPage.getProductTitles();

    await searchPage.goToNextPage();

    // Remaining products: TOTAL_PRODUCTS - PAGE_SIZE
    const expectedPage2Count = TOTAL_PRODUCTS - PAGE_SIZE;
    await expect(searchPage.productCards).toHaveCount(expectedPage2Count);

    const page2Titles = await searchPage.getProductTitles();
    // Page 2 titles must not overlap with page 1
    for (const title of page2Titles) {
      expect(page1Titles).not.toContain(title);
    }
  });

  test('clicking "Previous" from page 2 returns to page 1', async () => {
    const page1Titles = await searchPage.getProductTitles();

    await searchPage.goToNextPage();
    await searchPage.goToPrevPage();

    const returnedTitles = await searchPage.getProductTitles();
    expect(returnedTitles).toEqual(page1Titles);
  });

  test('clicking a numbered page button navigates directly to that page', async () => {
    await searchPage.goToPage(2);

    const expectedPage2Count = TOTAL_PRODUCTS - PAGE_SIZE;
    await expect(searchPage.productCards).toHaveCount(expectedPage2Count);
  });

  // -------------------------------------------------------------------------
  // Active page indicator
  // -------------------------------------------------------------------------

  test('page 1 button has aria-current="page" on load', async () => {
    await expect(searchPage.activePage()).toHaveAttribute('data-testid', 'pagination-page-1');
  });

  test('active page indicator updates after navigation', async () => {
    await searchPage.goToNextPage();
    await expect(searchPage.activePage()).toHaveAttribute('data-testid', 'pagination-page-2');

    await searchPage.goToPrevPage();
    await expect(searchPage.activePage()).toHaveAttribute('data-testid', 'pagination-page-1');
  });

  // -------------------------------------------------------------------------
  // Boundary pages
  // -------------------------------------------------------------------------

  test('first page: cannot go further back than page 1', async () => {
    // Previous button is disabled — clicking it does nothing
    await searchPage.prevPageBtn.click({ force: true });
    await expect(searchPage.productCards).toHaveCount(PAGE_SIZE);
    await expect(searchPage.activePage()).toHaveAttribute('data-testid', 'pagination-page-1');
  });

  test('last page: cannot go further forward than the last page', async () => {
    await searchPage.goToPage(TOTAL_PAGES);
    await searchPage.nextPageBtn.click({ force: true });

    // Should still be on the last page
    await expect(searchPage.activePage()).toHaveAttribute(
      'data-testid',
      `pagination-page-${TOTAL_PAGES}`,
    );
  });

  // -------------------------------------------------------------------------
  // Page resets on filter change
  // -------------------------------------------------------------------------

  test('navigating to page 2 then applying a filter resets to page 1', async () => {
    await searchPage.goToNextPage();
    await expect(searchPage.activePage()).toHaveAttribute('data-testid', 'pagination-page-2');

    await searchPage.selectCategory('Audio');

    // Audio has 2 products (fits on page 1) — pagination may not be rendered
    const count = await searchPage.getProductCount();
    expect(count).toBeGreaterThan(0);
    // If pagination is still visible, active page must be 1
    const paginationVisible = await searchPage.pagination.isVisible();
    if (paginationVisible) {
      await expect(searchPage.activePage()).toHaveAttribute('data-testid', 'pagination-page-1');
    }
  });

  test('page resets to 1 after a search query is entered', async () => {
    await searchPage.goToNextPage();
    await searchPage.search('keyboard');

    // Keyboard matches 1 product — no pagination needed
    await expect(searchPage.productCards).toHaveCount(1);
  });
});
