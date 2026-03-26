# TasteNest Client

TasteNest is a full-stack restaurant web application. This repository contains the frontend built with Next.js and Tailwind CSS.

## Project Description

The client app provides:

- Public marketing homepage with modern responsive sections
- User authentication (Better Auth with email/password and social login)
- Menu browsing and category filtering
- Cart management and order flow
- Role-based dashboard navigation for admin and user

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Better Auth (client-side integration)

## Live URL

- Frontend Live URL: _Add your deployed frontend URL here_

## Features

- Responsive homepage with navbar, footer, and multiple sections
- Sign up / sign in with protected routes
- Role-based UI behavior (admin vs user)
- CRUD integration for menu management (admin)
- Cart operations with real backend API integration
- Loading states and toast-based error feedback

## Setup Instructions

### 1. Clone repository

```bash
git clone <your-frontend-repo-url>
cd tastenest-client
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file in project root:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
BETTER_AUTH_URL=http://localhost:5000
```

### 4. Run development server

```bash
pnpm dev
```

### 5. Build for production

```bash
pnpm build
pnpm start
```

## Related Links

- Backend Repository: _Add your backend repo URL here_
- Backend Live URL: _Add your backend live URL here_
