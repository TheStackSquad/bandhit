"use client";

// External library imports
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import Link from "next/link";

// Icon imports
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
} from "lucide-react";

// React hooks
import { useEffect, useRef, useState } from "react";

// Animation variants
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

// Navigation items configuration
const navItems = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/events", icon: Calendar, label: "Events" },
  { href: "/categories", icon: Layers, label: "Categories" },
  { href: "/blog", icon: Book, label: "Blog" },
  { href: "/bookings", icon: Bookmark, label: "My Bookings" },
];

const nestedNavItems = [
  { href: "/vendors", icon: Store, label: "Vendors" },
  { href: "/entertainers", icon: Mic, label: "Entertainers" },
];

const footerNavItems = [
  { href: "/about", icon: Info, label: "About Us" },
  { href: "/contact", icon: Phone, label: "Contact Us" },
];

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.length;

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

  const handleItemClick = () => {
    setIsOpen(false);
    setNestedOpen(false);
  };

  const renderNavItem = ({ href, icon: Icon, label }) => (
    <motion.li 
      key={href}
      variants={itemVariants} 
      className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
    >
      <Link 
        href={href} 
        className="flex items-center gap-2 w-full"
        onClick={handleItemClick}
      >
        <Icon size={18} /> {label}
      </Link>
    </motion.li>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-4">
        <Link href="/checkout">
          <button
            className="relative flex items-center justify-center w-12 h-12 text-white bg-blue-600 rounded-full shadow-md focus:outline-none hover:bg-blue-700 hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            aria-label="Cart"
          >
            <ShoppingCart size={20} className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-sm font-bold text-white bg-red-600 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
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
            className="absolute right-0 w-56 p-2 mt-3 bg-white rounded-lg shadow-lg z-50"
          >
            {navItems.map(renderNavItem)}

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