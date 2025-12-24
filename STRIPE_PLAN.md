# Stripe Integration Plan (Milestone 4)

## Goal

Implement a secure, embedded payment flow using **Stripe Elements** to maintain the "Institutional/Premium" brand vibe of Gold Nexus. The user will never leave the site to complete a purchase.

## Architecture

### 1. Backend (Server-Side)

- **Stripe Instance:** Initialize a global Stripe instance in `src/lib/stripe.ts`.
- **Order Creation Update (`POST /api/orders/create`):**
  - Validate cart items and calculate total (server-side).
  - Create a Stripe **PaymentIntent** with the correct amount and currency.
  - Create the Order record in the DB with status `PENDING` and store the `paymentIntentId`.
  - Return the `clientSecret` from the PaymentIntent to the frontend.
- **Webhook Handler (`POST /api/webhooks/stripe`):**
  - Verify Stripe signature for security.
  - Listen for `payment_intent.succeeded`.
  - Update the corresponding Order in the DB from `PENDING` to `PROCESSING`.
  - (Future) Trigger order confirmation emails.

### 2. Frontend (Client-Side)

- **Stripe Provider:** Wrap the Checkout flow with `Elements` from `@stripe/react-stripe-js`.
- **Payment Element:** Use the modern `PaymentElement` which handles Credit Cards, Apple Pay, Google Pay, etc., in one responsive UI.
- **Theme Sync:** Use the Stripe "Appearance API" to match our minimalist black/white design.
- **Mobile First:** Ensure the layout stacks correctly on small screens and use "Link" for 1-click checkout on mobile.

## Implementation Steps

1. [ ] **Step 1: Backend Setup**
   - Create `src/lib/stripe.ts`.
   - Update `src/app/api/orders/create/route.ts` to generate `PaymentIntent`.
2. [ ] **Step 2: Webhook**
   - Create `src/app/api/webhooks/stripe/route.ts`.
3. [ ] **Step 3: Frontend Foundation**
   - Create `src/lib/utils/stripe-client.ts` to load Stripe.
   - Create `CheckoutPaymentForm.tsx` component.
4. [ ] **Step 4: Integration**
   - Refactor `src/app/checkout/page.tsx` to integrate the payment element.
5. [ ] **Step 5: Polish**
   - Test mobile responsiveness and error handling.

## Environment Variables (Placeholders)

```env
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
```
