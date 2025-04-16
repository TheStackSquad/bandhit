// src/components/UI/eventsUI.jsx

"use client";

// React and state management imports
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetEventsQuery } from '@/reduxStore/api/eventsApi';

// UI components and icons
import { ChevronLeft, ChevronRight, ShoppingCart, CheckCircle, Check } from "lucide-react";
import LikeButton from '@/components/UI/eventLayout/likeButton';
import CloudinaryImage from '@/components/utilsDir/cloudinaryImage';

// Actions and utilities
import { loadVisibleEventLikes } from '@/reduxStore/actions/likeActions';
import { toast } from "@/lib/alertManager";
import {
  submitToCart,
  HeroBanner
} from "@/utils/eventUtils/eventsUtils";

// Main EventCarousel component
export default function EventCarousel() {
  // Redux state access
  const eventsFromRedux = useSelector((state) => state.event.events);
  const { likedEvents, likesCount } = useSelector((state) => state.likes);
  const dispatch = useDispatch();

  // Local state initialization
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Get events from localStorage for fast initial loading
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

  // Background sync with API
  const { data: apiEvents, isSuccess } = useGetEventsQuery(undefined, {
    refetchOnMountOrArgChange: false, // Don't show loading state
    pollingInterval: 30 * 60 * 1000 // Refresh every 30 minutes
  });

  // Add event to selection or remove if already selected
  const handleClickedEvent = (eventDetails) => {
    if (!eventDetails || !dispatch) {
      console.warn("🚨 Missing eventDetails or dispatch function.");
      return;
    }

    const isAlreadySelected = selectedEvents.some(event => event.id === eventDetails.id);

    if (isAlreadySelected) {
      setSelectedEvents(prev => prev.filter(event => event.id !== eventDetails.id));
      toast.info(`Removed "${eventDetails.event_name}" from selection`);
    } else {
      setSelectedEvents(prev => [...prev, eventDetails]);
      toast.success(`Added "${eventDetails.event_name}" to selection`);
    }
  };

  // Submit all selected events to cart
  const submitSelectedEvents = () => {
    if (selectedEvents.length === 0) {
      toast.info("No events selected");
      return;
    }

    selectedEvents.forEach(event => {
      submitToCart(dispatch, event);
    });

    toast.success(`Added ${selectedEvents.length} event(s) to cart`);
    setSelectedEvents([]);
  };

  // Default event when no events are available
  const defaultEvent = useMemo(() => ({
    cover_image: "/uploads/dashboardDefault/drgnimages.jpeg",
    event_name: "Default Event",
    date: new Date().toISOString(),
    time: "12:00 PM",
    venue: "Default Venue",
    price: "0"
  }), []);

  // Current event computation
  const currentEvent = useMemo(() => {
    if (events.length === 0) return defaultEvent;
    const event = events[currentIndex];
    return {
      ...event,
      imageUrl: { url: event.cover_image },
      eventName: event.event_name,
      id: event.id
    };
  }, [events, currentIndex, defaultEvent]);

  // Check if current event is selected
  const isCurrentEventSelected = useMemo(() => {
    return selectedEvents.some(event => event.id === currentEvent.id);
  }, [selectedEvents, currentEvent]);

  // Navigation controls for carousel
  const nextSlide = useCallback(() => {
    if (!isPaused && events.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }
  }, [events.length, isPaused]);

  const prevSlide = useCallback(() => {
    if (!isPaused && events.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
    }
  }, [events.length, isPaused]);

  // Component initialization & localStorage loading
  useEffect(() => {
    setMounted(true);
    const storedEvents = getEventsFromLocalStorage();
    if (storedEvents.length > 0) setEvents(storedEvents);
  }, [getEventsFromLocalStorage]);

  // Update events from Redux store if available
  useEffect(() => {
    if (eventsFromRedux) {
      // Parse events if they're in string format (from persist)
      if (typeof eventsFromRedux === 'string') {
        try {
          setEvents(JSON.parse(eventsFromRedux));
        } catch (parseError) {
          console.error("Failed to parse events from Redux:", parseError);
        }
      } else if (Array.isArray(eventsFromRedux) && eventsFromRedux.length > 0) {
        setEvents(eventsFromRedux);
      }
    }
  }, [eventsFromRedux]);

  // Update with fresh data when API responds
  useEffect(() => {
    if (isSuccess && apiEvents && apiEvents.length > 0) {
      setEvents(apiEvents);
    //  console.log('🔄 Updated events carousel from API:', { count: apiEvents.length });
    }
  }, [isSuccess, apiEvents]);

  // Automatic sliding effect
  useEffect(() => {
    if (!isPaused && events.length > 0) {
      const timer = setInterval(nextSlide, 3000);
      return () => clearInterval(timer);
    }
  }, [isPaused, events.length, nextSlide]);

  // Load likes for visible events
  useEffect(() => {
    if (events && events.length > 0) {
      const eventIds = events.map(event => event.id);
      dispatch(loadVisibleEventLikes(eventIds));
    }
  }, [events, dispatch]);

  // Skip rendering until mounted (prevents hydration issues)
  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-gray-50">
      <div className="flex flex-col">
        <div
          className="relative group w-full h-[60vh] md:h-[500px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <CloudinaryImage
            src={currentEvent.imageUrl?.url || currentEvent.cover_image}
            alt={currentEvent.eventName || currentEvent.event_name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            className={`relative object-cover rounded-lg transition-transform duration-700 ease-in-out ${isCurrentEventSelected ? 'ring-4 ring-blue-500' : ''}`}
            priority
          />

          <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/40 to-transparent text-white">
            <h3 className="text-2xl font-bold">{currentEvent.event_name || currentEvent.event_name}</h3>
            <p className="text-sm opacity-80">{new Date(currentEvent.date).toLocaleDateString()} - {currentEvent.time}</p>
            <p className="text-sm opacity-80">{currentEvent.venue}</p>
            <p className="text-lg font-semibold text-yellow-400">₦{currentEvent.price}</p>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            {isCurrentEventSelected && (
              <div className="bg-blue-500 text-white p-2 rounded-lg flex items-center">
                <Check size={16} className="mr-1" /> Selected
              </div>
            )}
          </div>

          <div className="absolute bottom-6 right-6 flex gap-4">
            <button
              onClick={() => handleClickedEvent(currentEvent)}
              className={`p-2 ${isCurrentEventSelected ? 'bg-blue-500 text-white' : 'bg-white/80 text-black'} rounded-full hover:bg-blue-400 hover:text-white transition-transform duration-300 transform hover:scale-110`}
              disabled={!currentEvent}
            >
              {isCurrentEventSelected ? <CheckCircle size={24} /> : <ShoppingCart size={24} />}
            </button>
            <LikeButton
              eventId={currentEvent?.id}
              initialLiked={likedEvents[currentEvent?.id] || false}
              likesCount={likesCount[currentEvent?.id] || 0}
            />
          </div>

          {events.length > 0 && (
            <>
              <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition">
                <ChevronLeft size={30} />
              </button>
              <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition">
                <ChevronRight size={30} />
              </button>
            </>
          )}
        </div>

        {/* Selected Events Summary */}
        {selectedEvents.length > 0 && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">Selected Events ({selectedEvents.length})</h3>
              <button
                onClick={submitSelectedEvents}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add All to Cart
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {selectedEvents.map((event) => (
                <div key={event.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <CheckCircle size={16} className="text-blue-500 mr-2" />
                    <span className="font-medium">{event.event_name}</span>
                  </div>
                  <button
                    onClick={() => handleClickedEvent(event)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <HeroBanner />
    </div>
  );
}