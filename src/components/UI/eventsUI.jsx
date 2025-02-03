"use client";

// ✅ Import Dependencies
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import { submitToCart, submitLike, HeroBanner } from "@/utils/eventsUtils";

// ✅ Event Carousel Component
export default function EventCarousel() {
  const eventsFromRedux = useSelector((state) => state.event.events);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const dispatch = useDispatch();

  const handleCartClick = () => {
   // console.log('whats inside event details:', currentEvent);
    submitToCart(dispatch, currentEvent);
  };

  const handleLikeClick = () => {
  //  console.log('like details:', currentEvent._id);
    submitLike(dispatch, currentEvent._id);
  };

  const events = useMemo(() => eventsFromRedux || [], [eventsFromRedux]);
  //console.log('events from redux:', events);

  // Default event when there are no events
  const defaultEvent = useMemo(() => ({
    imageUrl: { url: "/uploads/dashboardDefault/drgnimages.jpeg" },
    eventName: "Default Event",
    date: new Date().toISOString(),
    time: "12:00 PM",
    venue: "Default Venue",
    price: "0"
  }), []);

  const currentEvent = useMemo(() => events[currentIndex] || defaultEvent, [events, currentIndex, defaultEvent]);

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

  useEffect(() => {
    if (!isPaused && events.length > 0) {
      const timer = setInterval(nextSlide, 3000);
      return () => clearInterval(timer);
    }
  }, [isPaused, events.length, nextSlide]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-gray-50">
      <div
        className="relative group w-full h-[60vh] md:h-[500px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <Image
          src={currentEvent.imageUrl?.url}
          alt={currentEvent.eventName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
          className="object-cover rounded-lg transition-transform duration-700 ease-in-out"
          priority
        />

        <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
          <h3 className="text-2xl font-bold">{currentEvent.eventName}</h3>
          <p className="text-sm opacity-80">{new Date(currentEvent.date).toLocaleDateString()} - {currentEvent.time}</p>
          <p className="text-sm opacity-80">{currentEvent.venue}</p>
          <p className="text-lg font-semibold text-yellow-400">₦{currentEvent.price}</p>
        </div>

        <div className="absolute bottom-6 right-6 flex gap-4">
          <button onClick={handleCartClick} className="p-2 bg-white/80 rounded-full hover:bg-white transition-transform duration-300 transform hover:scale-110">
            <ShoppingCart size={24} className="text-black" />
          </button>
          <button onClick={handleLikeClick} className="p-2 bg-white/80 rounded-full hover:bg-white transition-transform duration-300 transform hover:scale-110">
            <Heart size={24} className="text-red-500" />
          </button>
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
      <HeroBanner />
    </div>
  );
}