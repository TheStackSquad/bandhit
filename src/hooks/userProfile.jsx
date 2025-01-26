// hooks/useProfile.js
import { useState, useCallback } from 'react';
import axios from 'axios';

export const useProfile = (initialProfile = {}) => {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = useCallback(async (partialUpdate) => {
    setLoading(true);
    try {
      const response = await axios.patch(`/api/profile/${profile.id}`, partialUpdate);
      setProfile(prev => ({ ...prev, ...response.data }));
      return response.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [profile.id]);

  const deleteProfile = useCallback(async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/profile/${profile.id}`);
      setProfile({});
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [profile.id]);

  return { 
    profile, 
    updateProfile, 
    deleteProfile, 
    loading, 
    error 
  };
};
