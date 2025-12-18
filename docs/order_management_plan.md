# Admin Order Management Feature Plan

**Goal:** Implement a secure Admin UI to view a paginated list of all orders and view details of a single order.

---

### **Phase 1: Backend API Development**

1.  **Centralized Order Data Access Functions (`src/lib/data/orders.ts`):**
    *   **`getOrders(page: number, limit: number)`:**
        *   **Functionality:** Fetches a paginated list of orders from Prisma.
        *   **Inclusions:** Eager load related `user` (selecting `id`, `fullName`, `email`) and `items` (including nested `product` details: `name`, `sku`).
        *   **Pagination:** Implements `skip` and `take` based on `page` and `limit`.
        *   **Counting:** Uses `prisma.order.count()` for total records.
        *   **Serialization:** Converts Prisma's `Decimal` types (`totalAmount`, `priceAtPurchase`) to `string` during serialization for API compatibility. Also ensures `shippingAddressJson` is returned as a plain object.
        *   **Return:** `{ data: Order[], pagination: { total, page, limit, totalPages } }`.
    *   **`getOrderById(id: string)`:**
        *   **Functionality:** Fetches a single order by its `id` from Prisma.
        *   **Inclusions:** Eager load related `user` (selecting `id`, `fullName`, `email`) and `items` (including nested `product` details: `name`, `sku`).
        *   **Serialization:** Converts `Decimal` types to `string` and handles `shippingAddressJson` (returns as a plain object).
        *   **Return:** The order object (or `null` if not found).

2.  **Order Management API Endpoints (`src/app/api/admin/orders/...`):**
    *   **`GET /api/admin/orders/route.ts`:**
        *   **Create File:** `src/app/api/admin/orders/route.ts`
        *   **Protection:** Wrap the handler with `withAdminAuth`.
        *   **Logic:** Parse `page` and `limit` from `req.nextUrl.searchParams` (remembering the `await searchParams` pattern). Call `getOrders()` and return the paginated order data.
    *   **`GET /api/admin/orders/[id]/route.ts`:**
        *   **Create File:** `src/app/api/admin/orders/[id]/route.ts` (and directory).
        *   **Protection:** Wrap the handler with `withAdminAuth`.
        *   **Logic:** Extract `id` from `context.params` (remembering `await context.params`). Call `getOrderById()` and return the single order data or a 404.

---

### **Phase 2: Frontend UI Development**

1.  **Admin Layout Navigation Update (`src/app/admin/layout.tsx`):**
    *   **Update Link:** Add a new `Link` to `/admin/orders` in the existing sidebar navigation. Place it after the "Leads" link.
    *   **Icon:** Use `ShoppingCart` icon from `lucide-react`.

2.  **Order List Page (`src/app/admin/orders/page.tsx`):**
    *   **Create File:** `src/app/admin/orders/page.tsx`
    *   **Type:** Server Component.
    *   **Data Fetching:** Call `getOrders()` directly (not the API route) with `page` and `limit` from `searchParams` (remembering `await searchParams`).
    *   **UI:** Display data in a `shadcn/ui` `Table`.
        *   **Columns:** Order ID, Customer Name, Total Amount, Status, Order Date.
        *   **Status Badge:** Reuse the `StatusBadge` component for `OrderStatus` values.
        *   **Pagination:** Implement Previous/Next buttons for navigation (similar to Leads page).
        *   **Actions:** Each row will have a "View Details" `Link` to `/admin/orders/[id]`.

3.  **Order Detail Page (`src/app/admin/orders/[id]/page.tsx`):**
    *   **Create File:** `src/app/admin/orders/[id]/page.tsx`
    *   **Type:** Server Component.
    *   **Data Fetching:** Extract `id` from `params` (remembering `await params`). Call `getOrderById()` directly. Use `notFound()` if order not found.
    *   **UI:** Display all order details:
        *   **Order Info:** Order ID, Total Amount, Currency, Status (using `StatusBadge`), Payment Intent ID, Dates.
        *   **Customer Info:** Full Name, Email (from `order.user`).
        *   **Shipping Address:** Parse and display `shippingAddressJson` clearly.
        *   **Order Items:** Display `order.items` in a nested `Table` or list, showing `Product Name`, `SKU`, `Quantity`, `Price at Purchase`.
        *   **Navigation:** Include a "Back to All Orders" link.

---
