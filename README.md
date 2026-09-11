# 🍲 FOODWOK

**FOODWOK** is a full-stack, modern food ordering, kitchen management, and payment processing web application built with **Next.js 16 (App Router)**, **React 19**, **Supabase**, and **Paystack**.

---

## 🚀 Key Features

### 🛒 Customer Storefront
- **Interactive Menu (`/menu`)**: Browse menu items by category with rich visuals and quick add-to-cart.
- **Cart Management (`/cart`)**: Dynamic cart state, price calculations, and item adjustments.
- **Seamless Checkout (`/checkout`)**: Paystack payment gateway integration for secure online payments.
- **Shimmer Skeletons**: Smooth loading states across all customer routes using animated shimmer placeholders.

### 👨‍🍳 Admin & Operations Dashboard
- **Admin Hub (`/admin`)**: Overview metrics, sales summary, and administrative quick actions.
- **Kitchen Display System (KDS) (`/admin/kds`)**: Real-time order queue for kitchen staff to track and update order status (Pending, Preparing, Ready, Delivered).
- **Accounting & Reports (`/admin/accounting`)**: Financial reporting, revenue tracking, and payment reconciliations.
- **Menu Management (`/admin/menu`)**: Manage food items, prices, availability, and categories.

### 💳 Payment & Database Backend
- **Paystack Integration (`/api/paystack/*`)**:
  - `initialize`: Initialize online transactions with Paystack.
  - `verify`: Server-side payment verification.
  - `webhook`: Paystack event webhooks for automated order status updates.
- **Supabase Backend (`/api/supabase/*`)**:
  - Database schema (`supabase_schema.sql`) with tables for menus, orders, order items, users, and transactions.
  - Database seeding API (`/api/supabase/seed`) for initial catalog setup.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`, `@supabase/ssr`)
- **Payment Processing**: [Paystack API](https://paystack.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 📁 Directory Structure

```text
FOODWOK/
├── public/                     # Static assets & branding
├── src/
│   ├── app/                    # Next.js App Router routes
│   │   ├── (admin)/admin/      # Admin routes (Dashboard, KDS, Accounting, Menu)
│   │   ├── api/                # Backend API routes (Paystack, Supabase, Accounting)
│   │   ├── auth/               # Authentication routes (Signin, Signup)
│   │   ├── cart/               # Shopping cart page
│   │   ├── checkout/           # Checkout & Payment page
│   │   ├── menu/               # Food menu page
│   │   ├── globals.css         # Global Tailwind CSS styles
│   │   ├── layout.tsx          # Root app layout
│   │   └── loading.tsx         # Shimmer skeleton loader
│   ├── components/             # Reusable UI components
│   │   └── skeletons/          # Shimmer skeleton components
│   └── lib/                    # Supabase client & utility functions
├── .env.example                # Template for environment variables
├── AGENTS.md                   # Project rules and agent instructions
├── CLAUDE.md                   # Development workflow guidelines
├── package.json                # Project dependencies and scripts
└── supabase_schema.sql         # Supabase PostgreSQL database schema
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm**, **pnpm**, **yarn**, or **bun**
- A **Supabase** project
- A **Paystack** developer account (Test/Live API keys)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PHOENOCIAN23/FOODWOK.git
   cd FOODWOK
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and update with your actual credentials:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
   PAYSTACK_SECRET_KEY=sk_test_xxx
   ```

4. **Set up Supabase Database**:
   - Run the SQL queries in [`supabase_schema.sql`](./supabase_schema.sql) in your Supabase SQL Editor to create tables.
   - Alternatively, use the seed endpoint at `http://localhost:3000/api/supabase/seed` after starting dev mode.

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build the application for production
- `npm run start` - Start Next.js production server
- `npm run lint` - Run ESLint code checks

---

## 📄 License

This project is licensed under the MIT License.
