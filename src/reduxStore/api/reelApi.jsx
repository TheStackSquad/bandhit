// src/reduxStore/api/reelApi.js
// Enhanced version of reelApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getBaseUrl = () => {
    // This environment detection is good, but we can improve error handling
    if (typeof window !== "undefined") {
        return window.location.origin + "/api/";
    }
    // Default fallback with clear warning
    const fallbackUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/cloudinary/";
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
        console.warn('[REEL_API] No NEXT_PUBLIC_API_BASE_URL found, using fallback:', fallbackUrl);
    }
    return fallbackUrl;
};

export const reelApi = createApi({
    reducerPath: "reelApi",
    baseQuery: fetchBaseQuery({
        baseUrl: getBaseUrl(),
        prepareHeaders: (headers) => {
            // Consider selective caching strategy instead of disabling cache entirely
            headers.set("Cache-Control", "max-age=60"); // Cache for 60 seconds
            return headers;
        },
    }),
    tagTypes: ["Reel", "ReelCollection"],
    endpoints: (builder) => ({
        getReels: builder.query({
            query: ({ page = 1, limit = 10, filter = {} } = {}) => {
                return {
                    url: "cloudinary/get_reel",
                    params: {
                        page,
                        limit,
                        ...filter // Allow filtering options
                    }
                };
            },
            transformResponse: (response) => {
                // More robust transformation with error handling
                if (!response) {
                    console.error('[REEL_API] Empty response received');
                    return { reels: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: 10 } };
                }

                const transformed = {
                    reels: response.data || response || [],
                    pagination: response.pagination || {
                        currentPage: parseInt(response.page || 1, 10),
                        totalPages: Math.ceil((response.total || 0) / (response.limit || 10)),
                        totalItems: response.total || (response.data || response || []).length,
                        itemsPerPage: response.limit || 10
                    }
                };
                return transformed;
            },
            // Enhanced tag structure for more granular cache invalidation
            providesTags: (result) => {
                if (!result?.reels) return [{ type: "Reel", id: "LIST" }];

                return [
                    { type: "ReelCollection", id: "LIST" },
                    ...result.reels.map(({ id }) => ({ type: "Reel", id: id.toString() }))
                ];
            },
            // Keep your robust error handling
            onQueryStarted: async (arg, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                } catch (error) {
                    console.error('[REEL_API] Query error:', error);
                }
            },
        }),

        // Other endpoints with improved cache invalidation
        addReel: builder.mutation({
            query: (reelData) => ({
                url: "cloudinary/get_reel",
                method: "POST",
                body: reelData,
            }),
            // More specific invalidation
            invalidatesTags: [{ type: "ReelCollection", id: "LIST" }],
        }),

        deleteReel: builder.mutation({
            query: (id) => ({
                url: `cloudinary/get_reel/${id}`,
                method: "DELETE",
            }),
            // More specific invalidation
            invalidatesTags: (result, error, id) => [
                { type: "Reel", id: id.toString() },
                { type: "ReelCollection", id: "LIST" }
            ],
        }),

        // New endpoint for prefetching individual reels
        getReelById: builder.query({
            query: (id) => `cloudinary/get_reel/${id}`,
            providesTags: (result, error, id) => [{ type: "Reel", id: id.toString() }],
        }),
    }),
});

export const {
    useGetReelsQuery,
    useAddReelMutation,
    useDeleteReelMutation,
    useGetReelByIdQuery,
    // Export these utility functions for prefetching
    usePrefetch,
} = reelApi;