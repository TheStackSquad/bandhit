// src/reduxStore/api/hubApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return `${window.location.origin}/api/`;
    }
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/";
};

export const hubApi = createApi({
    reducerPath: "hubApi",
    baseQuery: fetchBaseQuery({
        baseUrl: getBaseUrl(),
        prepareHeaders: (headers) => {
            headers.set('Cache-Control', 'no-cache');  // Prevent caching during development
            return headers;
        }
    }),
    tagTypes: ["Hub"],
    endpoints: (builder) => ({
        getHubProfiles: builder.query({
            query: () => "hub",
            transformResponse: (response) => {
                // Add some defensive coding
         //       console.log("🔄 HubAPI transformResponse received:", response);
                
                if (!response) {
                    console.warn("⚠️ HubAPI received empty response");
                    return [];
                }
                
                if (!response.profiles) {
                    console.warn("⚠️ HubAPI response missing profiles array", response);
                    return [];
                }
                
                if (!Array.isArray(response.profiles)) {
                    console.warn("⚠️ HubAPI profiles is not an array", response.profiles);
                    return [];
                }
                
           //     console.log(`✅ HubAPI transformed ${response.profiles.length} profiles`);
                return response.profiles;
            },
            // Add error handling for the query
            transformErrorResponse: (response) => {
                console.error("❌ HubAPI error response:", response);
                return response;
            },
            providesTags: ["Hub"],
            // Keep data fresh
            keepUnusedDataFor: 300, // 5 minutes in seconds
        }),
    }),
});

export const { useGetHubProfilesQuery } = hubApi;