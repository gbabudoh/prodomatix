# Veridia — B2B Data Marketplace

A web application where users **filter and select company data records, see live pricing, pay, and download** their dataset. Browse companies by industry, location, size, and revenue; build a selection; check out; and receive the data in CSV / Excel / JSON / CRM-sync formats.

> The HTML file in `design-reference/` is the original interactive **design prototype**. This `src/` + `server/` project is its implementation in React + Vite, intended to be run, extended, or dropped into a larger codebase.

---

## Tech stack

- **Frontend:** React 18 + Vite, React Router, plain CSS (design tokens via CSS variables). No CSS framework.
- **State:** React Context + `useReducer` (`src/store/MarketplaceContext.jsx`). Swap for Redux/Zustand if you prefer.
- **Backend (optional):** a small Express mock API in `server/` (`/api/companies`, `/api/checkout`).
- **Fonts:** IBM Plex Sans + IBM Plex Mono (loaded in `index.html`).

The frontend runs entirely on the bundled dataset, so **you don't need the server** to try it. The server is provided to show the intended API shape.

---

## Getting started

```bash
# 1. Install frontend deps
npm install

# 2. (optional) install + run the mock API in a second terminal
cd server && npm install && npm start    # http://localhost:4000

# 3. Run the app
npm run dev                              # http://localhost:5173
```

`npm run build` produces a production bundle in `dist/`.

---

## Folder structure

```
veridia-data-marketplace/
├── index.html                  # Vite entry; loads fonts + /src/main.jsx
├── package.json                # Frontend deps & scripts
├── vite.config.js              # Dev server + /api proxy to the mock backend
│
├── src/
│   ├── main.jsx                # React root: Router + MarketplaceProvider
│   ├── App.jsx                 # Route table (/, /checkout, /success)
│   ├── index.css               # Design tokens + all component styles
│   │
│   ├── data/
│   │   └── companies.js        # Sample dataset + filter/format option lists
│   │
│   ├── lib/
│   │   └── pricing.js          # Pure helpers: pricing, discounts, filters, formatting
│   │
│   ├── store/
│   │   └── MarketplaceContext.jsx   # Global state (filters, selection, formats, order)
│   │
│   ├── components/
│   │   ├── Header.jsx          # Top bar + step breadcrumb
│   │   ├── FilterSidebar.jsx   # Search + industry/location/size/revenue facets
│   │   ├── DataTable.jsx       # Results table + select-all toolbar
│   │   ├── SelectionBar.jsx    # Sticky footer: counts, total, continue
│   │   └── IndustryDot.jsx     # Industry color dot + countBy() helper
│   │
│   └── pages/
│       ├── BrowsePage.jsx      # Step 1 — filter & select records
│       ├── CheckoutPage.jsx    # Step 2 — review, choose format, pay
│       └── SuccessPage.jsx     # Step 3 — download files
│
├── server/                     # Optional mock API (Express)
│   ├── package.json
│   ├── index.js                # GET /api/companies, POST /api/checkout
│   └── data/companies.js       # Server copy of dataset + pricing
│
└── design-reference/
    └── Veridia Data Marketplace.dc.html   # Original design prototype
```

---

## How it works

**The flow** is three routes sharing one store, so a selection survives navigation:

1. **`/` Browse** — `applyFilters()` narrows the dataset against the active filters; clicking a row toggles it in `state.selected`. The footer shows live counts and the running subtotal.
2. **`/checkout`** — `summarize()` computes subtotal → volume discount → tax → total for the selected companies. The user picks one or more delivery formats and "pays".
3. **`/success`** — a download manifest is generated for the chosen formats. "Back to marketplace" resets the store.

**Pricing model** (see `src/lib/pricing.js`):
- Each record costs `contacts × $1.50`.
- Volume discount on subtotal: 5% ≥ $300, 10% ≥ $600, 15% ≥ $1,500.
- Tax: 8.25% on the discounted subtotal.

All pricing logic is duplicated server-side (`server/data/companies.js`) so the backend is the source of truth in production — never trust client-computed totals at the payment step.

---

## Design tokens (in `src/index.css`)

| Token | Value | Use |
|---|---|---|
| `--accent` | `#2e54d4` | Primary blue (buttons, active states) |
| `--accent-soft` | `#eef2fe` | Active backgrounds, avatar |
| `--green` | `#1f8f5b` | Verified %, discounts, success |
| `--ink` | `#181b22` | Primary text |
| `--sub` / `--faint` | `#616b7a` / `#8a93a1` | Secondary / tertiary text |
| `--bg` / `--surface` | `#f6f7f9` / `#ffffff` | Page / card backgrounds |
| `--border` | `#e3e6eb` | Dividers & card borders |

Industry dots use `oklch(0.62 0.16 <hue>)` with a per-industry hue (`INDUSTRY_HUE` in `src/data/companies.js`).

---

## Where to extend

- **Real data:** point `MarketplaceContext` at `GET /api/companies` instead of importing the static array.
- **Payments:** wire `POST /api/checkout` to Stripe; return signed download URLs.
- **Auth & accounts:** order history, saved segments, credit balances.
- **Server-side filtering / pagination** for large catalogues.
- **Exports:** generate real CSV/XLSX/JSON files and CRM sync jobs in the checkout handler.
