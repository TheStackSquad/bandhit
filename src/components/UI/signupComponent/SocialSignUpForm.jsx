//src/components/UI/signupComponent/SocialSignUpForm.jsx

'use client';
import React from 'react';
import { Facebook, Mail, Loader2 } from 'lucide-react';
import { useSocialAuth } from '@/context/socialAuthContext';

const SOCIAL_BUTTONS = [
  {
    name: 'Facebook',
    provider: 'facebook',
    icon: Facebook,
    bgColor: 'bg-blue-600'
  },
  {
    name: 'Google',
    provider: 'google',
    icon: Mail,
    bgColor: 'bg-red-600'
  },
];

const SocialSignUpForm = () => {
  const { signInWithProvider, loadingProviders, error } = useSocialAuth();

  const handleSocialSignIn = async (provider) => {
    await signInWithProvider(provider);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex flex-col space-y-3">
        {SOCIAL_BUTTONS.map(({ name, provider, icon: Icon, bgColor }) => (
          <button
            key={name}
            onClick={() => handleSocialSignIn(provider)}
            disabled={loadingProviders[provider]}
            className={`${bgColor} text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 disabled:opacity-70`}
          >
            {loadingProviders[provider] ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <Icon className="h-5 w-5" />
            )}
            <span>{`Sign in with ${name}`}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialSignUpForm;