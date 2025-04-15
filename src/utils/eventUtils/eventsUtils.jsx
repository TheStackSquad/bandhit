// src/utils/eventUtils.jsx
"use client";
import Link from "next/link";
import { addToCart } from "@/reduxStore/actions/cartActions";

export const submitToCart = (dispatch, eventDetails) => {
 // console.log("Event details submitted to cart:", eventDetails);

  if (!eventDetails || typeof eventDetails !== "object") {
    console.error("submitToCart error: Invalid eventDetails object");
    return;
  }

  dispatch(addToCart(eventDetails));
};

// Check like status on component mount
// export const checkLikeStatus = async (dispatch, eventId, sessionId) => {
//   try {
//     return await dispatch(fetchEventLikeStatus(eventId, sessionId));
//   } catch (error) {
//     console.error('Check like status error:', error);
//     return { liked: false, likesCount: 0 };
//   }
// };


// Get or create session ID for anonymous tracking
export const getOrCreateSessionId = () => {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// Load events from localStorage with error handling
export const getEventsFromLocalStorage = () => {
  if (typeof window === 'undefined') return [];
  const persistData = localStorage.getItem('persist:events');
  if (!persistData) return [];

  try {
    const parsed = JSON.parse(persistData);
    const events = JSON.parse(parsed.events);
    return Array.isArray(events) ? events : [];
  } catch (error) {
    console.error('Error parsing events:', error);
    return [];
  }
};


export const HeroBanner = () => (
  <div className="flex items-center justify-center bg-gray-200 rounded-lg shadow-lg p-6 md:p-8">
    <div className="text-center max-w-lg">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">
        Welcome to Bandhit!
      </h1>
      <p className="text-gray-600 text-sm md:text-base mb-6">
        Explore a world of music, events, and unforgettable experiences.
        Join us in celebrating the artistry of entertainers and the vibrant
        culture of live performances.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="mt-6 px-6 py-3 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 transition-colors">
          <Link href="/categories">Discover More</Link>
        </button>

        <button className="banner-btn mt-6 px-6 py-3 rounded-md shadow-md font-semibold">
          <Link href="/dashboard">Create Your Event</Link>
        </button>
      </div>
    </div>
  </div>
);

