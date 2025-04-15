// src/app/create_profile/artist_profile/page.jsx


"use client";

import React, { Suspense } from "react";
import ArtistProfile from "@/components/UI/profileLayout/artistProfileForm";
import ProtectedLayout from "@/components/utilsDir/protectedLayout";
import LoadingScreen from "@/components/utilsDir/loadingUI";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/lib/svgFonts/svgFonts";

export default function ArtistProfilePage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/create_profile");
  };

  return (
    <ProtectedLayout>
      <div
        className="w-full min-h-screen flex flex-col relative px-6 py-12"
        style={{
          background:
            "linear-gradient(to bottom, rgb(220, 237, 245) 70%, rgb(240, 248, 252) 70%)",
        }}
      >
        {/* Fixed Back Button */}
        <button
          onClick={handleBack}
          className="fixed top-16 left-6 z-50 p-3 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
          aria-label="Go back to create profile"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-700 transition-transform duration-300 transform hover:scale-110 focus:scale-110" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Create Artist Profile</h1>

        {/* Ensuring the <p> tag is visible on mount */}
        <p className="text-gray-600 text-center mt-8 mb-4">
          Fill in your business details to showcase your services on BandHit.
        </p>

        {/* Suspense Wrapper */}
        <Suspense fallback={<LoadingScreen message="Loading Artist Profile..." />}>
          <ArtistProfile />
        </Suspense>
      </div>
    </ProtectedLayout>
  );
}
