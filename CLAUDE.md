# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flash Coupon Frontend is a Next.js 16 application for a first-come-first-served (FCFS) coupon issuance system. It's designed to work with a backend that uses Redis Lua scripts for atomic coupon operations and PostgreSQL for persistence.

## Development Commands

```bash
npm run dev      # Start dev server on port 3001
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Tech Stack
- **Next.js 16** with App Router
- **React 19** with Server Components support
- **TanStack Query** for server state management (5-second stale time, auto-refetch disabled on window focus)
- **Tailwind CSS v4** with PostCSS
- **Framer Motion** for animations
- **Axios** for API calls

### Project Structure
```
app/
├── layout.tsx          # Root layout with Providers wrapper
├── page.tsx            # Home page with navigation
├── admin/
│   ├── page.tsx        # Admin dashboard (coupon list, stats, Redis sync)
│   └── coupons/new/    # Coupon creation form
├── user/page.tsx       # User coupon page (issue, view, use coupons)
├── realtime/page.tsx   # Real-time coupon status monitoring (2s polling)
└── register/page.tsx   # User registration

lib/
├── api.ts              # Axios API client with couponAPI object
├── types.ts            # TypeScript interfaces (Coupon, User, IssuedCoupon, etc.)
└── providers.tsx       # React Query provider setup
```

### API Integration
All API calls go through `lib/api.ts` using axios. The base URL is configured via `NEXT_PUBLIC_API_URL` environment variable.

Key API endpoints:
- Admin: `/api/admin/coupons/*` (CRUD, issue, sync)
- User: `/api/user/coupons/*` (my-coupons, use)
- Users: `/api/users/test` (registration)

### Configuration
- Base path: `/flash-coupon` (configured in next.config.js)
- Output: `standalone` for Docker deployment
- Path alias: `@/*` maps to project root

### State Management
- User session stored in `localStorage` as `currentUser`
- React Query handles all server state with automatic refetching (5s for lists, 2s for realtime page)
