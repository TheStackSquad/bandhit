// src/utils/socialSignUpUtils.jsx
'use client';

import { signIn } from 'next-auth/react';

export const handleSocialSubmit = async (provider) => {
  try {
    // Initialize authentication session with the selected provider
    const result = await signIn(provider, {
      callbackUrl: '/dashboard', // Redirect after successful auth
      redirect: false // Prevent automatic redirect to handle errors
    });

    // Check if authentication was successful
    if (result?.error) {
      throw new Error(result.error);
    }

    // If successful but no redirect occurred, return the result
    return {
      success: true,
      data: result
    };

  } catch (error) {
    console.error(`${provider} sign-in error:`, error);
    return {
      success: false,
      error: error.message || `Failed to sign in with ${provider}`
    };
  }
};
