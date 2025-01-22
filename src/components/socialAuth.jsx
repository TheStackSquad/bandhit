import { useState, useEffect, useCallback } from 'react';
import { showSuccess, showError } from '@/utils/alertManager';

const SocialAuth = ({ onAuthSuccess }) => {
  const [availableAccounts, setAvailableAccounts] = useState([]);

  // Handle Google sign-in
  const handleGoogleSignIn = useCallback(async (response) => {
    if (!response?.credential) return;

    try {
      const result = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: response.credential,
          isAdult: true,
          referralSource: 'google',
        }),
      });

      const data = await result.json();
      if (data.success) {
        showSuccess('Successfully signed in with Google');
        onAuthSuccess(data.user);
      } else {
        showError(data.message);
      }
    } catch (err) {
      console.error('social auth error:', err);
      showError('Failed to authenticate with Google');
    }
  }, [onAuthSuccess]); // Add onAuthSuccess as a dependency

  // Load social SDKs
  const loadSocialSDKs = useCallback(() => {
    const sdkScripts = [
      { src: 'https://accounts.google.com/gsi/client', id: 'googleScript' },
      { src: 'https://connect.facebook.net/en_US/sdk.js', id: 'fbScript' },
      { src: 'https://platform.linkedin.com/in.js', id: 'linkedinScript' },
      { src: 'https://platform.twitter.com/widgets.js', id: 'twitterScript' },
    ];

    sdkScripts.forEach(({ src, id }) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.id = id;
      document.body.appendChild(script);
    });

    // Initialize Facebook SDK
    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0',
      });
    };
  }, []);

  // Detect saved accounts
  const detectSavedAccounts = useCallback(async () => {
    const detected = [];

    if (window.google?.accounts) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
      });

      window.google.accounts.id.prompt((notification) => {
        if (!notification.isNotDisplayed() && !notification.isSkippedMoment()) {
          detected.push('google');
        }
      });
    }

    if (window.FB) {
      window.FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
          detected.push('facebook');
        }
      });
    }

    if (window.IN) {
      window.IN.User.isAuthorized(() => {
        detected.push('linkedin');
      });
    }

    if (window.twttr) {
      window.twttr.ready(() => {
        window.twttr.events.bind('authComplete', () => {
          detected.push('twitter');
        });
      });
    }

    setAvailableAccounts(detected);
  }, [handleGoogleSignIn]);

  useEffect(() => {
    loadSocialSDKs();
    detectSavedAccounts();
  }, [loadSocialSDKs, detectSavedAccounts]);

  // Handle Facebook sign-in
  const handleFacebookSignIn = useCallback(() => {
    window.FB?.login((response) => {
      if (response.authResponse) {
        showSuccess('Successfully signed in with Facebook');
        onAuthSuccess(response.authResponse);
      } else {
        showError('Failed to authenticate with Facebook');
      }
    });
  }, [onAuthSuccess]);

  // Handle LinkedIn sign-in
  const handleLinkedInSignIn = useCallback(() => {
    window.IN?.User.authorize(() => {
      showSuccess('Successfully signed in with LinkedIn');
      onAuthSuccess();
    });
  }, [onAuthSuccess]);

  // Handle Twitter sign-in
  const handleTwitterSignIn = useCallback(() => {
    window.twttr?.connect()
      .then(() => {
        showSuccess('Successfully signed in with Twitter');
        onAuthSuccess();
      })
      .catch(() => {
        showError('Failed to authenticate with Twitter');
      });
  }, [onAuthSuccess]);

  // Quick sign-in handler
  const handleQuickSignIn = useCallback((account) => {
    showSuccess(`Quick sign in with ${account}`);
  }, []);

  return (
    <div className="space-y-4">
      {availableAccounts.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-blue-800">Available accounts found</h3>
          <ul className="mt-2 text-sm text-blue-700">
            {availableAccounts.map((account) => (
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

      <div>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
        <button onClick={handleFacebookSignIn}>Sign in with Facebook</button>
        <button onClick={handleLinkedInSignIn}>Sign in with LinkedIn</button>
        <button onClick={handleTwitterSignIn}>Sign in with Twitter</button>
      </div>
    </div>
  );
};

export default SocialAuth;