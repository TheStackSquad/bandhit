// src/components/UI/reel.jsx
'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

const VideoReel = ({ 
  videoUrl,
  userAvatar,
  username,
  description,
  timestamp,
  likes = 0,
  comments = 0,
  shares = 0,
  isOrganizer = false,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleConnect = () => {
    // Handle connect logic here
  //  console.log(`Connecting with ${username}`);
  };

  const handleShare = () => {
    // Handle share logic here
  //  console.log(`Sharing ${username}'s video`);
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-lg shadow-md mb-6">
      {/* User Info Section */}
      <div className="flex items-center p-4">
      <div className="relative">
  <Image
    src={userAvatar}
    alt={username}
    width={40}
    height={40}
    className="w-10 h-10 rounded-full object-cover"
  />
</div>
        <div className="ml-3 flex-grow">
          <h3 className="font-semibold text-gray-800">{username}</h3>
          <p className="text-sm text-gray-500">{timestamp}</p>
        </div>
        {isOrganizer && (
          <button
            onClick={handleConnect}
            className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            Connect
          </button>
        )}
      </div>

      {/* Video Section */}
      <div className="relative w-full pt-[177.77%]">
  <video
    className="absolute top-0 left-0 w-full h-full object-cover"
    src={videoUrl}
    loop
    playsInline
    controls
    muted // ✅ This removes the captions requirement
  />
</div>



      {/* Engagement Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1"
            >
              <Heart
                className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
              <span className="text-sm text-gray-600">{likeCount}</span>
            </button>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-6 h-6 text-gray-600" />
              <span className="text-sm text-gray-600">{comments}</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center space-x-1"
            >
              <Share2 className="w-6 h-6 text-gray-600" />
              <span className="text-sm text-gray-600">{shares}</span>
            </button>
          </div>
        </div>
        <p className="text-gray-800">{description}</p>
      </div>
    </div>
  );
};

export default VideoReel;