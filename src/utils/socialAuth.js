// src/utils/socialAuth.js
import { signIn } from 'next-auth/react';

export const socialSignUp = async (provider) => {
  try {
    const result = await signIn(provider, {
      callbackUrl: process.env.NEXT_PUBLIC_URL,
      redirect: false,
    });

    if (result?.error) {
      return {
        success: false,
        message: `Failed to sign in with ${provider}: ${result.error}`,
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(`Error during ${provider} sign-in:`, error);
    return {
      success: false,
      message: `Authentication failed with ${provider}`,
    };
  }
};

export const checkSavedAccounts = async () => {
  try {
    // Check localStorage for any saved social login tokens
    const savedAccounts = JSON.parse(localStorage.getItem('socialAccounts') || '[]');
    
    // Verify tokens are still valid
    const validAccounts = await Promise.all(
      savedAccounts.map(async (account) => {
        try {
          const response = await fetch(`/api/auth/verify-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              provider: account.provider,
              token: account.token,
            }),
          });

          if (response.ok) {
            return account;
          }
          return null;
        } catch (error) {
          console.error(`Error verifying ${account.provider} token:`, error);
          return null;
        }
      })
    );

    // Filter out invalid accounts
    const filteredAccounts = validAccounts.filter(Boolean);
    
    // Update localStorage with only valid accounts
    localStorage.setItem('socialAccounts', JSON.stringify(filteredAccounts));
    
    return filteredAccounts;
  } catch (error) {
    console.error('Error checking saved accounts:', error);
    return [];
  }
};