// src/reduxStore/api/likeApi.jsx
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return `${window.location.origin}/api/`;
    }
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/";
};

export const likeApi = createApi({
    reducerPath: "likeApi",
    baseQuery: fetchBaseQuery({
        baseUrl: getBaseUrl(),
        prepareHeaders: (headers) => {
            headers.set('Cache-Control', 'no-cache'); // Prevent caching during development
            return headers;
        },
    }),
    tagTypes: ["Like"],
    endpoints: (builder) => ({
        getEventLikeStatus: builder.query({
            query: ({ eventId, sessionId }) => `like?eventId=${eventId}&sessionId=${sessionId}`,
            transformResponse: (response) => {
            //    console.log("🔄 likeApi getEventLikeStatus response:", response);
                return response; // Assuming the API route returns { eventId: ..., liked: ..., likesCount: ... }
            },
            transformErrorResponse: (response) => {
                console.error("❌ likeApi getEventLikeStatus error:", response);
                return response;
            },
            providesTags: (result, arg) =>
                result ? [{ type: "Like", id: arg.eventId }] : ["Like"],
        }),
        toggleLikeEvent: builder.mutation({
            query: ({ eventId, sessionId }) => ({
                url: 'like',
                method: 'POST',
                body: { eventId, sessionId },
            }),
            transformResponse: (response) => {
            //    console.log("🔄 likeApi toggleLikeEvent response:", response);
                return response; // Assuming the API route returns { eventId: ..., liked: ..., likesCount: ... }
            },
            transformErrorResponse: (response) => {
                console.error("❌ likeApi toggleLikeEvent error:", response);
                return response;
            },
            invalidatesTags: ( arg) => [{ type: "Like", id: arg.eventId }],
        }),
    }),
});

export const { useGetEventLikeStatusQuery, useToggleLikeEventMutation } = likeApi;