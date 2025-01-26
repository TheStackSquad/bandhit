// src/components/UI/signupComponent/SocialSignUpForm.jsx

'use client';

import React, {useState } from 'react';
import { showSuccess, showError } from '@/utils/alertManager';
import { useRouter } from 'next/navigation';
import { socialSignUp } from '@/API/signup'; // You'll need to implement the socialSignUp API call
import SocialButton from './SocialButton'; // Create buttons for Google, Facebook, etc.

const SocialSignUpForm = () => {
  const router = useRouter();
  //eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialSignUp = async (socialData) => {
    setIsLoading(true);
    try {
      const response = await socialSignUp(socialData); // Send socialData to backend API
      showSuccess(response.message);
      router.push("/events");
    } catch (error) {
      showError(error.response?.data?.message || "Social signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <SocialButton provider="google" onClick={() => handleSocialSignUp({ provider: 'google' })} />
      <SocialButton provider="facebook" onClick={() => handleSocialSignUp({ provider: 'facebook' })} />
      <SocialButton provider="linkedin" onClick={() => handleSocialSignUp({ provider: 'linkedin' })} />
    </div>
  );
};

export default SocialSignUpForm;
