// src/components/UI/categoryUI.jsx

"use client";

// ✅ React Core Imports
import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo 
} from "react";

import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/UI/Card";

const CategoryUI = () => {
  // State initialization
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [likes, setLikes] = useState({});
  const [events, setEvents] = useState([]);

  // 🔍 Default Constants
const DEFAULT_IMAGE = "/uploads/dashboardDefault/drgnimages.jpeg";
 // const DEFAULT_IMAGE_WIDTH = 500; // Replace with the actual width
//  const DEFAULT_IMAGE_HEIGHT = 300; // Replace with the actual height
const AUTO_SLIDE_INTERVAL = 5000;

  // 🔐 Session and Local Storage Utilities
  const getOrCreateSessionId = useCallback(() => {
    if (typeof window === 'undefined') return '';
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }, []);

  // 📦 Event Loading Strategy
  const getEventsFromLocalStorage = useCallback(() => {
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
  }, []);

  // Initialize component and load events
  // 🔄 Event Loading Effect
  useEffect(() => {
    setMounted(true);
    const storedEvents = getEventsFromLocalStorage();
    if (storedEvents.length > 0) setEvents(storedEvents);
  }, [getEventsFromLocalStorage]);

  // 📅 Event Date Utilities
  const calculateDaysUntilEvent = useCallback((eventDate) => {
    if (!eventDate) return 0;
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    const diffTime = eventDateObj - today;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, []);


  // 🖼️ Safe Image Component with Fallback
  //eslint-disable-next-line
  const SafeImage = React.memo(({
    src,
    alt,
    ...props
  }) => {
    const [imageSrc, setImageSrc] = useState(src);

    const handleImageError = () => {
      setImageSrc(DEFAULT_IMAGE);
      console.warn(`Image failed to load: ${src}. Falling back to default.`);
    };

    return (
      <Image
        src={imageSrc || DEFAULT_IMAGE}
        alt={alt || 'Event Image'}
        onError={handleImageError}
        {...props}
      />
    );
  });

  // 🎲 Current Event Computation
  const currentEvent = useMemo(() =>
    events[currentSlide] || {
      cover_image: DEFAULT_IMAGE,
      event_name: 'Loading event...',
      date: new Date().toISOString(),
      venue: 'Venue not specified',
      price: 0
    },
    [events, currentSlide]
  );

  const daysUntilEvent = useMemo(() =>
    calculateDaysUntilEvent(currentEvent.date),
    [currentEvent.date, calculateDaysUntilEvent]
  );

  // 🔄 Carousel Navigation
  const nextSlide = useCallback(() => {
    if (events.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }
  }, [events.length]);

  const prevSlide = useCallback(() => {
    if (events.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
    }
  }, [events.length]);

  // 🕰️ Auto-Advance Carousel
  useEffect(() => {
    if (mounted && !isHovered && events.length > 0) {
      const timer = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
      return () => clearInterval(timer);
    }
  }, [mounted, isHovered, nextSlide, events.length]);

  // ❤️ Like Handling
  const handleLike = async (index) => {
    if (!events[index]?.id) {
      console.error('Invalid event index:', index);
      return;
    }

    const eventId = events[index].id;
    const sessionId = getOrCreateSessionId();

    try {
      setLikes(prev => ({ ...prev, [index]: 1 }));

      const response = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, sessionId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Like request failed');
      }
    } catch (error) {
      console.error('Like failed:', error.message);
      setLikes(prev => ({ ...prev, [index]: 0 }));
    }
  };

  // Render guard
  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Special Offers Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl hover:shadow-2xl transition-shadow">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Early Bird Tickets</h3>
              <p>Get 20% off when you book early! Use code EARLY20</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-xl hover:shadow-2xl transition-shadow">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Festival Season</h3>
              <p>Summer music festivals lineup now available!</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Carousel and Sign Up Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Carousel Section */}
        <section className="lg:col-span-1">
          <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">Upcoming Events</h2>
          <div
            className="relative h-[400px] overflow-hidden rounded-xl group shadow-lg hover:shadow-xl transition-shadow"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src={currentEvent.cover_image}
              alt={currentEvent.event_name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-opacity duration-500"
            />
           

            {/* Like Button */}
            <button
              onClick={() => handleLike(currentSlide)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/50 rounded-full shadow-md hover:shadow-lg transition-shadow"
              aria-label={likes[currentSlide] ? 'Unlike event' : 'Like event'}
            >
              <Heart
                className={`w-6 h-6 transition-colors duration-300 ${likes[currentSlide]
                    ? 'fill-red-500 text-red-500 animate-pulse'
                    : 'text-gray-700 hover:text-red-500'
                  }`}
              />
            </button>

            {/* Event Details Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{currentEvent.event_name}</h3>
                  <p>{daysUntilEvent} days until event</p>
                  <p className="text-sm">{currentEvent.venue}</p>
                  <p className="text-sm">₦{currentEvent.price}</p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            {events.length > 1 && (
              <div
                className={`absolute inset-0 flex items-center justify-between p-4 ${isHovered ? "opacity-100" : "opacity-0"
                  } transition-opacity`}
              >
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-md"
                  aria-label="Previous event"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-md"
                  aria-label="Next event"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Sign-Up Section */}
        <section className="lg:col-span-1">
          <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">Get First Access</h2>
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-[400px] shadow-xl hover:shadow-2xl transition-shadow">
            <CardContent className="p-8 flex flex-col justify-center h-full">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="mb-6">
                Sign up now to receive early notifications and exclusive discounts
                on upcoming events!
              </p>
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-lg text-gray-900 shadow-sm"
                />
                <button className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg">
                  Sign Up
                </button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Categories and Locations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trending Categories */}
        <section className="lg:col-span-1">
          <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">Trending Categories</h2>
          <div className="grid grid-cols-2 gap-4">
            {["Music", "Sports", "Theater", "Comedy"].map((category) => (
              <Card key={category} className="hover:shadow-lg transition-shadow shadow-md">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold">{category}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Top Locations */}
        <section className="lg:col-span-1">
          <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">Top Locations</h2>
          <div className="grid grid-cols-2 gap-4">
            {["Lagos", "Abuja", "Port Harcourt", "Ibadan"].map((location) => (
              <Card key={location} className="hover:shadow-lg transition-shadow shadow-md">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold">{location}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CategoryUI;
