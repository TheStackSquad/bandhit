// src/app/profile/page.jsx
'use client';

import { useSelector } from 'react-redux'; // Access Redux state
import Image from 'next/image'; // For optimized images
import DashboardUI from '@/components/UI/dashboardUI';
import { josefin } from '../fonts';

export default function DashboardPage() {
  // Access the Redux state
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);


  if (!isAuthenticated) {
    // Protected UI if user is not authenticated
    return (
      <main
        className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white text-center ${josefin.variable} font-josefin`}
      >
        <Image
          src="/uploads/protectedRoute/boredvector.avif"
          alt="Access Denied"
          width={300}
          height={300}
          className="mb-6"
        />
        <h1 className="text-2xl font-bold text-gray-800">Access Restricted</h1>
        <p className="text-gray-600 mt-2">
          You need to be logged in to view this page. Please log in to continue.
        </p>
      </main>
    );
  }

  // Render Dashboard if authenticated
  return (
    <main
      className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${josefin.variable} font-josefin`}
    >
      <DashboardUI />
    </main>
  );
}
