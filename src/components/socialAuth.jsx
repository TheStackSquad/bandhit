// src/components/SocialAuth.jsx
import { useState, useEffect } from 'react';
import { showSuccess, showError } from '../utils/alertManager';

const SocialAuth = ({ onAuthSuccess }) => {
  const [availableAccounts, setAvailableAccounts] = useState([]);

  useEffect(() => {
    loadSocialSDKs();
    detectSavedAccounts();
  }, []);

  const loadSocialSDKs = () => {
    // Load Google SDK
    const googleScript = document.createElement('script');
    googleScript.src = 'https://accounts.google.com/gsi/client';
    googleScript.async = true;
    document.body.appendChild(googleScript);

    // Load Facebook SDK
    const fbScript = document.createElement('script');
    fbScript.src = 'https://connect.facebook.net/en_US/sdk.js';
    fbScript.async = true;
    document.body.appendChild(fbScript);

    window.fbAsyncInit = function() {
      FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
    };
  };

  const detectSavedAccounts = async () => {
    const detected = [];

    // Check for saved Google accounts
    if (window.google?.accounts) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn
      });

      // This will show the Google One Tap prompt if accounts are available
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Handle case when no Google accounts are available
        } else {
          detected.push('google');
        }
      });
    }

    // Check for Facebook login status
    if (window.FB) {
      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          detected.push('facebook');
        }
      });
    }

    setAvailableAccounts(detected);
  };

  const handleGoogleSignIn = async (response) => {
    try {
      // Send the token to your backend
      const result = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: response.credential,
          // Additional required fields
          isAdult: true, // This should be collected separately
          referralSource: 'google'
        })
      });

      const data = await result.json();
      
      if (data.success) {
        showSuccess('Successfully signed in with Google');
        onAuthSuccess(data.user);
      } else {
        showError(data.message);
      }
    } catch (error) {
      showError('Failed to authenticate with Google');
    }
  };

  return (
    <div className="space-y-4">
      {availableAccounts.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-blue-800">
            Available accounts found
          </h3>
          <ul className="mt-2 text-sm text-blue-700">
            {availableAccounts.map(account => (
              <li key={account} className="flex items-center">
                <span className="mr-2">• {account}</span>
                <button
                  onClick={() => handleQuickSignIn(account)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Quick sign in
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Regular social login buttons */}
      {/* ... existing social buttons ... */}
    </div>
  );
};

export default SocialAuth;