// src/components/UI/categoryUI.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
//eslint-disable-next-line
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/UI/Card";
import { carouselImages, calculateDaysUntilEvent } from "@/components/data/eventsData";


const CategoryUI = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  //eslint-disable-next-line
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
    //eslint-disable-next-line
  const [likes, setLikes] = useState({});

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  }, []);

  // Automatic carousel
  useEffect(() => {
    if (mounted && !isHovered) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [mounted, isHovered, nextSlide]);

    //eslint-disable-next-line
    const handleLike = (index) => {
      setLikes((prev) => ({
        ...prev,
        [index]: prev[index] ? null : 1
      }));
    };

  if (!mounted) return null;

  const currentEvent = carouselImages[currentSlide];
  const daysUntilEvent = calculateDaysUntilEvent(currentEvent.eventDate);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Special Offers Section */}
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">
        Special Offers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardHeader>
            <h3 className="text-xl font-semibold">Early Bird Tickets</h3>
          </CardHeader>
          <CardContent>
            <p>Get 20% off when you book early! Use code EARLY20</p>
          </CardContent>
        </Card>
  
        <Card className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
          <CardHeader>
            <h3 className="text-xl font-semibold">Festival Season</h3>
          </CardHeader>
          <CardContent>
            <p>Summer music festivals lineup now available!</p>
          </CardContent>
        </Card>
      </div>
    </section>
  
    {/* Carousel and Sign Up Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Carousel Section */}
      <section className="lg:col-span-1">
      <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">
        Upcoming Events
      </h2>
      <div 
        className="relative h-[400px] overflow-hidden rounded-xl group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={currentEvent.image}
          alt={currentEvent.name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-500"
        />
        
        {/* Like Button */}
        <button 
          onClick={() => handleLike(currentSlide)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/50 rounded-full"
        >
          <Heart 
            className={`w-6 h-6 transition-colors duration-300 ${
              likes[currentSlide] 
                ? 'fill-red-500 text-red-500 animate-pulse' 
                : 'text-gray-700 hover:text-red-500'
            }`}
          />
        </button>

        {/* Event Details Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{currentEvent.name}</h3>
              <p>{daysUntilEvent} days until event</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div
          className={`absolute inset-0 flex items-center justify-between p-4 ${
            isHovered ? "opacity-100" : "opacity-0"
          } transition-opacity`}
        >
          <button
            onClick={() =>
              setCurrentSlide(
                (prev) =>
                  (prev - 1 + carouselImages.length) % carouselImages.length
              )
            }
            className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  
      {/* Sign-Up Section */}
      <section className="lg:col-span-1">
        <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">
          Get First Access
        </h2>
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white h-[400px]">
          <CardContent className="p-8 flex flex-col justify-center h-full">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="mb-6">
              Sign up now to receive early notifications and exclusive discounts
              on upcoming events!
            </p>
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg text-gray-900"
              />
              <button className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Sign Up
              </button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  
    {/* Categories and Locations Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Trending Categories */}
      <section className="lg:col-span-1">
        <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">
          Trending Categories
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {["Music", "Sports", "Theater", "Comedy"].map((category) => (
            <Card key={category} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold">{category}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
  
      {/* Top Locations */}
      <section className="lg:col-span-1">
        <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">
          Top Locations
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {["Lagos", "Abuja", "Port Harcourt", "Ibadan"].map((location) => (
            <Card key={location} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold">{location}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  </div>
  
  );
};

export default CategoryUI;
