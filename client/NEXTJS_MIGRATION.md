# Next.js Migration Guide

This document outlines the migration from Create React App to Next.js 14.

## What Changed

### Project Structure
- **Before**: `src/App.jsx` with React Router
- **After**: `app/` directory with file-based routing

### Routing
- **Before**: React Router with `<Routes>` and `<Route>` components
- **After**: Next.js App Router with file-based routing
  - `/` → `app/page.jsx`
  - `/about-us` → `app/about-us/page.jsx`
  - `/jobs/:id` → `app/jobs/[id]/page.jsx`

### Navigation
- **Before**: `react-router-dom` hooks (`useNavigate`, `useParams`, `Link`)
- **After**: Next.js navigation (`next/navigation` hooks, `next/link`)

### Environment Variables
- **Before**: `REACT_APP_API_URL`
- **After**: `NEXT_PUBLIC_API_URL` (or `REACT_APP_API_URL` for backward compatibility)

## Migration Status

✅ **Completed:**
- Next.js configuration (`next.config.js`)
- Root layout (`app/layout.jsx`)
- All public pages migrated
- All admin pages migrated
- Protected routes implemented
- Environment variables updated

⚠️ **Needs Manual Updates:**
- Components using `react-router-dom` need to be updated to use Next.js navigation
- Components using `useParams` need to receive params as props
- Components using `Link` from `react-router-dom` need to use `next/link`

## Components That Need Updates

The following components still use React Router and should be updated:

1. **Header.jsx** - Uses `NavLink` and `useNavigate`
2. **Footer.jsx** - Uses `Link` from `react-router-dom`
3. **Login.jsx** - Uses `useNavigate`
4. **Profile.jsx** - Uses `useNavigate` and `NavLink`
5. **Services.jsx** - Uses `useNavigate`
6. **Payment.jsx** - Uses `useNavigate` and `useSearchParams`
7. **FAQ.jsx** - Uses `useNavigate`
8. **EnquiryForm.jsx** - Uses `useNavigate` and `useLocation`
9. **BookingForm.jsx** - Uses `useNavigate`
10. **HeroSection.jsx** - Uses `useNavigate`
11. **Jobs.jsx** - Uses `Link` from `react-router-dom`
12. **StoryCard.jsx** - Uses `Link` from `react-router-dom`
13. **AdminDashboard.jsx** - Uses `Link` and `useNavigate`

## Quick Fix Guide

### Updating Links
```jsx
// Before
import { Link } from 'react-router-dom';
<Link to="/about-us">About</Link>

// After
import Link from 'next/link';
<Link href="/about-us">About</Link>
```

### Updating Navigation
```jsx
// Before
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/login');

// After
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/login');
```

### Updating Params
```jsx
// Before
import { useParams } from 'react-router-dom';
const { id } = useParams();

// After
// In page component, params are passed as props
export default function Page({ params }) {
  const { id } = params;
}
```

## Running the Application

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Next Steps

1. Update all components listed above to use Next.js navigation
2. Test all routes and navigation
3. Update any remaining React Router dependencies
4. Remove `react-router-dom` from package.json if no longer needed
5. Update tests to work with Next.js

## Notes

- The `src/utils/nextRouter.js` file provides compatibility helpers but components should be migrated directly
- All pages are marked as `'use client'` because they use client-side features (Material-UI, hooks, etc.)
- Server-side rendering can be added later for better SEO and performance

