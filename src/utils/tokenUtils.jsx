//src/utils/tokenUtils.jsx
'use client';
import { useState, useEffect } from 'react';
export const useToken = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authData = localStorage.getItem("auth");
      const auth = authData ? JSON.parse(authData) : null;
      setToken(auth?.accessToken);
    }
  }, []);

  return token;
};