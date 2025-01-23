'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const GlobalLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const startLoading = () => setIsLoading(true);
    const stopLoading = () => setIsLoading(false);

    // Listen for page transitions
    window.addEventListener('popstate', startLoading);
    
    // Use Next.js router events
    //eslint-disable-next-line
    const handleRouteChangeStart = () => setIsLoading(true);
      //eslint-disable-next-line
    const handleRouteChangeComplete = () => setIsLoading(false);
      //eslint-disable-next-line
    const handleRouteChangeError = () => setIsLoading(false);

    // Add custom event listeners
    window.addEventListener('start-loading', startLoading);
    window.addEventListener('stop-loading', stopLoading);

    return () => {
      window.removeEventListener('popstate', startLoading);
      window.removeEventListener('start-loading', startLoading);
      window.removeEventListener('stop-loading', stopLoading);
    };
  }, []);

  // Reset loading state when pathname changes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin-reverse"></div>
      </div>
    </div>
  );
};

export default GlobalLoader;