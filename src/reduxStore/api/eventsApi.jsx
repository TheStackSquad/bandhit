// src/reduxStore/api/eventApi.js
// src/reduxStore/api/eventApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const getToken = () => {
    if (typeof window !== "undefined") {
      const authData = localStorage.getItem("auth");
      const auth = authData ? JSON.parse(authData) : null;
      return auth?.accessToken || null;
    }
    return null; // Prevents `localStorage` error on the server
  };
  
  const token = getToken();
  
export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/auth',
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("authorization", `Bearer ${token}`); // ✅ Attach token
      }
      return headers;
    }
  }),
  tagTypes: ['Events'],
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: (eventData) => {
        // ✅ Convert `eventData` into FormData
        const formData = new FormData();
        formData.append("eventName", eventData.eventName);
        formData.append("time", eventData.time);
        formData.append("date", eventData.date);
        formData.append("price", eventData.price);
        formData.append("venue", eventData.venue);
        formData.append("capacity", eventData.capacity);
        if (eventData.coverImage) {
          formData.append("coverImage", eventData.coverImage);
        }

        return {
          url: "dashboard",
          method: "POST",
          body: formData, // ✅ Send FormData instead of JSON
        };
      },
    }),
  }),
});

export const { useCreateEventMutation } = eventApi;
