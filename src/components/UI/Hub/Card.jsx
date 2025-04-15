// src/components/UI/Hub/Card.jsx - enhanced version

'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/components/motion/animations";
import CloudinaryImage from '@/components/utilsDir/cloudinaryImage';
import { BadgeCheck, Phone, Heart, Store, Palette } from "lucide-react";
import Link from 'next/link';

const Card = ({
  name,          // Changed from artist_name to name
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
  const ProfileTypeIcon = profile_type === 'artist' ? Palette : Store;
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
      >
        <Heart
          className={`w-5 h-5 transition-all duration-300 
            ${isLiked ? "text-red-500 fill-red-500" : "text-gray-700 hover:text-red-500 hover:fill-red-500"}`}
        />
      </button>

      {/* Image Container */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <CloudinaryImage
          src={cover_image_url || "/default-profile.jpg"}
          alt={`${name || "Profile"} cover image`}
          className="rounded-lg"
          style={{ aspectRatio: '4/3' }}
          objectFit="cover"
          priority={false}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1 flex items-center gap-1">
          {name || "Unnamed Profile"}
          {profile_type === 'artist' && <BadgeCheck className="w-4 h-4 text-blue-500" />}
        </h3>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{bio || "No description available"}</p>

        {/* Tags/Categories */}
        <div className="mt-3 flex flex-wrap gap-1">
          {art_forms?.length > 0 ? (
            art_forms.slice(0, 3).map((category, index) => (
              <span key={index} className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                {category}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
              No Categories
            </span>
          )}
          {art_forms?.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
              +{art_forms.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Social Links */}
      <div
        className="absolute inset-0 bg-black/70 translate-y-full group-hover:translate-y-0 
                   transition-transform duration-500 ease-in-out flex items-center justify-center gap-4"
      >
        {phone && (
          <Link
            href={`https://wa.me/${phone}`}
            className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 
                     transition-all duration-300 transform hover:scale-110"
            title="WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Phone className="w-6 h-6" />
          </Link>
        )}
        {twitter && (
          <Link
            href={twitter}
            className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 
                     transition-all duration-300 transform hover:scale-110"
            title="Twitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.954 4.569c-.885.39-1.83.654-2.825.775a4.958 4.958 0 0 0 2.163-2.723 9.857 9.857 0 0 1-3.125 1.184 4.92 4.92 0 0 0-8.384 4.482A13.978 13.978 0 0 1 1.64 3.15 4.916 4.916 0 0 0 3.17 9.723 4.902 4.902 0 0 1 .964 9v.061a4.926 4.926 0 0 0 3.947 4.827 4.918 4.918 0 0 1-2.212.084 4.926 4.926 0 0 0 4.6 3.42A9.86 9.86 0 0 1 0 20.414a13.927 13.927 0 0 0 7.548 2.212c9.05 0 13.998-7.498 13.998-13.998 0-.213-.005-.425-.015-.636a10.005 10.005 0 0 0 2.463-2.55l.001-.003z" />
            </svg>
          </Link>
        )}
        {instagram && (
          <Link
            href={instagram}
            className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 
                     transition-all duration-300 transform hover:scale-110"
            title="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.319 3.608 1.293.974.975 1.23 2.242 1.293 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.062 1.366-.319 2.633-1.293 3.608-.975.974-2.242 1.23-3.608 1.293-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.366-.062-2.633-.319-3.608-1.293-.974-.975-1.23-2.242-1.293-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.849c.062-1.366.319-2.633 1.293-3.608.975-.974 2.242-1.23 3.608-1.293 1.265-.058 1.645-.07 4.849-.07zm0-2.163C8.575 0 8.146.012 7.05.07 5.793.132 4.58.389 3.685 1.285.985 3.985.132 6.575.07 7.05.012 8.146 0 8.575 0 12s.012 3.584.07 4.849c.062 1.366.319 2.633 1.293 3.608.975.974 2.242 1.23 3.608 1.293 1.265.058 1.645.07 4.849.07s3.584-.012 4.849-.07c-1.366-.062 2.633-.319 3.608-1.293.974-.975 1.23-2.242 1.293-3.608C23.988 15.584 24 15.204 24 12s-.012-3.584-.07-4.849z" />
            </svg>
          </Link>
        )}
        {facebook && (
          <Link
            href={facebook}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 
                     transition-all duration-300 transform hover:scale-110"
            title="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </Link>
        )}
      </div>
    </motion.article>
  );
};

export default Card;