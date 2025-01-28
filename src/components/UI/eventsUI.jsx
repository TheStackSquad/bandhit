"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from "lucide-react";
import Link from 'next/link';
import { upcomingEventsData } from "@/components/data/eventsData"; // Import the events data
import { useDispatch, useSelector } from "react-redux";
import { handleCartSubmit } from "@/utils/eventsUtils";

import Image from "next/image";

const carouselAssets = Object.keys( upcomingEventsData);

export default function EventCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cart = useSelector((state) => state.cart);
  const token = useSelector((state) => state?.auth?.user?.accesstoken);
  const dispatch = useDispatch();


  const handleAddToCart = () => {
    handleCartSubmit(currentEvent, token, dispatch);
  };

  const isItemInCart = cart.items.some((item) => item.id === currentEvent.id);

  // Auto-play functionality
  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselAssets.length);
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(timer);
    }
  }, [isHovered]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselAssets.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselAssets.length - 1 : prevIndex - 1
    );
  };

  const handleLike = () => {
    setLikes((prevLikes) => prevLikes + 1);
  };

  const currentAsset = carouselAssets[currentIndex];
  const currentEvent = upcomingEventsData[currentAsset];

  return (
    <div className={` eventsUI grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-gray-50`}>
      {/* Carousel Section */}
      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-lg shadow-md">
          <div className="relative w-full h-[400px]">
            <Image
              src={`/uploads/events/${currentAsset}`}
              alt={`${currentEvent.name}`}
              className="object-cover transition-transform duration-300"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Event Details Overlay */}
          <div
            className={` absolute inset-0 bg-black/50 transition-opacity duration-300 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          >
            <div
              className={`eventsUI absolute inset-0 flex flex-col justify-end p-6 text-white transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-80"
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{currentEvent.name}</h3>
              <div className="space-y-1">
                <p className="flex justify-between">
                  <span>Date:</span>
                  <span>
                    {new Date(currentEvent.date).toLocaleDateString()}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Time:</span>
                  <span>{currentEvent.time}</span>
                </p>
                <p className="flex justify-between">
                  <span>Venue:</span>
                  <span>{currentEvent.venue}</span>
                </p>
                <p className="flex justify-between">
                  <span>Price:</span>
                  <span>{currentEvent.price}</span>
                </p>
                <p
                  className={`flex justify-between ${
                    currentEvent.status === "Sold Out"
                      ? "text-red-400"
                      : currentEvent.status === "Postponed"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  <span>Status:</span>
                  <span>{currentEvent.status}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Icons Overlay */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              className="flex items-center gap-1 px-3 py-2 text-white bg-red-600/80 rounded-md shadow-md hover:bg-red-700 transition-colors"
              onClick={handleLike}
            >
              <Heart className="w-5 h-5" />
              <span>{likes}</span>
            </button>
            <button
            className={`p-2 rounded-md shadow-md transition-colors ${
              isItemInCart
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="ml-1">
              {cart.items.length > 0 ? cart.items.length : ""}
            </span>
          </button>

          </div>
        </div>

        {/* Navigation Buttons */}
        <div
          className={`absolute inset-0 flex items-center justify-between px-4 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={prevSlide}
            className="p-2 bg-black/50 rounded-full hover:bg-black/75 transition-colors"
          >
            <ChevronLeft className="text-white w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 bg-black/50 rounded-full hover:bg-black/75 transition-colors"
          >
            <ChevronRight className="text-white w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div
        className=' flex items-center justify-center bg-blue-100 rounded-lg shadow-md'
      >
     <div className="text-center p-8">
  <h1 className="text-4xl font-bold text-blue-700">
    Welcome to Bandhit!
  </h1>
  <p className="mt-4 text-gray-600">
    Explore a world of music, events, and unforgettable experiences.
    Join us in celebrating the artistry of entertainers and the vibrant
    culture of live performances.
  </p>

  <div className="mt-6 flex flex-col gap-4 items-center sm:flex-row sm:justify-center">
    {/* Discover More Button */}
    <Link href="/categories">
      <button className="px-6 py-3 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95">
        Discover More
      </button>
    </Link>

    {/* Create Your Event Button */}
    <Link href="/dashboard">
      <button className="px-6 py-3 text-white bg-green-600 rounded-md shadow-md hover:bg-green-700 transition-transform transform hover:scale-105 active:scale-95">
        Create Your Event
      </button>
    </Link>
  </div>
</div>

      </div>
    </div>
  );
}
