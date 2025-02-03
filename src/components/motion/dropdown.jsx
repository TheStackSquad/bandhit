//src/components/motion/dropdown.jsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Bookmark,
  Calendar,
  ChevronDown,
  Home as HomeIcon,
  Info,
  Layers,
  Phone,
  Book,
  ShoppingCart,
  Users,
  Store,
  Mic,
  UserRoundPen,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux';

// Modified animation variants for vertical staggering
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

// Changed x animation to y for vertical staggering
const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0 },
};

const navItems = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/categories", icon: Layers, label: "Categories" },
  { href: "/blog", icon: Book, label: "Blog" },
  { href: "/bookings", icon: Bookmark, label: "My Bookings" },
];

const nestedNavItems = [
  { href: "/dashboard", icon: UserRoundPen, label: "Dashboard" },
  { href: "/hub", icon: Store, label: "Vendors" },
  { href: "/talent", icon: Mic, label: "Entertainers" },
];

const footerNavItems = [
  { href: "/about-us", icon: Info, label: "About Us" },
  { href: "/contact", icon: Phone, label: "Contact Us" },
];



export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cartItems = useSelector((state) => state.cart.items);
  const [count, setCount] = useState(0);


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      setNestedOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  useEffect(() => {
    // First, immediately update count from Redux state
    if (Array.isArray(cartItems)) {
      setCount(cartItems.length);
    }

    // Then verify against localStorage for consistency
    const verifyCount = () => {
      const cartData = localStorage.getItem("persist:cart");
      
      if (cartData) {
        try {
          const parsedCart = JSON.parse(cartData);
          const itemsArray = parsedCart.items ? JSON.parse(parsedCart.items) : [];
          
          // Only update if there's a mismatch with Redux state
          if (itemsArray.length !== cartItems.length) {
            console.warn('Cart count mismatch detected. Syncing with localStorage.');
            setCount(itemsArray.length);
          }
        } catch (error) {
          console.error("Error verifying cart count:", error);
        }
      }
    };

    // Verify after a short delay to ensure localStorage is updated
    const timeoutId = setTimeout(verifyCount, 100);
    
    return () => clearTimeout(timeoutId);
  }, [cartItems]); // Depend on Redux state changes

  const handleItemClick = () => {
    setIsOpen(false);
    setNestedOpen(false);
  };

  const renderNavItem = ({ href, icon: Icon, label }) => (
    <motion.li 
      key={href}
      variants={itemVariants} 
      className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
    >
      <Link 
        href={href} 
        className="flex items-center gap-2 w-full text-gray-700 hover:text-blue-600"
        onClick={handleItemClick}
      >
        <Icon size={18} /> {label}
      </Link>
    </motion.li>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-4">
     
      <Link href="/checkout" className="relative">
      <ShoppingCart 
        className={`w-6 h-6 transition-colors duration-200 ${
          count > 0 ? 'text-blue-600' : 'text-gray-400'
        }`} 
      />
      {count > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-fade-in">
          {count}
        </div>
      )}
    </Link>


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
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={dropdownVariants}
            className="absolute right-0 w-56 p-2 mt-3 bg-white rounded-lg shadow-lg z-50 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            {navItems.map(renderNavItem)}

            <motion.li
              variants={itemVariants}
              className="relative flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setNestedOpen(!nestedOpen)}
            >
              <div className="flex items-center gap-2 w-full text-gray-700 hover:text-blue-600 cursor-pointer">
                <Users size={18} /> 
                <span>Vendors & Entertainers</span>
                <ChevronDown
                  className={`ml-auto transition-transform duration-200 ${nestedOpen ? "rotate-180" : ""}`}
                  size={18}
                />
              </div>
              
              <AnimatePresence>
                {nestedOpen && (
                  <motion.ul
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    variants={dropdownVariants}
                    className="absolute left-0 w-full mt-2 p-2 bg-gray-200 rounded-lg shadow-lg top-full"
                  >
                    {nestedNavItems.map(renderNavItem)}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>

            {footerNavItems.map(renderNavItem)}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}