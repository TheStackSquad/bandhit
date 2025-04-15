//src/context/socialAuthContext.jsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

const SocialAuthContext = createContext();

export const SocialAuthProvider = ({ children }) => {
    // State management
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);
    const [accessToken, setAccessToken] = useState(null); // Add accessToken state
    const [loadingProviders, setLoadingProviders] = useState({
        facebook: false,
        google: false
    });

    useEffect(() => {
        // Skip execution on server-side
        if (typeof window === "undefined") return;

        // Initialize auth state and access token
        const initializeAuth = async () => {
            try {
                const { data, error } = await supabaseClient.auth.getSession();
                if (error) {
                    console.error("getSession Error:", error);
                    setError(error.message);
                } else {
                    setUser(data?.session?.user || null);
                    setAccessToken(data?.session?.access_token || null); // Extract accessToken
                }
            } finally {
                setIsLoading(false);
                setIsInitialized(true);
            }
        };

        initializeAuth();

        // Set up auth state change listener
        const { data: authListener } = supabaseClient.auth.onAuthStateChange(
            async (event, session) => {
                const currentUser = session?.user || null;
                setUser(currentUser);
                setAccessToken(session?.access_token || null); // Update accessToken on auth change
                setIsLoading(false);
                setIsInitialized(true);

                // Reset any previous errors when auth state changes
                if (event === 'SIGNED_IN') {
                    setError(null);
                }
            }
        );

        // Clean up listener on unmount
        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, []);

    /**
     * Sign in with a social provider
     * @param {string} provider - The provider to sign in with (e.g., 'google', 'facebook')
     */
    const signInWithProvider = async (provider) => {
        try {
            // Update loading state for specific provider
            setLoadingProviders(prev => ({ ...prev, [provider]: true }));
            setError(null);

            // Configure the redirect URL - use the exact category path
            const redirectTo = `${window.location.origin}/categories`;
            //eslint-disable-next-line
            const { data, error } = await supabaseClient.auth.signInWithOAuth({
                provider: provider.toLowerCase(),
                options: {
                    redirectTo: redirectTo,
                    // Important: Set this to false to ensure proper hash fragment handling
                    skipBrowserRedirect: false
                }
            });

            if (error) {
                throw error;
            }

            return { success: true };
        } catch (err) {
            console.error(`Sign in with ${provider} error:`, err.message);
            setError(err.message || `Failed to sign in with ${provider}`);
            return { success: false, message: err.message };
        } finally {
            setLoadingProviders(prev => ({ ...prev, [provider]: false }));
        }
    };

    /**
     * Sign out the current user
     */
    const signOut = async () => {
        try {
            setIsLoading(true);
            const { error } = await supabaseClient.auth.signOut();

            if (error) {
                throw error;
            }

            setUser(null);
            setAccessToken(null); // Clear accessToken on sign out

            if (typeof window !== "undefined") {
                localStorage.removeItem("userData"); // You might want to remove the Supabase auth token as well
            }

            return { success: true, message: 'Signed out successfully!' };
        } catch (err) {
            console.error('Sign out error:', err.message);
            setError(err.message || 'An unexpected error occurred during sign out');
            return { success: false, message: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    // Function to manually set user data (useful for syncing with Redux)
    const syncUserData = (userData) => {
        if (userData) {
            setUser(userData);
            setError(null);
        }
    };

    // Context value object
    const contextValue = {
        user,
        isLoading,
        isInitialized,
        error,
        accessToken, // Include accessToken in the context value
        loadingProviders,
        signInWithProvider,
        signOut,
        setError,
        syncUserData
    };

    // Provide context to children
    return (
        <SocialAuthContext.Provider value={contextValue}>
            {children}
        </SocialAuthContext.Provider>
    );
};

// Custom hook for using the auth context
export const useSocialAuth = () => {
    const context = useContext(SocialAuthContext);
    if (!context) {
        throw new Error("useSocialAuth must be used within a SocialAuthProvider");
    }
    return context;
};