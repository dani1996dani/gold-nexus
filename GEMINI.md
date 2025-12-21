# Gemini Context for Gold Nexus MVP

## 1. Project Goal

Build and deliver a Phase A MVP for Gold Nexus LLC, a global digital platform for gold commerce. The project is a fixed-price contract via Upwork.

## 2. Guiding Principles & Rules

- **SPEED IS KEY (The "Speedrun" Approach):** Prioritize speed, efficiency, and delivering a lean but functional MVP. Avoid scope creep. If a feature is not explicitly in the PDF, we do not build it unless it's a clear best practice that saves time later.
- **THE PDF IS THE SINGLE SOURCE OF TRUTH:** All functionality and requirements must strictly adhere to the provided MVP specification PDF. Do not add features not listed in the document.
- **VIBE: "TRADING PLATFORM," NOT "SHOP":** The client (Ahron Gold, a non-technical business owner) is obsessed with an "Institutional/Global" brand image. The platform should feel like a private bank or trading platform, not a simple e-commerce store. This influences language ("Add to Order" vs. "Add to Cart") and design.

## 3. Tech Stack

- **Framework:** Next.js 14+ (App Router, Full-Stack)
- **Package Manager**: Yarn
- **Language:** TypeScript
- **Styling:** TailwindCSS with shadcn/ui components.
- **Database:** PostgreSQL.
- **ORM:** Prisma. We use a local Docker container for development and Supabase for staging/production.
- **Forms:** React Hook Form with Zod for validation.
- **Client-Side State:** Zustand for global state (e.g., shopping cart).
- **Authentication:** JWTs with RS256 signatures, stored in `httpOnly` cookies. Passwords are hashed with Argon2.

## 4. Design Language

- **Theme:** Premium, minimalist, light-themed (`#F9F9F9` background).
- **Typography:** Elegant serif font for main headings (h1), clean sans-serif for UI text, labels, and paragraphs.
- **Buttons:** Primary CTAs are solid black with white text.

## 5. Project Status Checklist

### MILESTONE 1: Brand Identity & Public Marketplace UI

- `[x]` **STATUS: DELIVERED & PAID**
- `[x]` Homepage UI
- `[x]` Marketplace Page UI
- `[x]` Product Detail Page UI

### MILESTONE 2: Frontend Architecture & Full UI

- `[x]` **STATUS: DELIVERED & PAID**
- `[x]` Login & Registration Pages UI (with React Hook Form + Zod)
- `[x]` User Profile / "My Account" Page UI
- `[x]` "Sell Your Gold" Form Page UI
- `[x]` Shopping Cart (Slide-Out Sheet) UI
- `[x]` Checkout Page UI
- `[x]` Informational Pages Template (`/info/[slug]`)
- `[x]` Fully Responsive Navbar with Hamburger Menu

### MILESTONE 3: Full Backend Logic, Security & Full DB Logic

- `[x]` **STATUS: IN PROGRESS (Funded)**
- `[x]` **Database Setup:**
  - `[x]` Full Prisma schema defined for all models.
  - `[x]` Local Docker environment is functional.
  - `[x]` Supabase staging environment is configured.
  - `[x]` Professional deployment pipeline is set up (Vercel build script, `postinstall`, `dotenv-cli` for staging scripts).
- `[x]` **Authentication Backend:**
  - `[x]` `POST /api/auth/register` (with auto-login).
  - `[x]` `POST /api/auth/login`.
  - `[x]` `POST /api/auth/refresh`.
  - `[x]` `POST /api/auth/logout`.
- `[x]` **Dynamic Data Fetching:**
  - `[x]` `GET /api/products` for marketplace page.
  - `[x]` `GET /api/products/[sku]` for product detail page.
  - `[x]` `GET /api/users/me` for user profile page.
  - `[x]` Homepage "Featured Products" is dynamic.
- `[x]` **Functional Shopping Cart (Client-Side):**
  - `[x]` Zustand store created.
  - `[x]` "Add to Order" button works.
  - `[x]` Cart sheet reads from the store and is fully interactive (update quantity, remove).
- `[x]` **Create an Order (Checkout Process):**
  - `[x]` Build `POST /api/orders/create` endpoint to save cart contents to the database.
- `[x]` **Conditional Navbar UI:**
  - `[x]` Show "My Account" / "Logout" if authenticated, otherwise show "Login".
- `[x]` **skeletons for pages with data**
  - `[x]` make a report on all pages that need a few secs to load and add loading state for them.
- `[x]` **marketplace filtering and sorting**
  - `[x]` support filtering and sorting the marketplace via the api.
- `[x]` **Live Gold Price Module (API):**
  - `[x]` Build `GET /api/gold-price` endpoint. https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD
- `[x]` **"Sell Gold" Form Submission (API):**
  - `[x]` Build `POST /api/leads` endpoint and connect the frontend form.
- `[x]` **Admin Panel Backend APIs & Frontend pages:**
  - `[x]` Product Management (Create, Update, Bulk Import).
  - `[x]` Order Management (View all orders).
  - `[x]` Lead Management (View all leads).
  - `[x]` make navbar options for admin to navigate to admin panel. (only if admin)
  - `[x]` lead management page is BROKEN on mobile view. think if need to fix (Skipped for MVP - Desktop first)
  - `[x]` fix race condition of detecting if user is admin or not and showing the "access denied" page.
  - `[x]` show loading skeleton for 3 tables, and 3 [id] pages in admin panel. in stg, the wait is about 1-2 seconds. the "loading x" text is ugly. a simple skelton will do.
  - `[x]` (get rid of update status in leads page, and do it in the field like order management)
- `[x]` **Error display in FE:**
  - `[x]` Make all errors show a toast instead of alerts or console logs etc
  - `[x]` Country dropdown validation text in checkout is horrible, need custom text. (maybe needed in all places with country dropdown)
- `[x]` **Editable User Profile:**
  - `[x]` Build `PUT /api/users/me` endpoint and enable the "Save Changes" form.
- `[x]` add pagination (infi scroll) in live market (probably needs some BE work as well)
- `[ ]` **create a custom 404 page?**
- `[ ]` **admin panel is seen on mobile in navbar but im fully locked out on mobile?? no matter how much i refresh??**
- `[x]` **fix gold price. it barely updates. maybe set up a cron job on cron-job.org?**
- `[x]` **navbar - buy gold and sell gold are not visually aligned to the page.. fix it**

### MILESTONE 4: Stripe, Emails & Full Deployment

- `[ ]` **STATUS: PENDING**
- `[ ]` Stripe Checkout integration.
- `[ ]` Stripe Webhook confirmation.
- `[ ]` Transactional email flows (e.g., order confirmation).
- `[ ]` There is no forgot password flow atm. remove? or implement?
- `[ ]` Configure production cron job schedule (e.g., every 30 minutes).
- `[ ]` Final production deployment hand-off.
