'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const dashboardPaths = [
    '/dashboard',
    '/my-artworks', 
    '/upload-artwork',
    '/sales',
    '/purchases',
    '/profile',
    '/settings'
  ];

  useEffect(() => {
    if (dashboardPaths.includes(pathname)) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [pathname]);

  return { isLoading, isDashboardPage: dashboardPaths.includes(pathname) };
};