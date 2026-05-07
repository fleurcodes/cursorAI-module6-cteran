# Running the Application

## Prerequisites

- **Node.js** v18 or later — [Download](https://nodejs.org/)
- **npm** v9 or later (bundled with Node.js)

Verify your versions:

```bash
node --version   # e.g. v20.11.0
npm --version    # e.g. 10.2.4
```

---

## 1. Install Dependencies

From the project root, run:

```bash
npm install
```

This installs all runtime and development dependencies listed in `package.json`.

---

## 2. Start the Development Server

```bash
npm run dev
```

Vite starts a local dev server with Hot Module Replacement (HMR).

**Example output:**

```
  VITE v8.0.10  ready in 312 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The app will automatically reload as you edit source files.

---

## 3. Navigate the App

The app uses hash-based routing. You can navigate directly to any page by changing the URL hash:

| Page | URL |
|---|---|
| Product Catalog | http://localhost:5173/#/products |
| Dashboard | http://localhost:5173/#/dashboard |
| Kanban Board | http://localhost:5173/#/kanban |
| Analytics | http://localhost:5173/#/analytics |
| Team Dashboard | http://localhost:5173/#/team |
| Social Feed | http://localhost:5173/#/feed |
| Settings | http://localhost:5173/#/settings |
| Shopping Cart | http://localhost:5173/#/cart |
| Checkout | http://localhost:5173/#/checkout |
| Login | http://localhost:5173/#/login |
| Register | http://localhost:5173/#/register |

> **Note:** Dashboard, Kanban, Analytics, Team, Feed, Settings, Cart, and Checkout are protected routes. You must be logged in to access them. Unauthenticated users are redirected to `/login`.

---

## 4. Build for Production

Compile TypeScript and bundle assets for production deployment:

```bash
npm run build
```

Output is written to `dist/`. Build artifacts are optimized and minified.

**Example output:**

```
vite v8.0.10 building for production...
✓ 214 modules transformed.
dist/index.html                   0.46 kB
dist/assets/index-Bx3k9Pqr.css   42.31 kB
dist/assets/index-CzD8fW2m.js   312.87 kB
✓ built in 4.21s
```

---

## 5. Preview the Production Build

After building, serve the production bundle locally to verify it before deploying:

```bash
npm run preview
```

**Example output:**

```
  ➜  Local:   http://localhost:4173/
```

Open [http://localhost:4173](http://localhost:4173) to browse the production build.

---

## 6. Lint the Codebase

```bash
npm run lint
```

Runs ESLint with TypeScript-aware rules across all `*.ts` and `*.tsx` files. Fix reported issues before committing.

---

## Available Scripts Summary

| Script | Command | Purpose |
|---|---|---|
| `dev` | `npm run dev` | Start Vite dev server with HMR |
| `build` | `npm run build` | Type-check and build for production |
| `preview` | `npm run preview` | Serve the production build locally |
| `lint` | `npm run lint` | Run ESLint across the project |
| `test` | `npm test` | Run Playwright E2E tests (see TESTING.md) |
| `test:ui` | `npm run test:ui` | Open Playwright interactive UI |
| `test:report` | `npm run test:report` | Open the last HTML test report |
