//src/components/welcomeLayout/eventShowcase

'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { slideInFromRight, hoverScale } from "@/components/motion/animations";

// Mock data for events (replace with real data from your backend)
const events = [
  {
    id: 1,
    name: "Summer Music Festival",
    date: "June 25, 2024",
    location: "Oniru Beach, lagos Island",
    image: "/uploads/welcomeAsset/summerJam_4_11zon.webp",
  },
  {
    id: 2,
    name: "Tech Conference 2024",
    date: "July 10, 2024",
    location: "Mariam Dekanbi Hall, Lekki",
    image: "/uploads/welcomeAsset/techsummit_5_11zon.webp",
  },
  {
    id: 3,
    name: "Food & Wine Expo",
    date: "August 5, 2024",
    location: "Oluyole, Ibadan",
    image: "/uploads/welcomeAsset/techsummit_5_11zon.webp",
  },
  {
    id: 4,
    name: "Art & Design Fair",
    date: "September 15, 2024",
    location: "Kuto, Abeokuta",
    image: "/uploads/welcomeAsset/exhibition_3_11zon.webp",
  },
];

const EventShowcase = () => {
  return (
    <div className="py-16 bg-gray-50">
    {/* Headline */}
    <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
      Upcoming Events You’ll Love
    </h2>

    {/* Event Cards Container */}
    <div className="container mx-auto px-4">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={slideInFromRight}
        initial="hidden"
        animate="visible"
      >
        {events.map((event) => (
          <motion.div
            key={event.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:shadow-xl"
            whileHover={hoverScale}
          >
         <div className="relative w-full h-48">
  <Image
    src={event.image}
    alt={event.name}
    fill
    className="object-cover rounded"
    priority
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  />
</div>


            {/* Event Details */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {event.date} | {event.location}
              </p>

              {/* CTA Button */}
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium text-lg hover:bg-blue-700 transition duration-300">
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