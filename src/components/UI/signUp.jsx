//src/components/UI/signUp.jsx

'use client';
import { useFormik } from 'formik';
import { signUpSchema } from '@/schemas/validationSchema/userSchema';
import { showSuccess, showError } from '@/utils/alertManager';
import { novaFlat, josefin } from '@/app/fonts';
import { Eye, EyeOff, Facebook, Mail, Linkedin, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { calculatePasswordStrength, getPasswordStrengthColor } from '@/utils/passwordUtils';
import { socialSignUp, checkSavedAccounts } from '@/utils/socialAuth';
import Link from 'next/link';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  //eslint-disbale-next-line
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        if (response.ok) {
          showSuccess('Sign up successful!');
        } else {
          const error = await response.json();
          showError(error.message || 'Sign up failed');
        }
      } catch (error) {
        showError('An error occurred during sign up');
      }
    },
  });

  useEffect(() => {
    checkSavedAccounts();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
        <h2 className={`${novaFlat.variable} text-3xl font-bold text-center mb-8 text-gray-900`}>
          Sign Up for Bandhit
        </h2>
        <div className="space-y-3 mb-8">
          <h3 className={`${josefin.variable} text-center text-sm font-medium text-gray-700 mb-4`}>
            Sign up with
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => socialSignUp('google')}
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Mail className="h-5 w-5 text-red-500 mr-2" />
              Google
            </button>
            <button
              type="button"
              onClick={() => socialSignUp('facebook')}
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Facebook className="h-5 w-5 text-blue-600 mr-2" />
              Facebook
            </button>
            <button
              type="button"
              onClick={() => socialSignUp('linkedin')}
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Linkedin className="h-5 w-5 text-blue-700 mr-2" />
              LinkedIn
            </button>
            <button
              type="button"
              onClick={() => socialSignUp('twitter')}
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Twitter className="h-5 w-5 text-blue-700 mr-2" />
              Twitter
            </button>
          </div>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Add other form fields */}
          <div>
            <label className={`${josefin.variable} block text-sm font-medium text-gray-700`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              <span className="mt-4 text-sm text-gray-600">
  Already have an account?{" "}
  <Link 
    href="/signin" 
    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
  >
    Sign in
  </Link>
</span>
            </div>
            {formik.values.password && (
              <div className="mt-2">
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor(
                      calculatePasswordStrength(formik.values.password)
                    )}`}
                    style={{
                      width: `${(calculatePasswordStrength(formik.values.password) / 5) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
