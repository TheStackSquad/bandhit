// src/app/provider.jsx
"use client";

import { Suspense } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SocialAuthProvider } from "@/context/socialAuthContext";
import { store, persistor } from "@/reduxStore/store";
import ErrorBoundary from "@/app/errorBoundary";
import { PerformanceWrapper } from "@/utils/debugLibrary/performanceWrapper";
import { SafeHydration } from "@/components/SafeHydration";
import { ToastContainer } from "@/lib/alertManager";
import LoadingScreen from "@/components/utilsDir/loadingUI";
import { useGetEventsQuery } from "@/reduxStore/api/eventsApi";
import { useGetHubProfilesQuery } from "@/reduxStore/api/hubApi";
import { useGetReelsQuery } from "@/reduxStore/api/reelApi";
import { useGetEventLikeStatusQuery } from '@/reduxStore/api/likeApi';

// Component to prefetch events data globally
function GlobalEventFetcher() {
  useGetEventsQuery(); // Automatically fetches and caches events
  return null;
}

// Component to prefetch hub profiles globally
function GlobalHubFetcher() {
  useGetHubProfilesQuery(); // Automatically fetches and caches hub profiles
  return null;
}

// Component to prefetch reels data globally
function GlobalReelsFetcher() {
  useGetReelsQuery(); // Automatically fetches and caches reels
  return null;
}

// Component to prefetch reels data globally
function GlobalLikesFetcher() {
  useGetEventLikeStatusQuery(); // Automatically fetches and caches reels
  return null;
}

export default function Providers({ children }) {
  return (
    <PerformanceWrapper id="ClientProviders">
      <SocialAuthProvider>
        <ErrorBoundary>
          <SafeHydration>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <ToastContainer />
                {/* Global data fetchers */}
                <GlobalEventFetcher />
                <GlobalHubFetcher />
                <GlobalReelsFetcher />
                <GlobalLikesFetcher />
                {/* Main content with suspense fallback */}
                <Suspense fallback={<LoadingScreen message="Loading..." />}>
                  {children}
                </Suspense>
              </PersistGate>
            </Provider>
          </SafeHydration>
        </ErrorBoundary>
      </SocialAuthProvider>
    </PerformanceWrapper>
  );
}