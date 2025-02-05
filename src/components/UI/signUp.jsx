// src/components/UI/signup/SignUp.jsx
'use client';
import React from 'react';
import RegularSignUpForm from '@/components/UI/signupComponent/RegularSignupForm';
import SocialSignUpForm from '@/components/UI/signupComponent/SocialSignUpForm';

const SignUp = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-white p-2">
      <div className="w-full md:w-[80%] max-w-lg shadow-2xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Account</h1>
        <SocialSignUpForm /> {/* Render the social sign-up buttons */}
        <RegularSignUpForm /> {/* Render the regular sign-up form */}
      </div>
    </div>
  );
};

export default SignUp;
