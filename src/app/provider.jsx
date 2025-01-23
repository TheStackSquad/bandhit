// src/app/provider.jsx
"use client";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { LazyMotion, domAnimation } from "framer-motion";
import { store, persistor } from "@/reduxStore/store";
import ErrorBoundary from '@/app/errorBoundary';
import { PerformanceWrapper } from '@/utils/debugLibrary/performanceWrapper';
import { SafeHydration } from '@/components/SafeHydration';
import { ToastContainer } from '@/utils/alertManager';
import GlobalLoader from '@/components/UI/GlobalLoader';

export default function Providers({ children }) {
  return (
    <PerformanceWrapper id="ClientProviders">
      <ErrorBoundary>
        <SafeHydration>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ToastContainer />
              <LazyMotion features={domAnimation}>
              <GlobalLoader />
                {children}
              </LazyMotion>
            </PersistGate>
          </Provider>
        </SafeHydration>
      </ErrorBoundary>
    </PerformanceWrapper>
  );
}