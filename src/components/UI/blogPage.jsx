'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Ticket } from 'lucide-react';
import Link from 'next/link';
import BlogCard from '@/components/UI/blogCard';
import blogData from '@/components/data/blogData';

const categories = [
  'All', 
  'Event Management', 
  'Artist Spotlight', 
  'Industry News', 
  'Tips & Guides', 
  'Contracts & Legal'
];

const BlogPage = ({ searchParams }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const currentPage = parseInt(searchParams?.page || 1, 10);
  const postsPerPage = 6;

  // Sort posts by upvotes in descending order
  const sortedPosts = [...blogData].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

  // Filter posts by category
  const filteredPosts = selectedCategory === 'All' 
    ? sortedPosts 
    : sortedPosts.filter(post => post.category === selectedCategory);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage, 
    currentPage * postsPerPage
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              <span className="font-medium">Get tickets to the hottest shows in town!</span>
            </div>
            <div className="flex gap-4">
              <Link href="/events" className="hover:text-blue-100 transition">
                Browse Events
              </Link>
              <Link href="/vendor/register" className="hover:text-blue-100 transition">
                Sell Your Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center">Event Industry Insights</h1>
        <p className="text-center text-gray-600">
          Stay updated with the latest news and insights about events, shows, and the entertainment industry.
        </p>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-4 mt-6 pb-4 hide-scrollbar">
          {categories.map((category) => (
            <button 
              key={category} 
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full ${
                selectedCategory === category 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white shadow border'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {paginatedPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <button 
            disabled={currentPage === 1} 
            className="p-2 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="px-4">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages} 
            className="p-2 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default BlogPage;