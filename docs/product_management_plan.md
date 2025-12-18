# Product Management Implementation Plan

This document outlines the strategy and checklist for implementing the Product Management feature for the Gold Nexus admin panel.

## ✅ Phase 0: Planning & Setup

- [x] Create feature branch `feat/admin-product-management`.
- [x] Define implementation plan and get user approval.
- [x] Write final plan to this file.

## ✅ Phase 1: Foundational CRUD Functionality

This phase focuses on building the core components for managing a single product.

- [x] **Backend (API Endpoints):**
    - [x] Create `src/lib/data/products.ts` for data access logic.
    - [x] Implement `getProducts` function in `products.ts` to fetch all products for the admin view.
    - [x] Create `src/app/api/admin/products/route.ts`.
    - [x] Implement `GET` handler in `route.ts` to list all products.
    - [x] Implement `POST` handler in `route.ts` to create a single new product.
    - [x] Create `src/app/api/admin/products/[id]/route.ts`.
    - [x] Implement `GET` handler in `[id]/route.ts` to retrieve a single product.
    - [x] Implement `PUT` handler in `[id]/route.ts` to update a single product.
    - [x] Implement `DELETE` handler in `[id]/route.ts` to delete a single product.
- [x] **Frontend (UI Pages):**
    - [x] Create `/admin/products/page.tsx` to display a paginated table of all products.
    - [x] The product table should be searchable and sortable.
    - [x] Each row in the table will have "Edit" and "Delete" action buttons.
    - [x] Create `/admin/products/new/page.tsx` with a form for creating a single product.
    - [x] Create `/admin/products/[id]/edit/page.tsx` with a form for editing a product.

## ✅ Phase 2: Bulk Image Management

This phase addresses linking images to products in a user-friendly way for bulk imports.

- [x] **Backend (Storage & API):**
    - [x] Configure a public bucket in Supabase Storage for product images.
    - [x] Create `POST /api/admin/products/upload-images` endpoint to handle multi-image uploads.
    - [x] The endpoint will rename files based on the incoming filename to match SKUs.
- [x] **Frontend (UI):**
    - [x] Create `/admin/products/import/page.tsx`.
    - [x] Implement a multi-step UI on this page.
    - [x] **Step 1:** A dropzone for bulk image uploads, with clear instructions about the SKU-based file naming convention.

## ✅ Phase 3: CSV Bulk Import

This phase implements the CSV import functionality, leveraging the image management from Phase 2.

- [x] **Backend (API):**
    - [x] Create `POST /api/admin/products/import-csv` endpoint.
    - [x] The API will parse the CSV, validate data, automatically construct the `imageUrl` from the `sku`, and create/update products.
    - [x] The API should generate a report of successes and failures.
- [x] **Frontend (UI):**
    - [x] **Step 2:** Add a section to the `/admin/products/import` page for the CSV upload.
    - [x] Provide a link to download a CSV template (which will not include the `imageUrl` column).
    - [x] Implement the file upload component for the CSV.
    - [x] Display a summary report to the admin after the import process is complete.

## ✅ Phase 4: Human Review

- [ ] **Backend (API):**
  - [ ] Create `POST /api/admin/products/import-csv` endpoint.
- [ ] **Frontend (UI):**
  - [ ] in bulk import page. in csv file thing, Download template is a csv. maybe better to give excel file?
  - [ ] in bulk import page, there is text "CSV only", will it support excel files or we need to code it up?
  - [ ] the form for add manual product is ugly, looks awful, need a layout rethink.
  - [ ] in the admin panel sidebar, there is a "customers" link. is this needed by the pdf, or can be removed?
  - [ ] in product table, for each item in the 3 dots on the right, there is an "actions" text, that does nothing? its not even a button, what should it do? can it be deleted?
  - [ ] add image of the product in table view and in single view
  - [ ] products page has better header style than leads and orders, change that in the 2 other pages.
  - [ ] Either remove sorting of columns in products, or add it to leads and orders. they need to be consistent.

---

## Design Rationale & Key Decisions

### Admin vs. Marketplace APIs

We will maintain separate API endpoints for the public marketplace and the admin panel (e.g., `/api/products` vs. `/api/admin/products`). This is a critical security and design choice:
- **Security:** Admin routes are protected by `withAdminAuth`, preventing any unauthorized access to management functions or internal data.
- **Data Scope:** Admin endpoints will return *all* data (including inactive/draft products), while public endpoints will only return *active, sellable* products.
- **Data Shape:** Admin endpoints can expose internal fields (like `vendorName`) that should never be sent to the public client.

### UI/UX for Bulk Import Image Linking

The primary challenge for bulk imports is associating images with product data efficiently. After considering several alternatives, the chosen approach is a **SKU-to-filename naming convention**.

- **Why this approach?** For an MVP, it provides the best balance of user-friendliness and implementation simplicity. The main alternative—a manual UI for matching 200+ images to 200+ product rows after an upload—would be extremely tedious and error-prone for the administrator.
- **How it works:** The admin is instructed to name their image files to match the product SKU (e.g., `product-abc.jpg` for SKU `product-abc`). When they upload a CSV of product data, the backend automatically constructs the expected image URL based on the SKU. This completely automates the most time-consuming part of the process.
- **The UI's Role:** The UI's responsibility is to make this process foolproof by providing clear, simple, step-by-step instructions, a template file, and a detailed report of the outcome.
