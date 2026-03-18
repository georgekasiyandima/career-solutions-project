/**
 * Compatibility layer for migrating from React Router to Next.js
 * This allows components to use Next.js navigation while maintaining compatibility
 */

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Hook to replace useNavigate from react-router-dom
export function useNavigate() {
  const router = useRouter();
  
  return (to, options = {}) => {
    if (typeof to === 'string') {
      if (options.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    } else if (typeof to === 'number') {
      // Handle goBack/goForward
      if (to === -1) {
        router.back();
      } else if (to === 1) {
        router.forward();
      }
    }
  };
}

// Hook to replace useLocation from react-router-dom
export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  return {
    pathname,
    search: searchParams.toString() ? `?${searchParams.toString()}` : '',
    hash: '',
    state: null,
  };
}

// Hook to replace useParams from react-router-dom
export function useParams() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Extract dynamic route params from pathname
  // This is a simplified version - Next.js params are passed via props in App Router
  // For components that need params, they should receive them as props
  return {};
}

// Export Next.js Link as a drop-in replacement
export { Link };

// Export Navigate component equivalent
export function Navigate({ to, replace = false }) {
  const router = useRouter();
  
  if (typeof window !== 'undefined') {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }
  
  return null;
}

