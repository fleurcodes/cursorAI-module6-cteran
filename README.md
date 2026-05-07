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

<img width="701" height="748" alt="image" src="https://github.com/user-attachments/assets/71b282bb-258e-4239-b049-e971070d46af" />
<img width="635" height="885" alt="image" src="https://github.com/user-attachments/assets/b486c748-6abc-45a0-a836-806d1b08ce06" />

### Product Catalog (`/products`)
- Browse a full product grid with images, ratings, and prices.
- **Search** — Real-time keyword filtering across product titles and descriptions.
- **Category Filters** — Narrow results by product category.
- **Price Range Filters** — Filter by predefined price brackets (Under $50, $50–$100, $100–$200, Over $200).
- **Sort Options** — Sort by relevance, price (low/high), name (A–Z / Z–A), or rating.
- **Pagination** — Navigate multi-page results.
- **Add to Cart** — Add any product directly from the catalog.

<img width="1021" height="937" alt="Screenshot 2026-05-07 at 12 31 09 p m" src="https://github.com/user-attachments/assets/440dbfbf-d9ef-49d3-867c-7df63d5c067d" />

### Shopping Cart & Checkout (`/cart`, `/checkout`, `/order-confirmation`)
- **Cart** — View, adjust quantities, and remove items; see live subtotal.
- **Checkout** — Enter shipping and payment details.
- **Order Confirmation** — Post-purchase summary screen.

<img width="1000" height="654" alt="image" src="https://github.com/user-attachments/assets/3b658c56-c7ba-4256-8351-ddd0f8185b22" />
<img width="975" height="605" alt="image" src="https://github.com/user-attachments/assets/8ca465be-1f2f-4b7f-9b78-94651efdba64" />
<img width="751" height="891" alt="image" src="https://github.com/user-attachments/assets/718c433d-f0ab-40ac-bdd9-74f3c654c812" />

### Dashboard (`/dashboard`)
- Overview of key metrics via stat widgets (Total Tasks, Completed, In Progress, Overdue).
- Task cards with priority levels, assignees, due dates, and tags.
- Collapsible sidebar navigation for quick page switching.

<img width="1115" height="914" alt="image" src="https://github.com/user-attachments/assets/27cadd8d-05bf-4dce-8285-5e71b3c80ba5" />

### Kanban Board (`/kanban`)
- Drag-and-drop task cards across swimlane columns (To Do, In Progress, Done).
- Toast notifications for user feedback.

<img width="1176" height="693" alt="image" src="https://github.com/user-attachments/assets/5a8d86ec-945e-4e00-b6dc-fb09f26b5b5a" />

### Analytics (`/analytics`)
- Data visualization and reporting page for business metrics.

<img width="1172" height="907" alt="image" src="https://github.com/user-attachments/assets/e11d4abe-c0ac-4916-a04d-27a55c8e2d54" />

### Team Dashboard (`/team`)
- Collaborative view of team members and their activity.

<img width="1127" height="880" alt="image" src="https://github.com/user-attachments/assets/581f1fba-dcad-4983-8889-ff65752b6546" />

### Social Feed (`/feed`)
- Activity feed for community or team updates.

<img width="1119" height="952" alt="image" src="https://github.com/user-attachments/assets/788b37df-a337-4cb2-be24-0109fec7e028" />

### Settings (`/settings`)
- User preferences and application configuration.

<img width="1143" height="877" alt="image" src="https://github.com/user-attachments/assets/8707d0fb-3f9d-4f11-8ee4-a6dd1289708c" />
<img width="823" height="839" alt="Screenshot 2026-05-07 at 12 37 30 p m" src="https://github.com/user-attachments/assets/e029696b-02e5-472a-8d23-ef0a661fe8d3" />
<img width="832" height="652" alt="Screenshot 2026-05-07 at 12 37 42 p m" src="https://github.com/user-attachments/assets/371c8132-3341-4dca-8ec3-61f0d07849b9" />

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
