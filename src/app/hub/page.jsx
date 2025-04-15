// src/app/hub/page.jsx - updated version

'use client';

import { useGetHubProfilesQuery } from "@/reduxStore/api/hubApi";
import HubHeader from "@/components/UI/hub/HubHeader";
import HubGrid from "@/components/UI/hub/HubGrid";
import LoadingScreen from "@/components/utilsDir/loadingUI";

const HubPage = () => {
  const { data: profiles, isLoading, error, refetch } = useGetHubProfilesQuery();

  // Detailed logging of what we receive
  // console.log("Hub Page Render State:", {
  //   profilesLoaded: profiles?.length || 0,
  //   isLoading,
  //   hasError: !!error
  // });

  if (isLoading) return <LoadingScreen isProcessing={true} message="Loading profiles..." />;

  if (error) {
    console.error("Hub API Error:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <p className="text-red-500 mb-4">Error loading profiles</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Handle empty profiles array
  if (!profiles || profiles.length === 0) {
    return (
      <main className="bg-gray-50 min-h-screen px-4">
        <HubHeader />
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-gray-500">No profiles found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen px-4">
      <HubHeader />
      <HubGrid data={profiles} />
    </main>
  );
};

export default HubPage;