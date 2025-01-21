// src/components/SafeHydration.jsx
'use client';

import { useEffect, useState } from 'react';

export function SafeHydration({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? children : null;
}
