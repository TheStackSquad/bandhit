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
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative cursor-pointer group"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      {/* Verified Badge */}
      <div
        className={`absolute top-2 right-2 z-30 p-1 rounded-full 
                    ${
                      isVerified
                        ? "text-blue-500 bg-blue-100"
                        : "text-gray-400 bg-gray-200"
                    }`}
        title={isVerified ? "Verified" : "Not Verified"}
      >
        <BadgeCheck className="w-6 h-6 animate-pulse" />
      </div>

      {/* Heart Icon */}
      <button
        onClick={handleLikeToggle}
        className="absolute bottom-2 right-2 z-30 p-2 rounded-full transition-all duration-300"
        title={isLiked ? "Unlike" : "Like"}
      >
        <Heart
          className={`w-6 h-6 transition-all duration-300 ${
            isLiked
              ? "text-red-500 fill-red-500 animate-pulse"
              : "text-white/70 hover:text-red-500 hover:fill-red-500"
          }`}
        />
      </button>

      {/* Image */}
      <Image
        src={image}
        alt={name}
        width={640}
        height={240}
        className="w-full h-40 object-cover"
        priority
      />

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <span className="text-xs text-gray-500 mt-2 inline-block">
          {category}
        </span>
      </div>

      {/* Overlay with Icons */}
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-20">
        {whatsapp && (
          <Link
            href={`https://wa.me/${whatsapp}`}
            className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-transform transform hover:scale-110"
            title="WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Phone className="w-6 h-6 bg-white" />
          </Link>
        )}
        {email && (
          <Link
            href={`mailto:${email}`}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-transform transform hover:scale-110"
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
