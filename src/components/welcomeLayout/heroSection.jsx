//src/components/welcomeLayout/heroSection.jsx
'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { containVariants, textVariants, buttonVariants } from "@/components/motion/animations";

const HeroSection = () => {
  return (
    <motion.div 
      className="relative h-screen flex items-center justify-center text-center overflow-hidden"
      variants={containVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/uploads/welcomeAsset/gabby_11zon.webp"
          alt="Event Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <motion.div className="relative z-10 text-white px-4">
        {/* Tagline */}
        <motion.h1 
          className="text-3xl md:text-6xl font-bold mb-6"
          variants={textVariants}
        >
          Your Event, Our Expertise – <br />
          Book Tickets, Find Vendors, and Elevate Your Experience.
        </motion.h1>

        {/* CTAs */}
        <motion.div className="flex flex-col md:flex-row gap-4 justify-center" variants={containVariants}>
          {["Find Tickets", "Sign Up", "Sign In", "Explore Vendors & Entertainers"].map((text, index) => (
            <motion.button 
              key={index}
              className={`py-3 px-6 rounded-lg text-white transition duration-300 transform hover:scale-105 ${
                text === "Find Tickets" ? "bg-blue-600 hover:bg-blue-700" : 
                text === "Sign Up" ? "bg-green-600 hover:bg-green-700" : 
                text === "Sign In" ? "bg-purple-600 hover:bg-purple-700" : 
                "bg-orange-600 hover:bg-orange-700"
              }`}
              variants={buttonVariants}
            >
              {text}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
