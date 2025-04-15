// src/app/reel/page.jsx
'use client';

import React, { useEffect } from 'react';
import { useReels } from '@/utils/reelUtils/useReels';
import { useSearchParams, useRouter } from 'next/navigation';

const ReelPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL query parameters
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');

  // Initialize with URL parameters if available
  const {
    reels,
    pagination,
    isLoading,
    isError,
    error,
    isFetching,
    goToNextPage,
    goToPrevPage,
    goToPage,
    currentPage,
    currentLimit
  } = useReels(
    pageParam ? parseInt(pageParam, 10) : 1,
    limitParam ? parseInt(limitParam, 10) : 9
  );

  // Sync URL with state for shareable links
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('limit', currentLimit.toString());

    // Update URL without page reload
    const url = `${window.location.pathname}?${params.toString()}`;
    router.replace(url, { scroll: false });
  }, [currentPage, currentLimit, router]);

  return (
    <main className="w-full bg-sky-100 min-h-screen py-6">
       <div className="px-4 md:px-6 lg:px-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Explore Reels</h2>

          {/* Optional filter UI could go here */}
          {!isLoading && !isError && pagination && (
            <p className="text-gray-600">
              Showing {reels.length} of {pagination.totalItems} reels
            </p>
          )}
        </div>

        {/* Loading state with skeleton UI for better UX */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden bg-gray-200 animate-pulse">
                <div className="aspect-video bg-gray-300"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-medium">Failed to load reels</p>
            <p className="text-sm">{error.message || 'Unknown error occurred'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : reels.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
            </svg>
            <p className="text-gray-500 text-lg mt-4">No reels found</p>
            <p className="text-gray-400 mt-1">Check back later for new content</p>
          </div>
        ) : (
          <>
            {/* Improved Grid with Transition Effects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 px-0 sm:px-4 md:px-6">
                    {reels.map((reel) => (
                      <div
                        key={reel.id}
                        className="group relative rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 w-full"
                      >
                        {/* Video display with lazy loading */}
                        <div className="relative pt-[177.78%]">
                          <video
                            src={reel.video_url}
                            poster={reel.thumbnail_url}
                            controls
                            className="absolute inset-0 w-full h-full object-cover"
                            preload="metadata"
                            loading="lazy"
                          >
                            <track
                              kind="captions"
                              src=""
                              label="English captions"
                              default
                            />
                          </video>

                          {/* Overlay indicator for new content (optional) */}
                          {reel.isNew && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              NEW
                            </div>
                          )}
                        </div>
                        {/* Caption overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          {reel.caption && (
                            <p className="text-white/90 text-sm mt-1 line-clamp-2">
                              {reel.caption}
                            </p>
                          )}
                        </div>
                        {/* Static caption */}
                        <div className="p-3 group-hover:hidden">
                          {reel.caption && (
                            <p className="text-gray-700 text-sm line-clamp-2">
                              {reel.caption}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

            {/* Enhanced Pagination with Page Numbers */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1 || isFetching}
                  className="px-4 py-2 rounded-md bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>

                {/* Page numbers for quick navigation */}
                <div className="flex gap-1 mx-2">
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNumber = index + 1;

                    // Show first page, last page, current page and neighbors
                    if (
                      pageNumber === 1 ||
                      pageNumber === pagination.totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          disabled={isFetching}
                          className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${pageNumber === currentPage
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }

                    // Show ellipsis for breaks
                    if (
                      pageNumber === 2 ||
                      pageNumber === pagination.totalPages - 1
                    ) {
                      return <span key={pageNumber} className="w-10 h-10 flex items-center justify-center">...</span>;
                    }

                    return null;
                  })}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === pagination.totalPages || isFetching}
                  className="px-4 py-2 rounded-md bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Loading overlay for subsequent fetches */}
        {!isLoading && isFetching && (
          <div className="fixed bottom-4 right-4 bg-white p-3 rounded-full shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </section>
      </div>
    </main>
  );
};

export default ReelPage;