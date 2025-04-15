// src/app/categories/page.jsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useSocialAuth } from "@/context/socialAuthContext";
import { supabaseClient } from "@/lib/supabaseClient";
import { signIn } from "@/reduxStore/actions/authActions";
import CategoryUI from "@/components/UI/categoryLayout/categoryUI";
import LoadingScreen from "@/components/utilsDir/loadingUI";

export default function CategoriesPage() {
  //eslint-disable-next-line
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, setError } = useSocialAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  //eslint-disable-next-line
  const [isAuthenticated, setIsAuthenticated] = useState(!!user); // Default to user's auth state

  useEffect(() => {
    const handleAuthRedirect = async () => {
      if (typeof window !== "undefined") {
        const hash = window.location.hash;

        if (hash && hash.includes("access_token")) {
          try {
            setIsProcessing(true);

            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get("access_token");
            const refreshToken = params.get("refresh_token");

            if (accessToken && refreshToken) {
              const { data, error } = await supabaseClient.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

              if (error) {
                console.error("Error setting session:", error);
                setError(error.message || "Authentication failed");
                return;
              }

              if (data.session?.user) {
                localStorage.setItem("userData", JSON.stringify(data.session.user));
                dispatch(signIn(data.session.user));
                setIsAuthenticated(true);
              }

              // Clean the URL
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          } catch (e) {
            console.error("Error processing auth tokens:", e);
            setError("Failed to process authentication tokens");
          } finally {
            setIsProcessing(false);
          }
        } else {
          checkExistingSession();
        }
      }
    };

    const checkExistingSession = async () => {
      try {
        const { data } = await supabaseClient.auth.getSession();

        if (data.session?.user) {
          localStorage.setItem("userData", JSON.stringify(data.session.user));
          dispatch(signIn(data.session.user));
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Error checking existing session:", e);
        setError("Failed to verify authentication status");
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthRedirect();
  }, [dispatch, setError]);

  return (
    <>
      <LoadingScreen isProcessing={isProcessing} />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <CategoryUI />
      </main>
    </>
  );
}
