//src/components/protectedLayout.jsx

'use client';

import { useState, useEffect } from 'react';
import { useAuthGuard } from '@/utils/otherUtils/useAuthGuard';
import LoadingScreen from '@/components/utilsDir/loadingUI';
//import { usePathname } from 'next/navigation';

export default function ProtectedLayout({ children }) {
    // This tracks client-side hydration completion
    const [isMounted, setIsMounted] = useState(false);
    // const pathname = usePathname();

    // Call hooks unconditionally at the top level
    const { isAuthChecked, isAuthenticated } = useAuthGuard();

    // Set mounted state after component mounts (client-side only)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // While not yet mounted (during SSR or before hydration), show minimal loader
    if (!isMounted) {
        return <LoadingScreen message="Initializing..." />;
    }

    // Show loading screen while checking authentication
    if (!isAuthChecked) {
        return <LoadingScreen message="Checking authentication..." />;
    }

    // Redirect will happen in useAuthGuard if not authenticated
    // This is just a fallback in case the redirect hasn't happened yet
    if (isAuthChecked && !isAuthenticated) {
        return <LoadingScreen message="Redirecting to login..." />;
    }

    // Render children if authenticated and checks passed
    return <>{children}</>;
}
