# Testing the Application

The app uses **Playwright** for end-to-end (E2E) tests. Tests run against a live Vite dev server (started automatically by Playwright) and exercise the full browser stack across three device profiles: **desktop**, **tablet**, and **mobile**.

---

## Prerequisites

1. Install dependencies (if you haven't already):

   ```bash
   npm install
   ```

2. Install the Playwright browser binaries:

   ```bash
   npx playwright install
   ```

---

## Running Tests

### Run all tests (headless)

```bash
npm test
```

Playwright launches Chromium (desktop), iPad (tablet), and iPhone 14 (mobile) in parallel. Results are printed to the terminal and an HTML report is generated in `playwright-report/`.

**Example output:**

```
Running 135 tests using 6 workers

  ✓  [chromium-desktop] › search.spec.ts:30:5 › Product Search › Valid Query › shows matching products for a keyword found in titles (1.2s)
  ✓  [tablet]           › search.spec.ts:30:5 › Product Search › Valid Query › shows matching products for a keyword found in titles (1.4s)
  ✓  [mobile]           › search.spec.ts:30:5 › Product Search › Valid Query › shows matching products for a keyword found in titles (1.5s)
  ...

  135 passed (42s)
```

---

### Run tests with the interactive UI

```bash
npm run test:ui
```

Opens the Playwright UI explorer — browse test files, run individual tests, step through actions, and inspect snapshots visually.

---

### Run a single test file

```bash
npx playwright test tests/search.spec.ts
```

**Example — run only the filters suite:**

```bash
npx playwright test tests/filters.spec.ts
```

---

### Run tests matching a name pattern

```bash
npx playwright test --grep "Valid Query"
```

Runs only tests whose title matches the pattern. Useful for targeting a specific feature.

**Example — run all registration tests:**

```bash
npx playwright test --grep "Registration"
```

---

### Run tests on a specific device profile

```bash
npx playwright test --project=chromium-desktop
npx playwright test --project=tablet
npx playwright test --project=mobile
```

---

### Run tests in headed mode (visible browser)

```bash
npx playwright test --headed
```

Opens a real browser window so you can watch each test execute.

---

## Test Suites

| File | What it covers |
|---|---|
| `tests/search.spec.ts` | Product search — valid queries, empty results, edge cases |
| `tests/filters.spec.ts` | Category and price-range filters, combined filters, clear all |
| `tests/sort.spec.ts` | Sort options (price, name, rating) |
| `tests/pagination.spec.ts` | Page navigation and product count per page |
| `tests/navigation.spec.ts` | Route transitions and navbar links |
| `tests/registration.spec.ts` | Multi-step registration form, API mocking, error states |
| `tests/validation.spec.ts` | Form field validation rules |
| `tests/errors.spec.ts` | Error boundaries, XSS input handling, edge-case robustness |
| `tests/accessibility.spec.ts` | Keyboard navigation and accessibility checks |

---

## Page Object Models

Reusable page abstractions live in `pages/`:

| File | Purpose |
|---|---|
| `pages/SearchPage.ts` | Helpers for navigating the product catalog, searching, filtering, and sorting |
| `pages/RegistrationPage.ts` | Helpers for completing multi-step registration flow |

---

## Viewing the HTML Test Report

After any test run, open the HTML report:

```bash
npm run test:report
```

The report shows pass/fail status, screenshots on failure, traces, and timing for every test across all device profiles.

---

## Running Tests in CI

Set the `CI` environment variable to enable stricter settings (no retry on non-flakes, sequential workers, mandatory trace on failure):

```bash
CI=true npm test
```

Playwright will:
- Retry failing tests up to **2 times**
- Use **1 worker** to avoid resource contention
- Require the dev server to be available at `http://localhost:5173`

---

## Configuration Reference

Test configuration is in [`playwright.config.ts`](playwright.config.ts):

| Setting | Value |
|---|---|
| Base URL | `http://localhost:5173` |
| Test directory | `./tests` |
| Reporter | HTML |
| Screenshot | On failure only |
| Trace | On first retry |
| Web server command | `npm run dev` |
| Device profiles | Desktop Chrome, iPad (gen 7), iPhone 14 |
