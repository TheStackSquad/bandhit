// src/components/UI/categoryUI.jsx

"use client";

// React and Next.js imports
import React, { useState, useEffect, useCallback, useMemo } from "react";
import CloudinaryImage from '@/components/utilsDir/cloudinaryImage';

// Redux imports
import { useSelector, useDispatch } from "react-redux";
import { useGetEventsQuery } from '@/reduxStore/api/eventsApi';
import { loadVisibleEventLikes } from '@/reduxStore/actions/likeActions';

// UI Components
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/UI/Card";
import LikeButton from '@/components/UI/eventLayout/likeButton';

import { handleNewsletterSignup } from '@/utils/categoryUtils/categoryUtils';
import { showSuccess, showError, ToastContainer } from '@/lib/alertManager';


const CategoryUI = () => {
  // Constants
  const DEFAULT_IMAGE = "/uploads/dashboardDefault/drgnimages.jpeg";
  const AUTO_SLIDE_INTERVAL = 5000;

  // Redux state
  const dispatch = useDispatch();
  const { likedEvents, likesCount } = useSelector((state) => state.likes);

  // RTK Query
  const { data: apiEvents, isSuccess } = useGetEventsQuery(undefined, {
    refetchOnMountOrArgChange: false,
    pollingInterval: 30 * 60 * 1000 // 30 minutes
  });

  // Local states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState([]);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await handleNewsletterSignup(email);
      showSuccess('Successfully subscribed!');
      setEmail('');
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
 
  // Generate or retrieve sessionId 
  //eslint-disable-next-line 
  const getOrCreateSessionId = useCallback(() => {
    if (typeof window === 'undefined') return '';
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }, []);

  // Fetch events from localStorage
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

  // Calculate days left until an event
  const calculateDaysUntilEvent = useCallback((eventDate) => {
    if (!eventDate) return 0;
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    const diffTime = eventDateObj - today;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, []);

  // Slide navigation
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

  // Current event object
  const currentEvent = useMemo(() =>
    events[currentSlide] || {
      cover_image: DEFAULT_IMAGE,
      event_name: 'Loading event...',
      date: new Date().toISOString(),
      venue: 'Venue not specified',
      price: 0
    }, [events, currentSlide]);

  const daysUntilEvent = useMemo(() =>
    calculateDaysUntilEvent(currentEvent.date),
    [currentEvent.date, calculateDaysUntilEvent]
  );

  // On mount: load local events
  useEffect(() => {
    setMounted(true);
    const storedEvents = getEventsFromLocalStorage();
    if (storedEvents.length > 0) setEvents(storedEvents);
  }, [getEventsFromLocalStorage]);

  // Update events from API if available
  useEffect(() => {
    if (isSuccess && apiEvents && apiEvents.length > 0) {
      setEvents(apiEvents);
  //    console.log('🔄 Updated carousel data from API');
    }
  }, [isSuccess, apiEvents]);

  // Load likes for visible events
  useEffect(() => {
    if (events && events.length > 0) {
      const eventIds = events.map(event => event.id);
      dispatch(loadVisibleEventLikes(eventIds));
    }
  }, [events, dispatch]);

  // Auto slide functionality
  useEffect(() => {
    if (mounted && !isHovered && events.length > 0) {
      const timer = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
      return () => clearInterval(timer);
    }
  }, [mounted, isHovered, nextSlide, events.length]);

  // Prevent hydration error
  if (!mounted) return null;

  // Memoized SafeImage fallback handler
  const SafeImage = React.memo(({ src, alt, ...props }) => {
    const [imageSrc, setImageSrc] = useState(src);
    const handleImageError = () => {
      setImageSrc(DEFAULT_IMAGE);
      console.warn(`Image failed to load: ${src}. Falling back to default.`);
    };
    return (

      <CloudinaryImage
        src={imageSrc}
        alt={alt}
        onError={handleImageError}
        {...props}
      />
    );
  });

  // Add display name to fix the react/display-name error
  SafeImage.displayName = 'SafeImage';

  // Render
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Special Offers */}
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

      {/* Carousel + Sign-up */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Event Carousel */}
        <section className="lg:col-span-1">
          <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">Upcoming Events</h2>
          <div
            className="relative h-[400px] overflow-hidden rounded-xl group shadow-lg hover:shadow-xl transition-shadow"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {currentEvent?.cover_image && (
              <SafeImage
                src={currentEvent.cover_image}
                alt="Event cover"
                className="your-class-names-here"
              />
            )}

            {/* Like Button */}
            <div className="absolute top-4 right-4 z-10 p-2">
              <LikeButton
                eventId={currentEvent?.id}
                initialLiked={likedEvents[currentEvent?.id] || false}
                likesCount={likesCount[currentEvent?.id] || 0}
                className="p-3 bg-white/50 rounded-full shadow-md hover:shadow-lg transition-shadow"
              />
            </div>

            {/* Overlay */}
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

            {/* Carousel Controls */}
            {events.length > 1 && (
              <div
                className={`absolute inset-0 flex items-center justify-between p-4 ${isHovered ? "opacity-100" : "opacity-0"} transition-opacity`}
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

        {/* Sign-up Card */}
        <section className="lg:col-span-1">
          <ToastContainer />
          <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">Get First Access</h2>
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-[400px] shadow-xl hover:shadow-2xl transition-shadow">
            <CardContent className="p-8 flex flex-col justify-center h-full">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="mb-6">
                Sign up now to receive early notifications and exclusive discounts
                on upcoming events!
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-lg text-gray-900 shadow-sm"
                  required
                />
                <button
                  type="submit"
                  className={`px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default CategoryUI;

