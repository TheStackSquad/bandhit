// src/hooks/useReels.js
import { useState } from 'react';
import { useGetReelsQuery } from '@/reduxStore/api/reelApi';

export const useReels = (initialPage = 1, initialLimit = 9, initialFilter = {}) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [filter, setFilter] = useState(initialFilter);
  
  const queryResult = useGetReelsQuery({ 
    page, 
    limit, 
    filter 
  });
  
  const { 
    data: { reels = [], pagination } = {},
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = queryResult;
  
  // Navigation helpers
  const goToNextPage = () => {
    if (pagination && page < pagination.totalPages) {
      setPage(page + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const goToPage = (pageNumber) => {
    if (pagination && pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      setPage(pageNumber);
    }
  };
  
  // Filter helpers
  const updateFilter = (newFilter) => {
    setFilter({...filter, ...newFilter});
    setPage(1); // Reset to first page when filter changes
  };
  
  const resetFilter = () => {
    setFilter({});
    setPage(1);
  };
  
  // Limit helpers
  const updateLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };
  
  return {
    // Data
    reels,
    pagination,
    
    // Status
    isLoading,
    isError,
    error,
    isFetching,
    
    // Actions
    refetch,
    goToNextPage,
    goToPrevPage,
    goToPage,
    updateFilter,
    resetFilter,
    updateLimit,
    
    // Current state
    currentPage: page,
    currentLimit: limit,
    currentFilter: filter,
  };
};