// src/components/UI/hub/Card.jsx
'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/components/motion/animations";
import CloudinaryImage from '@/components/utilsDir/cloudinaryImage';
import Link from 'next/link';
import {
  BadgeCheckIcon,
  PhoneIcon,
  HeartIcon,
  StoreIcon,
  PaletteIcon,
  TwitterIcon,
  InstagramIcon,
  FacebookIcon
} from '@/lib/svgFonts/svgFonts';

const Card = ({
  name,
  bio,
  art_forms,
  cover_image_url,
  phone,
  twitter,
  instagram,
  facebook,
  profile_type
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // Profile type indicator
  const ProfileTypeIcon = profile_type === 'artist' ? PaletteIcon : StoreIcon;
  const profileTypeBg = profile_type === 'artist' ? 'bg-purple-100' : 'bg-blue-100';
  const profileTypeText = profile_type === 'artist' ? 'text-purple-700' : 'text-blue-700';

  return (
    <motion.article
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative cursor-pointer group h-full"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      {/* Profile Type Badge */}
      <div className={`absolute top-3 left-3 z-30 ${profileTypeBg} px-2 py-1 rounded-full flex items-center gap-1`}>
        <ProfileTypeIcon className={`w-3 h-3 ${profileTypeText}`} />
        <span className={`text-xs font-medium ${profileTypeText} capitalize`}>{profile_type}</span>
      </div>

      {/* Heart Icon */}
      <button
        onClick={handleLikeToggle}
        className="absolute bottom-3 right-3 z-30 p-2 rounded-full 
                 bg-white/30 backdrop-blur-sm transition-all duration-300 hover:bg-white/40"
        title={isLiked ? "Unlike" : "Like"}
        aria-label={isLiked ? "Unlike profile" : "Like profile"}
      >
        <HeartIcon
          className={`w-5 h-5 transition-all duration-300 
            ${isLiked ? "text-red-500 fill-red-500" : "text-gray-700 hover:text-red-500 hover:fill-red-500"}`}
        />
      </button>

      {/* Image Container - Using native lazy loading */}
      <div className="relative w-full overflow-hidden aspect-[4/3]">
        <CloudinaryImage
          src={cover_image_url || "/default-profile.jpg"}
          alt={`${name || "Profile"} cover image`}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          width={400}
          height={300}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1 flex items-center gap-1">
          {name || "Unnamed Profile"}
          {profile_type === 'artist' && <BadgeCheckIcon className="w-4 h-4 text-blue-500" />}
        </h3>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{bio || "No description available"}</p>

        {/* Tags/Categories */}
        <div className="mt-3 flex flex-wrap gap-1">
          {art_forms?.slice(0, 3).map((category, index) => (
            <span key={index} className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
              {category}
            </span>
          ))}
          {art_forms?.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
              +{art_forms.length - 3} more
            </span>
          )}
          {!art_forms?.length && (
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
              No Categories
            </span>
          )}
        </div>
      </div>

      {/* Social Links - Using optimized SVGs */}
      <div
        className="absolute inset-0 bg-black/70 translate-y-full group-hover:translate-y-0 
                   transition-transform duration-500 ease-in-out flex items-center justify-center gap-4"
        aria-hidden="true"
      >
        {phone && (
          <Link
            href={`tel:${phone}`}
            className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 
                     transition-all duration-300 transform hover:scale-110"
            title="Call"
            prefetch={false}
          >
            <PhoneIcon className="w-6 h-6" />
          </Link>
        )}
        {twitter && (
          <Link
            href={twitter}
            className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 
                     transition-all duration-300 transform hover:scale-110"
            title="Twitter"
            prefetch={false}
          >
            <TwitterIcon className="w-6 h-6" />
          </Link>
        )}
        {instagram && (
          <Link
            href={instagram}
            className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 
                     transition-all duration-300 transform hover:scale-110"
            title="Instagram"
            prefetch={false}
          >
            <InstagramIcon className="w-6 h-6" />
          </Link>
        )}
        {facebook && (
          <Link
            href={facebook}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 
                     transition-all duration-300 transform hover:scale-110"
            title="Facebook"
            prefetch={false}
          >
            <FacebookIcon className="w-6 h-6" />
          </Link>
        )}
      </div>
    </motion.article>
  );
};

export default Card;