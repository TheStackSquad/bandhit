// src/utils/useAuthGuard.jsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthGuard() {
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return; // Skip on server

        try {
            const authDataString = localStorage.getItem('persist:auth');
            const authData = authDataString ? JSON.parse(authDataString) : null;
            const user = authData?.user ? JSON.parse(authData.user) : null;
            const isAuthenticatedFromStorage = !!(authData && authData.isAuthenticated === 'true' && user);

            if (isAuthenticatedFromStorage) {
                setIsAuthenticated(true);
            } else {
                router.push('/signup'); // Redirect to login/account page
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
            setIsAuthenticated(false);
            router.push('/account'); // Redirect on error
        } finally {
            setIsAuthChecked(true);
        }
    }, [router]);

    return { isAuthChecked, isAuthenticated };
}