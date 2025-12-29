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
- **Emails:** Resend (Node.js SDK).

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
- `[x]` Login & Registration Pages UI
- `[x]` User Profile / "My Account" Page UI
- `[x]` "Sell Your Gold" Form Page UI
- `[x]` Shopping Cart (Slide-Out Sheet) UI
- `[x]` Checkout Page UI
- `[x]` Informational Pages Template (`/info/[slug]`)
- `[x]` Fully Responsive Navbar with Hamburger Menu

### MILESTONE 3: Full Backend Logic, Security & Full DB Logic

- `[x]` **STATUS: DELIVERED & PAID**
- `[x]` **Database Setup:** Prisma models, local Docker, Supabase Staging.
- `[x]` **Authentication:** RS256 JWTs, rolling sessions, authFetch interceptor.
- `[x]` **Dynamic Data:** Products, Orders, Users, Leads APIs.
- `[x]` **Order Flow:** Status lifecycle (UNPAID -> PAID -> PROCESSING -> SHIPPED -> COMPLETED).
- `[x]` **Admin Panel:** Product management, Order management, Lead management.
- `[x]` **Bug Fixes:** Mobile access race conditions, scroll-to-top issues, footer redesign.

### MILESTONE 4: Stripe, Emails & Full Deployment

- `[ ]` **STATUS: IN PROGRESS**
- `[x]` **Stripe Integration:** Embedded PaymentElement with Webhook sync.
- `[x]` **Email Notifications:**
  - `[x]` New Order (Paid) sent to Admin (Resend).
  - `[x]` New Lead Forwarding sent to Partner (Resend).
- `[x]` **Forgot Password Flow:** Secure reset token via email.
- `[ ]` **Technical Documentation:** `TECHNICAL_DOCS.md` for API and setup.
- `[ ]` **Final Production Hand-off:**
  - `[ ]` Configure production environment variables.
  - `[ ]` **CRITICAL:** Set up Vercel Cron Job (or external like cron-job.org) for gold price updates (30 min interval).

## 6. Authentication Architecture

- **Utility:** `authFetch` (from `@/lib/auth-fetch`) is the standard for all **client-side** API requests.
- **Behavior:** It wraps the native `fetch`, automatically handling `401 Unauthorized` responses by refreshing the token silently and retrying the request.
- **Rule:** ALWAYS use `authFetch` instead of `fetch` in Client Components (`'use client'`).
- **Exception:** Server Components use native `fetch` or direct DB calls.
