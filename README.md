# My App

A modern, full-featured React + TypeScript single-page application built with Vite and Tailwind CSS. The app demonstrates a rich set of UI patterns including product browsing, task management, a shopping cart, analytics, and social features — all with full authentication and responsive design across desktop, tablet, and mobile.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Language | TypeScript 6 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Testing | Playwright 1.59 |
| Linting | ESLint 10 + typescript-eslint |

---

## Major Features

### Authentication
- **Registration** — Create a new account with form validation (username, email, password strength rules, terms acceptance).
- **Login** — Sign in with credentials; authenticated users are redirected away from public-only pages.
- **Protected Routes** — A `PrivateRoute` guard ensures restricted pages are only accessible to signed-in users.

### Product Catalog (`/products`)
- Browse a full product grid with images, ratings, and prices.
- **Search** — Real-time keyword filtering across product titles and descriptions.
- **Category Filters** — Narrow results by product category.
- **Price Range Filters** — Filter by predefined price brackets (Under $50, $50–$100, $100–$200, Over $200).
- **Sort Options** — Sort by relevance, price (low/high), name (A–Z / Z–A), or rating.
- **Pagination** — Navigate multi-page results.
- **Add to Cart** — Add any product directly from the catalog.

### Shopping Cart & Checkout (`/cart`, `/checkout`, `/order-confirmation`)
- **Cart** — View, adjust quantities, and remove items; see live subtotal.
- **Checkout** — Enter shipping and payment details.
- **Order Confirmation** — Post-purchase summary screen.

### Dashboard (`/dashboard`)
- Overview of key metrics via stat widgets (Total Tasks, Completed, In Progress, Overdue).
- Task cards with priority levels, assignees, due dates, and tags.
- Collapsible sidebar navigation for quick page switching.

### Kanban Board (`/kanban`)
- Drag-and-drop task cards across swimlane columns (To Do, In Progress, Done).
- Toast notifications for user feedback.

### Analytics (`/analytics`)
- Data visualization and reporting page for business metrics.

### Team Dashboard (`/team`)
- Collaborative view of team members and their activity.

### Social Feed (`/feed`)
- Activity feed for community or team updates.

### Settings (`/settings`)
- User preferences and application configuration.

---

## Project Structure

```
├── src/
│   ├── App.tsx               # Root component with hash-based routing
│   ├── pages/                # Top-level page components
│   ├── components/           # Reusable UI components (organized by feature)
│   ├── contexts/             # React contexts (AuthContext, CartContext)
│   ├── hooks/                # Custom React hooks
│   ├── services/             # Data-fetching / business logic services
│   ├── types/                # Shared TypeScript type definitions
│   ├── utils/                # Utility/helper functions
│   └── constants/            # App-wide constants
├── pages/                    # Playwright Page Object Models
├── tests/                    # Playwright E2E test suites
├── public/                   # Static assets
└── playwright.config.ts      # Playwright configuration
```

---

## Quick Start

See [RUNNING.md](RUNNING.md) for detailed setup and run instructions.

## Testing

See [TESTING.md](TESTING.md) for detailed testing instructions and examples.
