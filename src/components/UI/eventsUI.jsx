//src/components/UI/eventsUI.jsx
"use client";

// External Package Imports
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useCreateEventMutation } from "@/reduxStore/api/eventsApi";

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
} from "@/utils/eventsUtils";

const EventCarousel = () => {
  // Redux Setup
  const cart = useSelector((state) => state.cart);
  const [likedEvents, setLikedEvents] = useState(new Set());

  // Local State Management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Fetch events using RTK Query
  const { data: liveEvents, isLoading, isError } = useCreateEventMutation(undefined, {
    pollingInterval: 30000, // Refresh data every 30 seconds
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const eventsFromRedux = useSelector((state) => state.event.events);

  // Memoized Events Data
  const events = useMemo(() => {
    if (liveEvents) return liveEvents;
    if (eventsFromRedux?.length) return eventsFromRedux;

    try {
      const storageData = localStorage.getItem("persist:event");
      return storageData ? parseEventsData(storageData) : [];
    } catch (err) {
      console.error('error from eventsUI:', err);
      return [];
    }
  }, [liveEvents, eventsFromRedux]);

  const currentEvent = useMemo(() => {
    return events[currentIndex] || {}; // Always return something, conditional inside
  }, [events, currentIndex]);

  const isItemInCart = useMemo(() => {
    return cart.items.some((item) => item.id === currentEvent.id); // Always return a value, conditional inside
  }, [cart.items, currentEvent.id]);

  // Carousel Navigation Handlers
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => handleCarouselNavigation.nextSlide(prevIndex, events.length));
  }, [events.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => handleCarouselNavigation.prevSlide(prevIndex, events.length));
  }, [events.length]);

  // Event Handlers
  const handleLike = useCallback(() => {
    if (!likedEvents.has(currentEvent.id)) {
      setLikes((prevLikes) => prevLikes + 1);
      setLikedEvents((prev) => new Set(prev).add(currentEvent.id));
    }
  }, [currentEvent.id, likedEvents]);

  const handleAddToCart = useCallback(() => {
    handleCartSubmit(currentEvent);
  }, [currentEvent]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Effects
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

  // Client-side Check Effect
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Guard Clauses
  if (!isClient) return null;
  if (events.length === 0) return <p className="text-center text-gray-500">No events available</p>;

  // Loading & Error States
  if (isLoading && !events.length) return <div>Loading events...</div>;
  if (isError && !events.length) return <div>Error loading events. Please try again later.</div>;

  // Render
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-gray-50">
      <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <CarouselImage currentEvent={currentEvent} isHovered={isHovered} />
        <CarouselOverlay currentEvent={currentEvent} isHovered={isHovered} />
        <ActionButtons
          likes={likes}
          handleLike={handleLike}
          handleAddToCart={handleAddToCart}
          isItemInCart={isItemInCart}
          cartItemsCount={cart.items.length}
        />
        <NavigationButtons isHovered={isHovered} prevSlide={prevSlide} nextSlide={nextSlide} />
      </div>
      <HeroBanner />
    </div>
  );
};

export default EventCarousel;
