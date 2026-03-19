# FullStackExamParthRamchandani20260319

Mini full-stack e-commerce application built for the exam brief:
- Back end: Node.js + Express, MVC pattern
- Databases: PostgreSQL (users/orders/order_items) + MongoDB (products/cart)
- Front end: Next.js with TypeScript and SSR product listing

## Project Structure

`backend/`
- `src/config`: DB connection files
- `src/models/sql`: SQL models (`User`, `Order`, `OrderItem`)
- `src/models/mongo`: MongoDB models (`Product`, `Cart`)
- `src/controllers`: MVC controller logic
- `src/routes`: route modules (`auth`, `products`, `cart`, `orders`, `reports`)
- `src/middleware`: auth and request validation
- `sql/schema.sql`: PostgreSQL schema
- `tests`: integration test example

`frontend/`
- `pages/index.tsx`: SSR product listing
- `pages/products/[id].tsx`: dynamic product detail page
- `pages/cart.tsx`: cart and checkout UI
- `pages/orders.tsx`: order history
- `pages/reports.tsx`: SQL + Mongo report UI
- `pages/login.tsx`, `pages/register.tsx`: authentication pages

## Features Implemented

1. **Authentication**
   - Register/login APIs with hashed passwords (`bcryptjs`)
   - JWT-based protected routes

2. **Product Catalog**
   - MongoDB `Product` model
   - Full CRUD (`GET`, `POST`, `PUT`, `DELETE`) for products
   - Pagination + search/filter in list endpoint and frontend controls
   - Text index + aggregation usage

3. **Cart & Checkout**
   - User cart stored in MongoDB
   - Add-to-cart from product listing and product detail pages
   - Checkout creates SQL order + order_items in transaction
   - Cart cleared after successful checkout

4. **Reports**
   - SQL advanced queries:
     - Daily revenue (last 7 days)
     - Top spenders
   - Mongo aggregation:
     - Product summary by category

5. **Testing**
   - Auth integration test (`backend/tests/auth.integration.test.js`)
   - Checkout controller test for critical purchase flow (`backend/tests/checkout.controller.test.js`)

## Prerequisites

- Node.js 18+
- PostgreSQL
- MongoDB

## Environment Variables

Create `backend/.env` (copy from `backend/env.example`):

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=replace-with-a-strong-secret
POSTGRES_URI=postgresql://postgres:postgres@localhost:5432/fullstack_exam
MONGODB_URI=mongodb://127.0.0.1:27017/fullstack_exam
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

## Setup Instructions

### 1) SQL schema

Run `backend/sql/schema.sql` against your PostgreSQL database.

### 2) Backend

```bash
cd backend
npm install
npm run seed:products
npm run dev
```

Backend API base: `http://localhost:5000/api`

### 3) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend app: `http://localhost:3000`

## Important Notes

- Product list uses **SSR** (`getServerSideProps`) as required.
- Product details use **dynamic route** (`/products/[id]`).
- Controllers are separated cleanly and do not directly contain DB setup logic.
- SQL and Mongo responsibilities are intentionally split by model type for readability.
