// src/utils/debugLibrary/performanceWrapper.jsx
'use client';

import { Profiler } from 'react';
import { useState, useEffect } from 'react';

export function PerformanceWrapper({ id, children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleProfilerRender = (
    id, 
    phase, 
    actualDuration, 
    baseDuration, 
    startTime, 
    commitTime,
    interactions
  ) => {
    // Only log after component is mounted
    if (!isMounted) return;

    // Safely handle interactions
    const interactionData = interactions 
      ? Array.from(interactions).map(interaction => interaction?.name || 'unnamed') 
      : [];

    // Create performance data object
    const performanceData = {
      component: id,
      phase,
      actualDuration: Math.round(actualDuration * 100) / 100,
      baseDuration: Math.round(baseDuration * 100) / 100,
      startTime: Math.round(startTime * 100) / 100,
      commitTime: Math.round(commitTime * 100) / 100,
      interactions: interactionData,
      timestamp: new Date().toISOString()
    };

    // Safe logging
    try {
      console.debug(performanceData);

      // Analytics sending (when enabled)
      if (process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true') {
        // Example: sendToAnalytics(performanceData)
      }
    } catch (error) {
      console.warn('Performance logging failed:', error);
    }
  };

  // During SSR, return children without profiling
  if (!isMounted) {
    return children;
  }

  return (
    <Profiler id={id} onRender={handleProfilerRender}>
      {children}
    </Profiler>
  );
}