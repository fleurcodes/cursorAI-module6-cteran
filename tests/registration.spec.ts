/**
 * registration.spec.ts
 *
 * End-to-end tests for form submission:
 *  - Successful submission flow
 *  - API error handling & retry
 *  - Loading state / duplicate submission prevention
 *  - Network mocking via Playwright route interception
 */

import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import { validStep1, validStep2 } from './helpers/formHelpers';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Navigate to step 3 with valid data so the form is ready for submission.
 */
async function reachStep3(reg: RegistrationPage): Promise<void> {
  await reg.goto();
  await reg.goToStep3(validStep1(), validStep2());
}

// ---------------------------------------------------------------------------
// Successful Submission
// ---------------------------------------------------------------------------

test.describe('Successful Submission', () => {
  test('shows success screen after a successful API response', async ({ page }) => {
    await page.route('/api/register', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Created' }),
      }),
    );

    const reg = new RegistrationPage(page);
    await reachStep3(reg);
    await reg.clickSubmit();

    await expect(reg.successScreen).toBeVisible({ timeout: 10_000 });
    await expect(reg.successHeading).toContainText('Account Created');
  });

  test('success screen includes a link to the dashboard', async ({ page }) => {
    await page.route('/api/register', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Created' }),
      }),
    );

    const reg = new RegistrationPage(page);
    await reachStep3(reg);
    await reg.clickSubmit();

    await expect(reg.successScreen).toBeVisible({ timeout: 10_000 });
    const dashboardLink = page.getByTestId('link-go-to-dashboard');
    await expect(dashboardLink).toBeVisible();
    await expect(dashboardLink).toHaveAttribute('href', '#/dashboard');
  });

  test('success screen greets user by name', async ({ page }) => {
    await page.route('/api/register', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Created' }),
      }),
    );

    const reg = new RegistrationPage(page);
    await reg.goto();
    await reg.goToStep3(validStep1({ fullName: 'Maria Garcia' }), validStep2());
    await reg.clickSubmit();

    await expect(reg.successScreen).toBeVisible({ timeout: 10_000 });
    await expect(reg.successScreen).toContainText('Maria Garcia');
  });
});

// ---------------------------------------------------------------------------
// Submission Error Handling
// ---------------------------------------------------------------------------

test.describe('Submission Error Handling', () => {
  test('shows error alert when API returns 500', async ({ page }) => {
    await page.route('/api/register', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      }),
    );

    const reg = new RegistrationPage(page);
    await reachStep3(reg);
    await reg.clickSubmit();

    await expect(reg.submitErrorAlert).toBeVisible({ timeout: 10_000 });
    await expect(reg.submitErrorAlert).toContainText('Internal Server Error');
  });

  test('shows error alert when API returns 409 conflict', async ({ page }) => {
    await page.route('/api/register', (route) =>
      route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Email already in use' }),
      }),
    );

    const reg = new RegistrationPage(page);
    await reachStep3(reg);
    await reg.clickSubmit();

    await expect(reg.submitErrorAlert).toBeVisible({ timeout: 10_000 });
    await expect(reg.submitErrorAlert).toContainText('Email already in use');
  });

  test('shows generic error message when network request fails', async ({ page }) => {
    await page.route('/api/register', (route) => route.abort('failed'));

    const reg = new RegistrationPage(page);
    await reachStep3(reg);
    await reg.clickSubmit();

    await expect(reg.submitErrorAlert).toBeVisible({ timeout: 10_000 });
  });

  test('form remains on step 3 after submission error', async ({ page }) => {
    await page.route('/api/register', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Server error' }),
      }),
    );

    const reg = new RegistrationPage(page);
    await reachStep3(reg);
    await reg.clickSubmit();

    await expect(reg.submitErrorAlert).toBeVisible({ timeout: 10_000 });
    await expect(reg.step3Container).toBeVisible();
    await expect(reg.successScreen).not.toBeVisible();
  });

  test('review data is preserved after a failed submission', async ({ page }) => {
    await page.route('/api/register', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Server error' }),
      }),
    );

    const reg = new RegistrationPage(page);
    await reg.goto();
    await reg.goToStep3(
      validStep1({ fullName: 'Error Test', email: 'error@example.com' }),
      validStep2({ username: 'error_user' }),
    );
    await reg.clickSubmit();

    await expect(reg.submitErrorAlert).toBeVisible({ timeout: 10_000 });

    // Data still displayed in review
    await expect(page.getByTestId('review-fullName')).toContainText('Error Test');
    await expect(page.getByTestId('review-email')).toContainText('error@example.com');
    await expect(page.getByTestId('review-username')).toContainText('error_user');
  });

  test('can retry after a failed submission', async ({ page }) => {
    let callCount = 0;
    await page.route('/api/register', (route) => {
      callCount += 1;
      if (callCount === 1) {
        void route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Temporary error' }),
        });
      } else {
        void route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Created' }),
        });
      }
    });

    const reg = new RegistrationPage(page);
    await reachStep3(reg);

    // First attempt fails
    await reg.clickSubmit();
    await expect(reg.submitErrorAlert).toBeVisible({ timeout: 10_000 });

    // Retry succeeds
    await reg.clickSubmit();
    await expect(reg.successScreen).toBeVisible({ timeout: 10_000 });
  });
});

// ---------------------------------------------------------------------------
// Loading State
// ---------------------------------------------------------------------------

test.describe('Loading State', () => {
  test('shows loading spinner during submission', async ({ page }) => {
    // Intercept and hold the request so we can assert the loading state
    // eslint-disable-next-line prefer-const
    let resolveRequest!: () => void;
    const requestHeld = new Promise<void>((resolve) => {
      // Promise executor runs synchronously — resolveRequest is assigned before use
      resolveRequest = resolve;
    });

    await page.route('/api/register', async (route) => {
      await requestHeld; // wait until test releases it
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Created' }),
      });
    });

    const reg = new RegistrationPage(page);
    await reachStep3(reg);

    // Click submit; wait for spinner to appear (eliminates race condition)
    await reg.btnSubmit.click();
    await expect(reg.loadingSpinner).toBeVisible({ timeout: 5_000 });

    // Release the request
    resolveRequest();
    await expect(reg.successScreen).toBeVisible({ timeout: 10_000 });
  });

  test('Submit button is disabled while loading to prevent duplicates', async ({ page }) => {
    let resolveRequest!: () => void;
    const requestHeld = new Promise<void>((resolve) => {
      resolveRequest = resolve;
    });

    await page.route('/api/register', async (route) => {
      await requestHeld;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Created' }),
      });
    });

    const reg = new RegistrationPage(page);
    await reachStep3(reg);
    await reg.btnSubmit.click();

    // Wait for the loading state to be reflected before asserting
    await expect(reg.loadingSpinner).toBeVisible({ timeout: 5_000 });
    await expect(reg.btnSubmit).toBeDisabled();
    resolveRequest();
    await expect(reg.successScreen).toBeVisible({ timeout: 10_000 });
  });

  test('Previous button is disabled while loading', async ({ page }) => {
    let resolveRequest!: () => void;
    const requestHeld = new Promise<void>((resolve) => {
      resolveRequest = resolve;
    });

    await page.route('/api/register', async (route) => {
      await requestHeld;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Created' }),
      });
    });

    const reg = new RegistrationPage(page);
    await reachStep3(reg);
    await reg.btnSubmit.click();

    // Wait for the loading state to be reflected before asserting
    await expect(reg.loadingSpinner).toBeVisible({ timeout: 5_000 });
    await expect(reg.btnPrevious).toBeDisabled();
    resolveRequest();
  });
});
