// src/reduxStore/api/eventMetricsApi.jsx
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return `${window.location.origin}/api/`;
    }
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/";
};

export const eventMetricsApi = createApi({
    reducerPath: "eventMetricsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: getBaseUrl(),
        prepareHeaders: (headers) => {
            headers.set('Cache-Control', 'no-cache'); // Prevent caching during development
            return headers;
        },
    }),
    tagTypes: ["EventMetrics"],
    endpoints: (builder) => ({
        getEventMetrics: builder.query({
            query: () => 'event_metrics', // The endpoint for your API route
            transformResponse: (response) => {
//                console.log("🔄 eventMetricsApi getEventMetrics response:", response);

                // If response is an array (which might happen if the API returns all matches),
                // find the one matching our eventId
                const eventData = Array.isArray(response) ? response[0] : response;

                if (!eventData) return null;

                // Format the response data for easier consumption by components

                const formattedResponse = {
                    id: eventData.id,
                    eventId: eventData.event_id,
                    // For the modal component - these may come from a join with events table
                    // If they're null/undefined, the component will handle them
                    eventName: eventData.event_name,
                    date: eventData.date,
                    time: eventData.time,
                    venue: eventData.venue,
                    price: eventData.price !== undefined ? parseFloat(eventData.price) : undefined,
                    capacity: eventData.capacity,
                    coverImage: eventData.cover_image,
                    userId: eventData.user_id,
                    // These are the critical metrics from your event_metrics table
                    metrics: {
                        totalLikes: eventData.total_likes || 0,
                        totalTicketsSold: eventData.total_payments || 0,
                        totalRevenue: parseFloat(eventData.total_revenue || "0.00"),
                        // Calculate percentage if capacity is available, otherwise use API value if present
                        percentageSold: eventData.percentage_sold ||
                            (eventData.capacity && eventData.total_payments ?
                                Math.round((eventData.total_payments / eventData.capacity) * 100) :
                                0)
                    },
                    lastUpdated: eventData.last_updated
                };

                return formattedResponse;
            },
            transformErrorResponse: (response) => {
                console.error("❌ eventMetricsApi getEventMetrics error:", response);
                return response;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ eventId }) => ({ type: "EventMetrics", id: eventId })),
                        { type: "EventMetrics", id: "LIST" }
                    ]
                    : [{ type: "EventMetrics", id: "LIST" }],
        }),
        getEventMetric: builder.query({
            query: (eventId) => `event_metrics/${eventId}`,
            transformResponse: (response) => {
          //      console.log(`🔄 eventMetricsApi getEventMetric response:`, response);

                // If response is an array (which might happen if the API returns all matches),
                // find the one matching our eventId
                const eventData = Array.isArray(response) ? response[0] : response;

                if (!eventData) return null;

                // Format the response data for easier consumption by components
                const formattedResponse = {
                    id: eventData.id,
                    eventId: eventData.event_id,
                    eventName: eventData.event_name,
                    date: eventData.date,
                    time: eventData.time,
                    venue: eventData.venue,
                    price: parseFloat(eventData.price),
                    capacity: eventData.capacity,
                    coverImage: eventData.cover_image,
                    userId: eventData.user_id,
                    metrics: {
                        totalLikes: eventData.total_likes,
                        totalTicketsSold: eventData.total_payments,
                        totalRevenue: parseFloat(eventData.total_revenue),
                        percentageSold: eventData.percentage_sold
                    },
                    lastUpdated: eventData.last_updated
                };

                return formattedResponse;
            },
            transformErrorResponse: (response) => {
                console.error(`❌ eventMetricsApi getEventMetric error:`, response);
                return response;
            },
            providesTags: (result, eventId) =>
                result ? [{ type: "EventMetrics", id: eventId }] : [],
        }),
    }),
});

export const { useGetEventMetricsQuery, useGetEventMetricQuery } = eventMetricsApi;