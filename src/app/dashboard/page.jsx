// src/app/dashboard/page.jsx
'use client';

import DashboardUI from '@/components/UI/dashboardUI';

export default function DashboardPage() {

  return (
    <main
      className={`min-h-screen bg-gradient-to-b from-gray-50 to-white`}
    >
      <DashboardUI />
    </main>
  );
}
