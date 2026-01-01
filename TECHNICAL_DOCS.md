# Gold Nexus - Technical Documentation (Phase A MVP)

## 1. Overview

Gold Nexus is a global digital platform for gold commerce, built as a full-stack Next.js application. It features a marketplace, a "Sell Your Gold" lead generation system, secure user authentication, and Stripe-integrated checkout.

## 2. Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Hosted on Supabase)
- **ORM:** Prisma
- **Styling:** TailwindCSS + shadcn/ui
- **Authentication:** Custom JWT-based (RS256) with rolling sessions
- **State Management:** Zustand (Cart & Client State)
- **Email:** Resend (Node.js SDK)
- **Payments:** Stripe (Embedded Payment Element)

## 3. Project Structure

- `src/app`: Next.js App Router (Pages, API routes, Layouts)
- `src/components`: Reusable UI components (Shared and Admin-specific)
- `src/lib`: Core logic (Database client, Auth utilities, Email services, Stripe integration)
- `src/assets`: Static assets and mocks
- `prisma/`: Database schema and migration files

## 4. Local Development Setup

Follow these steps to run the project on your local machine.

### Prerequisites

- Node.js (v18+)
- Docker Desktop (for the local PostgreSQL database)
- Yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd gold-nexus
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory. You will need the following keys (ask the team for the values or use local defaults):

   ```env
   # Database
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gold_nexus_local"
   DATABASE_SEED_AND_MIGRATION_URL="postgresql://postgres:postgres@localhost:5432/gold_nexus_local"

   # Auth (JWT Keys - generate distinct keys for local dev)
   JWT_PRIVATE_KEY="..."
   JWT_PUBLIC_KEY="..."

   # External Services (Stripe, Resend, Supabase - Optional for basic local UI dev)
   STRIPE_SECRET_KEY="..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."
   RESEND_API_KEY="..."
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Start the Local Database:**

   ```bash
   docker-compose up -d
   ```

5. **Initialize the Database:**
   Run migrations and seed the database with mock data (products, users, orders).

   ```bash
   yarn prisma:migrate  # Applies schema changes
   yarn db:seed         # Seeds extensive mock data for testing (Defined in package.json)
   ```

6. **Start the Development Server:**
   ```bash
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 5. Key Workflows

### Authentication

- Uses **RS256 JWTs** stored in `httpOnly` cookies.
- An `authFetch` wrapper in `@/lib/auth-fetch` handles token refreshing and automatic retries on 401 errors.
- Admin access is restricted via middleware/server-side checks using `@/lib/admin-auth`.

### Order Lifecycle

1. **UNPAID:** Created when user enters checkout.
2. **PAID:** Updated via Stripe Webhook (`payment_intent.succeeded`).
3. **PROCESSING / SHIPPED / COMPLETED:** Managed by Admin via the Admin Dashboard.

### Gold Price Synchronization

- A Vercel Cron Job triggers `GET /api/gold-price/update` every 30 minutes.
- Fetches real-time XAU/USD data from Swissquote API.
- Updates all product prices dynamically based on the current market spot price.

## 6. Deployment & Configuration

### Environment Variables (Vercel Production)

Ensure the following are set in the production environment:

- `RESEND_API_KEY`
- `ADMIN_NOTIFICATION_EMAIL` (Client's email for order alerts)
- `PARTNER_LEAD_EMAIL` (Client's email for seller leads)
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `CRON_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `DATABASE_SEED_AND_MIGRATION_URL`
- `NEXT_PUBLIC_BASE_URL`
- `JWT_PRIVATE_KEY`
- `JWT_PUBLIC_KEY`

### Deployment Command

To deploy directly to production:

```bash
vercel --prod
```

### Data Management

In Production, all data (Products, Orders, Leads) should be managed exclusively through the **Admin Panel**. Seeding scripts (`yarn db:seed`, `yarn db:seed:stg`) are strictly for development, testing, or initial environment setup and should not be used once real customer data exists.

## 7. Admin Panel

Accessible at `/admin`. Admins can:

- Manage product inventory (Active/Featured status, SKU, Category).
- View and update status for all Customer Orders.
- Review and contact leads from the "Sell Your Gold" form.

## 8. SEO

- `sitemap.ts` generates dynamic sitemaps including all info pages.
- `robots.ts` blocks indexing of sensitive areas (`/admin`, `/profile`).
