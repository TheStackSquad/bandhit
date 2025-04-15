// src/reduxStore/api/eventApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Determine the base URL based on the environment
export const getBaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // In the browser, use the current origin
    return `${window.location.origin}/api/`;
  }

  // Server-side: use environment variable or fallback
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/';
};



export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers) => {
  //    console.log('🌐 EventApi: Preparing Headers for Request', {
  //       baseUrl: getBaseUrl(),
  //       environment: process.env.NODE_ENV
  //     });
      return headers;
    }
  }),
  tagTypes: ['Events'],
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => {
      //  console.log('🚀 EventApi: Initiating Events Fetch',
      //     {
      //       baseUrl: getBaseUrl()
      //     });
        return 'events';
      },
      onQueryStarted: async (arg, { queryFulfilled }) => {
      //  console.log('⏳ EventApi: Query Started');
        try {

          const { 
            //eslint-disable-next-line
            data } = await queryFulfilled;
        //  console.log('✅ EventApi: Query Fulfilled', { eventCount: data?.length || 0 });
        } catch (error) {
          console.error('❌ EventApi: Query Failed', error);
        }
      },
      providesTags: ['Events'],
    }),
    createEvent: builder.mutation({
      query: (eventData) => {
    //    console.log('📝 EventApi: Creating Event', eventData);
        return {
          url: 'dashboard',
          method: 'POST',
          body: eventData,
        };
      },
      invalidatesTags: ['Events'],
    }),
    // New updateEvent mutation
    updateEvent: builder.mutation({
      query: ({ id, ...eventData }) => {
      //  console.log('🔄 EventApi: Updating Event', { id, eventData });
        return {
          url: 'dashboard', // Updated to match the route
          method: 'PATCH',
          body: { id, ...eventData },
        };
      },
      invalidatesTags: ['Events'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation // Add this export
} = eventApi;


