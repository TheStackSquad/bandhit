//src/components/welcomeLayout/eventShowcase

'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { slideInFromRight, hoverScale } from "@/components/motion/animations";
import { useSelector, useDispatch } from "react-redux";
import { submitToCart } from "@/utils/eventShowcaseUtils";

const EventShowcase = () => {
  // Get events data from Redux store
  const eventsFromRedux = useSelector((state) => state.event.events);
  const dispatch = useDispatch();
  
  // Take only the first 3 events from the array
  const displayEvents = eventsFromRedux.slice(0, 4);
  
  // Handler function that passes the entire event object to submitToCart
  const handleSelectedTicket = (eventDetails) => {
  //  console.log('Selected event details:', eventDetails);
    submitToCart(dispatch, eventDetails);
  };
   
  return (
    <div className="py-16 bg-gray-50">
     <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
  Upcoming Events You&apos;ll Love
</h2>

      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={slideInFromRight}
          initial="hidden"
          animate="visible"
        >
          {displayEvents.map((event) => (
            <motion.div
              key={event._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:shadow-xl"
              whileHover={hoverScale}
            >
              <div className="relative w-full h-48">
                <Image
                  src={event.imageUrl.url}
                  alt={event.eventName}
                  fill
                  className="object-cover rounded"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {event.eventName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(event.date).toLocaleDateString()} | {event.venue}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Time: {event.time} | Price: ${event.price}
                </p>
                <button 
                  onClick={() => handleSelectedTicket(event)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium text-lg hover:bg-blue-700 transition duration-300"
                >
                  Buy Tickets
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default EventShowcase;