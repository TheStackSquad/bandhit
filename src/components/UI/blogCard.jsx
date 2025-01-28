'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ThumbsUp, ThumbsDown, Bookmark, Link as LinkIcon } from 'lucide-react';

const BlogCardInteractions = ({ postId, initialVotes }) => {
  const [votes, setVotes] = useState({
    upvotes: initialVotes?.upvotes || 0,
    downvotes: initialVotes?.downvotes || 0
  });
  const [userVote, setUserVote] = useState(null);

  const handleVote = (voteType) => {
    setVotes(prevVotes => {
      const newVotes = { ...prevVotes };

      // Reset previous vote if exists
      if (userVote === 'up') newVotes.upvotes--;
      if (userVote === 'down') newVotes.downvotes--;

      // Apply new vote
      if (voteType === 'up') newVotes.upvotes++;
      if (voteType === 'down') newVotes.downvotes++;

      return newVotes;
    });

    setUserVote(voteType === userVote ? null : voteType);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/blog/${postId}`);
  };

  return (
    <div className="flex items-center justify-between mt-4 p-2 bg-gray-50 rounded-b-lg">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => handleVote('up')} 
          className={`flex items-center ${userVote === 'up' ? 'text-green-500' : 'text-gray-500'}`}
        >
          <ThumbsUp className="w-5 h-5 mr-1" />
          {votes.upvotes}
        </button>
        <button 
          onClick={() => handleVote('down')} 
          className={`flex items-center ${userVote === 'down' ? 'text-red-500' : 'text-gray-500'}`}
        >
          <ThumbsDown className="w-5 h-5 mr-1" />
          {votes.downvotes}
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-blue-500">
          <Bookmark className="w-5 h-5" />
        </button>
        <button 
          onClick={handleCopyLink} 
          className="text-gray-500 hover:text-green-500"
        >
          <LinkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

//eslint-disable-next-line
const BlogCard = ({ post, onCardClick }) => {
  const handleClick = (e) => {
      // Prevent interaction if clicking on specific elements
      if (
        e.target.closest('a') || 
        e.target.closest('.interactions') || 
        e.target.closest('button')
      ) {
        return;
      }
      onCardClick(post);
  };

  return (
    <div
    role="button"
    tabIndex={0}
    onClick={handleClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') handleClick();
    }}
    className="bg-white rounded-lg shadow transition-all duration-300 
               hover:translate-y-[-10px] hover:shadow-lg group cursor-pointer"
  >
    <div className="block">
      <div className="relative w-full pt-[56.25%]"> {/* 16:9 aspect ratio */}
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-t-lg object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold line-clamp-2">{post.title}</h2>
        <p className="text-sm text-gray-500 line-clamp-3">{post.excerpt}</p>
  
        <div className="flex items-center mt-4">
          {post.author?.image && (
            <Image
              src={post.author.image}
              alt={post.author.name || 'Author'}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <div className="ml-2">
            <span>{post.author?.name}</span>
            <time className="block text-sm text-gray-500">
              {new Date(post.date).toLocaleDateString()}
            </time>
          </div>
        </div>
  
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
          <Link
            href={`/blog/${post.id}`}
            className="text-blue-500 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
    <div className="interactions">
      <BlogCardInteractions
        postId={post.id}
        initialVotes={post.votes || { upvotes: 0, downvotes: 0 }}
      />
    </div>
  </div>
  
  );
};

export default BlogCard;