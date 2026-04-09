# TasteNest 🍽️

TasteNest is a feature-rich, production-ready, and professional restaurant web application. Built with a modern modular stack divided into a Next.js client and an Express/Prisma server. 

## 🌐 Live URLs
- **Frontend Live URL**: _Add your deployed Vercel frontend URL here_
- **Backend Live API**: _Add your deployed backend Vercel URL here_

## 🔑 Admin Credentials
To access the Super Admin Dashboard and manage the restaurant, log in using the following credentials:
- **Email:** `admin@tastenest.com`
- **Password:** `12345678`

> **Note**: This account is structurally assigned as the `super_admin`. It grants full system authority, meaning you can manage other admin roles, view revenue charts, and utilize cascade delete functions safely.

---

## 🚀 Key Features

### 🎨 Global UI & Design
- **Rich Aesthetics**: Vibrant color schemes, curated typography, and an automatic **Dark Mode** with 100% color contrast support.
- **Glassmorphism & Animations**: Smooth hover transitions, Framer Motion scrolling reveals, and dynamic loading states.
- **Fully Responsive**: Uncompromising layout integrity across mobile, tablet, and desktop devices.
- **Robust Forms**: Real-time validation, success states, loaders, and intelligent error handling across all inputs.

### 🏠 Intelligent Frontend Hub
- **Advanced Navigation**: Sticky transparent header that morphs on scroll with a responsive slide-out mobile menu.
- **AI Smart Search**: Type-ahead AI-driven search suggestions that intelligently predict dishes based on live intent.
- **Menu Filtering**: Live `Min` / `Max` price range filter sliders and categorical sorting powered by instantaneous URL queries.
- **Trust & Social Elements**: Customer testimonials, Master Chef profiles, and engaging newsletter integration blocks.

### 🛡️ Authentication & Security
- **Modern Auth**: Secure Email & Password registration alongside advanced Social OAuth (Google & Facebook via Better Auth).
- **Strict Role Hierarchy**: Implements `user`, `admin`, and `super_admin` tiers.
- **Lockdown Protections**: Standard admins can manage food, but are visually and functionally locked from modifying or deleting fellow administrators.

### 📊 Super Admin Dashboard
- **Data Visualization**: Real-time interactive revenue charts and pie graphs mapping out distribution parameters using `Recharts`.
- **Order Management**: Streamlined panel to process incoming reservations and food deliveries instantly.
- **Cascade Safe Deletion**: Prompts confirmation prior to wiping users, safely managing Prisma foreign key relations associated with their historical orders.

### 📑 Professional Pages
- **Contact Center**: Rich structural layout featuring business hours, local contacts, and a direct message form widget.
- **Help & FAQ**: Expandable accordion-style interface to resolve common queries dynamically.
- **Privacy Policy**: Detailed documentation covering data flow and application integrity.
- **Graceful Degradation**: Beautiful "Under Construction" boundaries mapped out for future features (e.g., localized App Store routing).

---

## 🛠️ Tech Stack

**Frontend Repository:**
- **Framework**: Next.js 15 (App Router)
- **Library**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **Animation & Data**: Framer Motion & Recharts
- **Auth Interface**: Better Auth (Client Integration)

**Backend Repository:**
- **Engine**: Node.js & Express setup
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod (Schema & Input sanitization)
- **Services**: Stripe Gateway Integration

---

## ⚙️ Local Development Setup

### 1. Clone repositories (Client and Server)
```bash
git clone <your-frontend-repo-url>
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Variables
Create a `.env` file at the root of the frontend folder:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
BETTER_AUTH_URL=http://localhost:5000
```

### 4. Run the Client
```bash
pnpm dev
```
