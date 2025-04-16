// src/components/UI/hub/HubGrid.jsx

import React, { useState } from 'react';
import Card from '@/components/UI/hub/Card';
import { Palette, Store, SortAsc, SortDesc, Filter, X } from 'lucide-react';

const HubGrid = ({ data }) => {
  const [filterType, setFilterType] = useState('all'); // 'all', 'artist', 'vendor'
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest'
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredData = data.filter(item => {
    if (filterType === 'all') return true;
    return item.profile_type === filterType;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else {
      return new Date(a.created_at) - new Date(b.created_at);
    }
  });

  return (
    <div className="space-y-6">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Discover Profiles</h2>
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {mobileFiltersOpen ? (
            <>
              <X className="w-4 h-4" /> Close
            </>
          ) : (
            <>
              <Filter className="w-4 h-4" /> Filters
            </>
          )}
        </button>
      </div>

      {/* Filter and Sort Controls */}
      <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block bg-white p-4 rounded-lg shadow-sm`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Filter by Type */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter by type
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${filterType === 'all'
                    ? 'bg-gray-800 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-sm'
                  }`}
              >
                All Profiles
              </button>
              <button
                onClick={() => setFilterType('artist')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${filterType === 'artist'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200 shadow-sm'
                  }`}
              >
                <Palette className="w-4 h-4" /> Artists
              </button>
              <button
                onClick={() => setFilterType('vendor')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${filterType === 'vendor'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm'
                  }`}
              >
                <Store className="w-4 h-4" /> Vendors
              </button>
            </div>
          </div>

          {/* Sort by Date */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <SortAsc className="w-4 h-4" /> Sort by date
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSortOrder('newest')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${sortOrder === 'newest'
                    ? 'bg-gray-800 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-sm'
                  }`}
              >
                Newest <SortDesc className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSortOrder('oldest')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${sortOrder === 'oldest'
                    ? 'bg-gray-800 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-sm'
                  }`}
              >
                Oldest <SortAsc className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedData.length > 0 ? (
          sortedData.map((item) => (
            <Card key={item.id} {...item} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                {filterType === 'all'
                  ? 'No profiles found'
                  : `No ${filterType}s found`}
              </h3>
              <p className="text-gray-500">
                {filterType === 'all'
                  ? 'There are currently no profiles available.'
                  : `We couldn't find any ${filterType} profiles. Try changing your filters.`}
              </p>
              {filterType !== 'all' && (
                <button
                  onClick={() => setFilterType('all')}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Show all profiles
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Results Count and Pagination (future enhancement) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{sortedData.length}</span> {filterType === 'all' ? 'profiles' : filterType + 's'}
        </div>

        {/* Placeholder for pagination */}
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HubGrid;