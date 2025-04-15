// src/app/dashboard/page.jsx
'use client';

import DashboardUI from '@/components/UI/dashboardLayout/dashboardUI';
import { Suspense } from 'react';
import ProtectedLayout from '@/components/utilsDir/protectedLayout';
import LoadingScreen from '@/components/utilsDir/loadingUI';

export default function DashboardPage() {

  return (
    <Suspense fallback={<LoadingScreen message="Bandhit: Loading..." />}>
      <ProtectedLayout>
        <DashboardUI />
      </ProtectedLayout>
    </Suspense>
  );
}
