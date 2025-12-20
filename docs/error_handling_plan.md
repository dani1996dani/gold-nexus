# Error Handling & Toasts Plan

The goal is to replace intrusive `alert()` calls and silent `console.error()` logs (where user feedback is needed) with professional Toast notifications using `sonner`.

## ✅ Phase 1: Setup

- [ ] Create branch `feat/error-handling-toasts`.
- [ ] Install `sonner` via shadcn-ui.
- [ ] Add `<Toaster />` to the root layout (`src/app/layout.tsx`).

## ✅ Phase 2: Implementation (File Checklist)

Identify user-facing error scenarios and add `toast.error()`.

### Pages (`src/app`)
- [ ] `src/app/checkout/page.tsx`: Replace `alert` and `console.error` on payment failure.
- [ ] `src/app/sell-gold/page.tsx`: Add toast for form submission errors (currently `console.error`).
- [ ] `src/app/admin/products/import/page.tsx`: Add toast for upload/import failures (currently `console.error`).
- [ ] `src/app/admin/orders/[id]/page.tsx`: Add toast if order details fail to load.

### Components (`src/components`)
- [ ] `src/components/admin/product-actions.tsx`: Add toast for "Delete product" failure.
- [ ] `src/components/navbar.tsx`: Add toast for "Logout" failure.
- [ ] `src/components/HighlightedProducts.tsx`: Keep console.error (internal data fetching), maybe add "Failed to load products" toast if critical? (Optional)

## ✅ Phase 3: Verification

- [ ] Verify build passes.
- [ ] Verify clean linting.
