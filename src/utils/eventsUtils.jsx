// src/utils/eventUtils.jsx
"use client";
import Link from "next/link";
import { addToCart, likeEventAction } from "@/reduxStore/actions/cartActions";

export const submitToCart = (dispatch, eventDetails) => {
  dispatch(addToCart(eventDetails));
};

export const submitLike = (dispatch, eventId, token) => {
  if (!token) {
    console.error("No authentication token found");
    return;
  }
  
  dispatch(likeEventAction(eventId, token));
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