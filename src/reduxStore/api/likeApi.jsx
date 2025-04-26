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
            headers.set('Cache-Control', 'no-cache');
            return headers;
        },
    }),
    tagTypes: ["Like"],
    endpoints: (builder) => ({
        getEventLikeStatus: builder.query({
            query: (params) => {
                if (!params?.eventId || !params?.sessionId) {
                    throw new Error('Missing required parameters: eventId and sessionId');
                }
                return `like?eventId=${params.eventId}&sessionId=${params.sessionId}`;
            },
            transformResponse: (response) => response,
            transformErrorResponse: (response) => {
                console.error("❌ likeApi getEventLikeStatus error:", response);
                return response;
            },
            providesTags: (result, error, arg) => 
                result ? [{ type: "Like", id: arg.eventId }] : ["Like"],
        }),
        toggleLikeEvent: builder.mutation({
            query: ({ eventId, sessionId }) => {
                if (!eventId || !sessionId) {
                    throw new Error('Missing required parameters: eventId and sessionId');
                }
                return {
                    url: 'like',
                    method: 'POST',
                    body: { eventId, sessionId },
                };
            },
            transformResponse: (response) => response,
            transformErrorResponse: (response) => {
                console.error("❌ likeApi toggleLikeEvent error:", response);
                return response;
            },
            invalidatesTags: (result, error, arg) => [{ type: "Like", id: arg.eventId }],
        }),
    }),
});

export const { 
    useGetEventLikeStatusQuery, 
    useToggleLikeEventMutation 
} = likeApi;