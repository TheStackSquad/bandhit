//src/components/welcomeLayout/heroSection

'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { containVariants, textVariants, buttonVariants } from "@/components/motion/animations";

const NavButtons = () => {
  const buttonData = [
    { text: 'Get Started', path: '/signup', color: 'bg-green-600 hover:bg-green-700' },
    { text: 'Find Tickets', path: '/categories', color: 'bg-blue-600 hover:bg-blue-700' },
    { text: 'Explore Vendors & Entertainers', path: '/hub', color: 'bg-orange-500 hover:bg-orange-900' },
  ];

  return (
    <motion.div className="flex flex-col md:flex-row gap-4 justify-center variants={containVariants} ">
      {buttonData.map(({ text, path, color }, index) => (
        <motion.div key={index} variants={buttonVariants} initial="hidden" animate="visible">
          <Link href={path}>
            <motion.button 
              className={`text-white py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 ${color}`}
              whileHover={{ scale: 1.1 }}
            >
              {text}
            </motion.button>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

const HeroSection = () => {
  return (
    <motion.div 
    className="relative h-screen flex items-center justify-center text-center overflow-hidden"
    variants={containVariants}
    initial="hidden"
    animate="visible"
  >
    <div className="relative h-screen flex items-center justify-center text-center overflow-hidden">
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
      <div className="relative z-10 text-white px-4">
        {/* Tagline */}
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          Your Event, Our Expertise – <br />
          Book Tickets, Find Vendors, and Elevate Your Experience.
        </motion.h1>

        {/* Call-to-Action Buttons */}
        <NavButtons />
      </div>
    </div>
    </motion.div>
  );
};

export default HeroSection;
