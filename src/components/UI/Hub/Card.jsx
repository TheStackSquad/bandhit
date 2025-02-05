//src/components/UI/Hub/Card.jsx
'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/components/motion/animations";
import Image from "next/image";
import { BadgeCheck, Mail, Phone, Heart } from "lucide-react";
import Link from 'next/link';

const Card = ({
  name,
  description,
  category,
  image,
  isVerified,
  whatsapp,
  email,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <motion.article
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative cursor-pointer group h-full"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      {/* Verified Badge */}
      <div
        className={`absolute top-3 right-3 z-30 p-1.5 rounded-full backdrop-blur-sm
                    ${isVerified ? "bg-blue-500/10 text-blue-500" : "bg-gray-500/10 text-gray-400"}
                    transform transition-transform duration-300 group-hover:scale-110`}
        title={isVerified ? "Verified" : "Not Verified"}
      >
        <BadgeCheck className="w-5 h-5" />
      </div>

      {/* Heart Icon */}
      <button
        onClick={handleLikeToggle}
        className="absolute bottom-3 right-3 z-30 p-2 rounded-full 
                 bg-white/30 backdrop-blur-sm transition-all duration-300 hover:bg-white/40"
        title={isLiked ? "Unlike" : "Like"}
      >
        <Heart
          className={`w-5 h-5 transition-all duration-300 
            ${isLiked ? "text-red-500 fill-red-500" : "text-gray-700 hover:text-red-500 hover:fill-red-500"}`}
        />
      </button>

      {/* Image Container */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1540px) 380px, (min-width: 1280px) 330px, (min-width: 1040px) 280px, (min-width: 780px) 230px, (min-width: 640px) 180px, calc(100vw - 32px)"
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
        <span className="text-xs text-gray-500 mt-2 inline-block px-2 py-1 bg-gray-100 rounded-full">
          {category}
        </span>
      </div>

      {/* Sliding Overlay with Icons */}
      <div 
        className="absolute inset-0 bg-black/70 translate-y-full group-hover:translate-y-0 
                   transition-transform duration-500 ease-in-out flex items-center justify-center gap-6"
      >
        {whatsapp && (
          <Link
            href={`https://wa.me/${whatsapp}`}
            className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 
                     transition-all duration-300 transform hover:scale-110"
            title="WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Phone className="w-6 h-6" />
          </Link>
        )}
        {email && (
          <Link
            href={`mailto:${email}`}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 
                     transition-all duration-300 transform hover:scale-110"
            title="Email"
          >
            <Mail className="w-6 h-6" />
          </Link>
        )}
      </div>
    </motion.article>
  );
};

export default Card;