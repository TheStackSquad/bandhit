'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react";

// ✅ Utility function to safely parse events data from localStorage
export const parseEventsData = (storageData) => {
  try {
    const parsedOuter = JSON.parse(storageData);
    // console.log('parsed outer:', parsedOuter);
    return JSON.parse(parsedOuter.events);
   
  } catch (error) {
    console.error('Error parsing events data:', error);
    return [];
  }
};

// ✅ Refactored function for handling cart submission
// Generate a unique ID for the event
const generateId = () => `event_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

export const handleCartSubmit = (eventDetails) => {
  // Retrieve existing events from localStorage
  const getEventsFromLocalStorage = () => {
    try {
      const eventsData = localStorage.getItem("events");
      return eventsData ? JSON.parse(eventsData) : [];
    } catch (error) {
      console.error("Error retrieving events from localStorage:", error);
      return [];
    }
  };

  // Check if the event already exists in localStorage
  const findEventIndex = (events, eventDetails) => {
    return events.findIndex((event) => event.id === eventDetails.id);
  };

  // Add or update event in localStorage
  const addOrUpdateEventInLocalStorage = (eventDetails) => {
    const events = getEventsFromLocalStorage();

    // Ensure event has a unique ID
    if (!eventDetails.id) {
      eventDetails.id = generateId();
    }

    const eventIndex = findEventIndex(events, eventDetails);

    if (eventIndex !== -1) {
      // If event exists, increase quantity
      events[eventIndex].quantity = (events[eventIndex].quantity || 1) + 1;
    } else {
      // Add new event with quantity and price
      events.push({
        ...eventDetails,
        quantity: 1, // Default quantity
        price: eventDetails.price || 0, // Ensure price exists
      });
    }

    // Save updated events list
    try {
      localStorage.setItem("events", JSON.stringify(events));
    } catch (error) {
      console.error("Error saving event to localStorage:", error);
    }
  };

  // Call function to add/update the event
  addOrUpdateEventInLocalStorage(eventDetails);
};


// ✅ Carousel navigation handlers
export const handleCarouselNavigation = {
  nextSlide: (currentIndex, totalSlides) => (
    totalSlides > 0 ? (currentIndex + 1) % totalSlides : 0
  ),
  prevSlide: (currentIndex, totalSlides) => (
    totalSlides > 0 ? (currentIndex === 0 ? totalSlides - 1 : currentIndex - 1) : 0
  )
};

// ✅ Handles liking an event
export const handleLikeEvent = (currentLikes) => {
  return currentLikes + 1;
};

// ✅ Memoized Image component
//eslint-disable-next-line
export const CarouselImage = React.memo(({ currentEvent, isHovered }) => {
  const [isLoading, setIsLoading] = useState(true);

  const imageUrl = useMemo(() => {
    if (!currentEvent?.imageUrl?.url) return null;  // Check for imageUrl.url
    return currentEvent.imageUrl.url.startsWith('http')  // Use imageUrl.url
      ? currentEvent.imageUrl.url 
      : `/uploads/events/${currentEvent.imageUrl.url}`;
  }, [currentEvent?.imageUrl?.url]);  // Depend on imageUrl.url

  const altText = useMemo(() => {
    if (!currentEvent) return 'Event image';
    return `${currentEvent.name} - ${currentEvent.venue} on ${new Date(currentEvent.date).toLocaleDateString()}`;
  }, [currentEvent]);

  if (!imageUrl) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-200">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-md">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={imageUrl}
        alt={altText}
        className={`object-cover transition-transform duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          setIsLoading(false);
          console.error('Error loading image:', e);
          e.currentTarget.src = '/uploads/dashboardDefault/drgnimages.jpeg';
        }}
      />
    </div>
  );
});

// ✅ Carousel Component with Hover Effect for Pausing
export const Carousel = ({ carouselAssets }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselAssets.length);
      }, 3000); // Slide every 3 seconds

      return () => clearInterval(timer);
    }
  }, [isHovered, carouselAssets.length]);

  return (
    <div 
      className="carousel-container relative w-full h-[400px]" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CarouselImage currentEvent={carouselAssets[currentIndex]} isHovered={isHovered} />
      <button 
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        onClick={() => setCurrentIndex(handleCarouselNavigation.prevSlide(currentIndex, carouselAssets.length))}
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        onClick={() => setCurrentIndex(handleCarouselNavigation.nextSlide(currentIndex, carouselAssets.length))}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

CarouselImage.displayName = 'CarouselImage';

export const CarouselOverlay = ({ currentEvent, isHovered }) => (
  <div
    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
      isHovered ? "opacity-0" : "opacity-100"
    }`}
  >
    <div
      className={`absolute bottom-0 left-0 right-0 p-6 pb-4 text-white transition-opacity duration-300 ${
        isHovered ? "opacity-100" : "opacity-80"
      }`}
    >
      <h3 className="text-2xl font-bold mb-2">{currentEvent.name}</h3>
      <div className="space-y-1">
        <p className="flex justify-between text-sm md:text-base">
          <span>Date:</span>
          <span>{new Date(currentEvent.date).toLocaleDateString()}</span>
        </p>
        <p className="flex justify-between text-sm md:text-base">
          <span>Time:</span>
          <span>{currentEvent.time}</span>
        </p>
        <p className="flex justify-between text-sm md:text-base">
          <span>Venue:</span>
          <span>{currentEvent.venue}</span>
        </p>
        <p className="flex justify-between text-sm md:text-base">
          <span>Price:</span>
          <span>{currentEvent.price}</span>
        </p>
      </div>
    </div>
  </div>
);

export const ActionButtons = ({ likes, handleLike, handleAddToCart, isItemInCart }) => (
  <div className="absolute top-4 right-4 flex gap-2 z-10">
    {/* Like Button */}
    <button
      className="flex items-center gap-1 px-3 py-2 text-white bg-red-600/80 rounded-md shadow-md hover:bg-red-700 transition-colors"
      onClick={handleLike}
      disabled={likes > 0} // Disable button if already liked
    >
      <Heart className="w-4 h-4 md:w-5 md:h-5" />
      <span className="text-sm md:text-base">{likes}</span>
    </button>

    {/* Add to Cart Button */}
    <button
      className={`flex items-center px-3 py-2 rounded-md shadow-md transition-colors ${
        isItemInCart ? "bg-green-600 hover:bg-green-700 glow" : "bg-blue-600 hover:bg-blue-700"
      }`}
      onClick={handleAddToCart}
      disabled={isItemInCart} // Disable button if already in cart
    >
      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-white" />
      {isItemInCart && (
        <span className="ml-1 text-white text-sm md:text-base">Added</span>
      )}
    </button>
  </div>
);

export const NavigationButtons = ({ isHovered, prevSlide, nextSlide }) => (
  <div className={`absolute inset-0 flex items-center justify-between px-4 transition-opacity duration-300 ${
    isHovered ? "opacity-100" : "opacity-0"
  }`}>
    <button
      onClick={prevSlide}
      className="p-2 bg-black/50 rounded-full hover:bg-black/75 transition-colors transform hover:scale-105"
      aria-label="Previous slide"
    >
      <ChevronLeft className="text-white w-5 h-5 md:w-6 md:h-6" />
    </button>
    <button
      onClick={nextSlide}
      className="p-2 bg-black/50 rounded-full hover:bg-black/75 transition-colors transform hover:scale-105"
      aria-label="Next slide"
    >
      <ChevronRight className="text-white w-5 h-5 md:w-6 md:h-6" />
    </button>
  </div>
);


export const HeroBanner = () => (
  <div className="flex items-center justify-center bg-blue-200 rounded-lg shadow-lg p-6 md:p-8">
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

     
<button className="mt-6 px-6 py-3 text-blue-400 bg-orangered rounded-md shadow-md hover:bg-orange transition-colors font-600">
  <Link href="/dashboard">Create Your Event</Link>
</button>

     
      </div>
    </div>
  </div>
);
