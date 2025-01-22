// src/app/blog/page.jsx
//eslint-disable-next-line
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Ticket } from 'lucide-react';

// Metadata for SEO
export const metadata = {
  title: 'Event Industry Insights & News | YourApp',
  description: 'Stay updated with the latest news, think pieces, and insights about events, shows, artist management, and entertainment contracts.',
  keywords: [
    'event management',
    'entertainment news',
    'artist contracts',
    'event planning',
    'show business',
    'event tickets',
    'entertainment industry'
  ],
  openGraph: {
    title: 'Event Industry Insights & News | YourApp',
    description: 'Your source for event industry news, insights, and expert perspectives',
    images: [
      {
        url: '/blog-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Event Industry Insights'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Event Industry Insights & News | YourApp',
    description: 'Your source for event industry news, insights, and expert perspectives',
    images: ['/blog-og-image.jpg']
  }
};

const categories = [
  'All',
  'Event Management',
  'Artist Spotlight',
  'Industry News',
  'Tips & Guides',
  'Contracts & Legal',
];

export default function BlogUI({ searchParams }) {
  const currentPage = parseInt(searchParams.page) || 1;
  
  // Sample blog posts data (replace with actual data fetching)
  const posts = [
    {
      id: 1,
      title: 'The Future of Virtual Events in 2024',
      excerpt: 'Exploring how technology is reshaping the event industry...',
      category: 'Industry News',
      readTime: '5 min read',
      author: {
        name: 'Sarah Johnson',
        image: '/authors/sarah.jpg'
      },
      coverImage: '/blog/virtual-events.jpg',
      date: '2024-01-20'
    },
    // Add more posts...
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <Ticket className="w-5 h-5" />
              <span className="font-medium">Get tickets to the hottest shows in town!</span>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/events" 
                className="text-sm font-medium hover:text-blue-100 transition-colors"
              >
                Browse Events
              </Link>
              <Link 
                href="/vendor/register" 
                className="text-sm font-medium hover:text-blue-100 transition-colors"
              >
                Sell Your Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-josefin">
            Event Industry Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest news and insights about events, shows, and the entertainment industry.
          </p>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-4 mb-12 pb-4 hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              className="px-6 py-2 rounded-full bg-white shadow-sm border border-gray-200 
                       hover:border-blue-500 transition-colors whitespace-nowrap
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article 
              key={post.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link href={`/blog/${post.id}`}>
                <div className="relative h-48">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-blue-600 font-medium">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 font-josefin line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {post.author.name}
                      </span>
                      <time className="text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center items-center gap-4">
          <button
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 hover:border-blue-500 
                     disabled:opacity-50 disabled:hover:border-gray-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-gray-600">
            Page {currentPage} of 10
          </span>
          <button
            disabled={currentPage === 10}
            className="p-2 rounded-lg border border-gray-200 hover:border-blue-500
                     disabled:opacity-50 disabled:hover:border-gray-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}
