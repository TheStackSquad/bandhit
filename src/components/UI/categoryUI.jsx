// src/components/UI/categoryUI.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
//eslint-disable-next-line
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/UI/Card";

const carouselImages = [
  "/uploads/carouselAsset/2pacalypse.webp",
  "/uploads/carouselAsset/baloranking.webp",
  "/uploads/carouselAsset/ghostXtec.webp",
  "/uploads/carouselAsset/odunsi.webp",
  "/uploads/carouselAsset/oml.webp",
  "/uploads/carouselAsset/sdc.webp",
  "/uploads/carouselAsset/wizkhalifa.webp",
];

const CategoryUI = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
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

  const handleLike = (index) => {
    setLikes((prev) => ({
      ...prev,
      [index]: (prev[index] || 0) + 1,
    }));
  };

  if (!mounted) return null;

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
        <div className="relative h-[400px] overflow-hidden rounded-xl">
          <Image
            src={carouselImages[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            fill
            className="object-cover transition-opacity duration-500"
          />
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
