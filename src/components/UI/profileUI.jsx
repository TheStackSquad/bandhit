
// components/UI/ProfileForm
'use client'

import React, { useState } from 'react';
import { useProfile } from '@/hooks/userProfile';

export const ProfileForm = ({ initialProfile }) => {
  const { profile, updateProfile, deleteProfile, loading } = useProfile(initialProfile);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name || profile.name || ''}
        onChange={handleChange}
        placeholder="Name"
      />
      {/* Additional form fields */}
      <button type="submit" disabled={loading}>
        Update Profile
      </button>
      <button 
        type="button" 
        onClick={deleteProfile} 
        disabled={loading}
      >
        Delete Profile
      </button>
    </form>
  );
};
export default ProfileForm;