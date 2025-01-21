"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calendar,
  Users,
  //eslint-disable-next-line
  Ticket,
  Home as HomeIcon,
  Info,
  Phone,
  Bookmark,
  Layers,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setNestedOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md shadow-md focus:outline-none hover:bg-blue-700 hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <ChevronDown
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          size={20}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={dropdownVariants}
            className="absolute right-0 w-56 p-2 mt-3 bg-white rounded-lg shadow-lg z-50"
          >
            <motion.li
              variants={itemVariants}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            >
              <Link href="/" className="flex items-center gap-2 w-full">
                <HomeIcon size={18} /> Home
              </Link>
            </motion.li>
            <motion.li
              variants={itemVariants}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            >
              <Link href="/events" className="flex items-center gap-2 w-full">
                <Calendar size={18} /> Events
              </Link>
            </motion.li>
            <motion.li
              variants={itemVariants}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            >
              <Link href="/categories" className="flex items-center gap-2 w-full">
                <Layers size={18} /> Categories
              </Link>
            </motion.li>
            <motion.li
              variants={itemVariants}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            >
              <Link href="/bookings" className="flex items-center gap-2 w-full">
                <Bookmark size={18} /> My Bookings
              </Link>
            </motion.li>
            {/* Nested Dropdown */}
            <motion.li
              variants={itemVariants}
              className="relative flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
              onMouseEnter={() => setNestedOpen(true)}
              onMouseLeave={() => setNestedOpen(false)}
            >
              <Users size={18} /> For Vendors/Entertainers
              <ChevronDown
                className={`ml-auto transition-transform duration-200 ${nestedOpen ? "rotate-180" : ""}`}
                size={18}
              />
              <AnimatePresence>
                {nestedOpen && (
                  <motion.ul
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    variants={dropdownVariants}
                    className="absolute right-full top-0 w-56 p-2 ml-2 bg-white rounded-lg shadow-lg"
                  >
                    <motion.li
                      variants={itemVariants}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Link href="/vendors" className="flex items-center gap-2 w-full">
                        <Users size={18} /> Vendors
                      </Link>
                    </motion.li>
                    <motion.li
                      variants={itemVariants}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Link href="/entertainers" className="flex items-center gap-2 w-full">
                        <Users size={18} /> Entertainers
                      </Link>
                    </motion.li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
            <motion.li
              variants={itemVariants}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            >
              <Link href="/about" className="flex items-center gap-2 w-full">
                <Info size={18} /> About Us
              </Link>
            </motion.li>
            <motion.li
              variants={itemVariants}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            >
              <Link href="/contact" className="flex items-center gap-2 w-full">
                <Phone size={18} /> Contact Us
              </Link>
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
