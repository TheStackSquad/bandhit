// src/components/UI/eventsUI.jsx
"use client";

// External Package Imports
import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

// Internal Imports
import {
  parseEventsData,
  CarouselImage,
  CarouselOverlay,
  ActionButtons,
  NavigationButtons,
  HeroBanner,
  handleCartSubmit,
  handleCarouselNavigation,
  handleLikeEvent,
} from "@/utils/eventsUtils";

const EventCarousel = () => {
  // Redux Setup
  const dispatch = useDispatch();
  
  // Redux Selectors
  const cart = useSelector((state) => state.cart);
  const eventsFromRedux = useSelector((state) => state.event.events);
  const token = useSelector((state) => state?.auth?.user?.accesstoken);

  // Local State Management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Memoized Values
  const events = useMemo(() => {
    if (!eventsFromRedux) {
      try {
        const storageData = localStorage.getItem("persist:event");
        // console.log("storageData:", storageData); // Log the raw storage data
  
        const parsedEvents = storageData ? parseEventsData(storageData) : [];
        // console.log("parsedEvents:", parsedEvents); // Log parsed events
  
        return parsedEvents;
      } catch (error) {
        console.error("Error loading events:", error);
        return [];
      }
    }
    return eventsFromRedux;
  }, [eventsFromRedux]);
  
  // console.log("Final events value:", events); // Log the final events value
  

  const currentEvent = useMemo(() => 
    events[currentIndex] || {},
    [events, currentIndex]
  );

  const isItemInCart = useMemo(() => 
    cart.items.some((item) => item.id === currentEvent.id),
    [cart.items, currentEvent.id]
  );

  // Callback Functions
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      handleCarouselNavigation.nextSlide(prevIndex, events.length)
    );
  }, [events.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      handleCarouselNavigation.prevSlide(prevIndex, events.length)
    );
  }, [events.length]);

  const handleAddToCart = useCallback(() => {
    handleCartSubmit(currentEvent, token, dispatch);
  }, [currentEvent, token, dispatch]);

  const handleLike = useCallback(() => {
    setLikes((prevLikes) => handleLikeEvent(prevLikes));
  }, []);

  // Event Handlers
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Effects
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isHovered && events.length > 0) {
      const timer = setInterval(nextSlide, 3000);
      return () => clearInterval(timer);
    }
  }, [isHovered, events.length, nextSlide]);

  useEffect(() => {
    if (events.length > 0 && currentIndex >= events.length) {
      setCurrentIndex(0);
    }
  }, [events.length, currentIndex]);

  // Guard Clauses
  if (!isClient) {
    return null;
  }

  if (events.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No events available
      </p>
    );
  }

  // Render
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-gray-50">
      <div
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CarouselImage 
          currentEvent={currentEvent} 
          isHovered={isHovered} 
        />
        <CarouselOverlay 
          currentEvent={currentEvent} 
          isHovered={isHovered} 
        />
        <ActionButtons 
          likes={likes}
          handleLike={handleLike}
          handleAddToCart={handleAddToCart}
          isItemInCart={isItemInCart}
          cartItemsCount={cart.items.length}
        />
        <NavigationButtons 
          isHovered={isHovered}
          prevSlide={prevSlide}
          nextSlide={nextSlide}
        />
      </div>
      <HeroBanner />
    </div>
  );
};

export default EventCarousel;