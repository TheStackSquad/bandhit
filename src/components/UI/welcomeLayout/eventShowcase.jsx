//src/components/welcomeLayout/eventShowcase.jsx
'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { slideInFromRight, hoverScale } from "@/components/motion/animations";
import { useSelector, useDispatch } from "react-redux";
import { submitToCart } from "@/utils/eventUtils/eventShowcaseUtils";

const EventShowcase = () => {
  // Get events data from Redux store and ensure it's a valid array
  const eventsFromRedux = useSelector((state) => state.event?.events || []);
  const dispatch = useDispatch();

  // Ensure we slice only if there are enough events
  const displayEvents = Array.isArray(eventsFromRedux)
    ? eventsFromRedux.slice(0, 4)
    : [];

  // Handler function that passes the entire event object to submitToCart
  const handleSelectedTicket = (eventDetails) => {
    if (!eventDetails || !dispatch) {
      console.warn("🚨 Missing eventDetails or dispatch function.");
      return;
    }

//    console.log("🛒 Ticket Selected:", eventDetails);
    submitToCart(dispatch, eventDetails);
  };


  return (
    <div className="py-16 bg-gray-50">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        Upcoming Events You&apos;ll Love
      </h2>

      <div className="container mx-auto px-4">
        {displayEvents.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={slideInFromRight}
            initial="hidden"
            animate="visible"
          >
            {displayEvents.map((event) => (
              <motion.div
                key={event?.id || Math.random()} // Prevent key errors
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:shadow-xl"
                whileHover={hoverScale}
              >
                {/* Image Container */}
                <div className="relative w-full h-48 flex justify-center items-center">
                  {event?.cover_image ? (
                    <Image
                      src={event.cover_image}
                      alt={event?.eventName || "Event Image"}
                      fill
                      className="object-contain rounded"
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      onError={() => console.error("Failed to load image:", event.cover_image)} // Error handling
                    />

                  ) : (
                    <p className="text-gray-400">Image not available</p>
                  )}
                </div>

                {/* Event Details */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {event?.event_name || "Unnamed Event"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {event?.date
                      ? new Date(event.date).toLocaleDateString()
                      : "Date TBD"}{" "}
                    | {event?.venue || "Venue TBD"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Time: {event?.time || "TBD"} | Price: ₦
                    {event?.price !== undefined ? event.price : "N/A"}
                  </p>

                  <button
                    onClick={() => handleSelectedTicket(event)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium text-lg hover:bg-blue-700 transition duration-300"
                    disabled={!event} // Disable if event data is missing
                  >
                    Buy Tickets
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-600">No upcoming events.</p>
        )}
      </div>
    </div>
  );
};

export default EventShowcase;
