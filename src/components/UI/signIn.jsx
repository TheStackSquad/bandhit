// src/components/UI/signIn.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signIn } from '@/reduxStore/actions/authActions';
import { Mail, Lock } from 'lucide-react';
import { showSuccess, showError } from '@/utils/alertManager';
import Link from 'next/link';

const SignIn = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(signIn(data.user));
        showSuccess('Successfully signed in!');
      } else {
        showError(data.message || 'Sign in failed');
      }
    } catch (error) {
      console.error('error occured in signin:', error);
      showError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="group relative">
              <div className="absolute left-3 top-1/2 -mt-2.5 text-gray-400">
                <Mail size={20} />
              </div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg w-full py-3 pl-10 pr-3 border border-gray-300 
                         placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent transition-all duration-300
                         hover:border-blue-300"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="group relative">
              <div className="absolute left-3 top-1/2 -mt-2.5 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg w-full py-3 pl-10 pr-3 border border-gray-300 
                         placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent transition-all duration-300
                         hover:border-blue-300"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent 
                     text-sm font-medium rounded-md text-white 
                     ${isFormValid && !isLoading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'} 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                     transition-all duration-300`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <span className="mt-4 text-sm text-gray-600">
   Dont have an account? No worries{" "}
  <Link 
    href="/signup" 
    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
  >
    Sign Up
  </Link>
</span>
        </form>
      </div>
    </div>
  );
};

export default SignIn;