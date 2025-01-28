// src/components/UI/signupComponent/RegularSignUpForm.jsx
'use client';

import React, {useState } from 'react';
import { useFormik } from 'formik';
import Link from "next/link";
import { signUpSchema } from '@/schemas/validationSchema/userSchema';
import { signUp } from '@/API/signup';
import { showSuccess, showError } from '@/utils/alertManager';
import { useRouter } from 'next/navigation';
import FormFields from './FormFields';
import PasswordStrength from './PasswordStrength';
import ReferralSourceSelect from './ReferralSourceSelect';
import AgeVerificationSwitch from './AgeVerificationSwitch';

const RegularSignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      city: "",
      referralSource: "",
      isAdult: false,
      password: "",
      confirmPassword: "",
    },
    validationSchema: signUpSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        const response = await signUp(values);
        showSuccess(response.message); // Show success message
        resetForm(); // Clear the form fields
        router.push("/signin"); // Redirect to another page
      } catch (error) {
        showError(error.response?.data?.message || "Signup failed");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 mt-3">
      <FormFields
        values={formik.values}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
        errors={formik.errors}
        touched={formik.touched}
      />
      <PasswordStrength password={formik.values.password} />
      <ReferralSourceSelect
        values={formik.values}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
        errors={formik.errors}
        touched={formik.touched}
      />
      <AgeVerificationSwitch
        values={formik.values}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
        errors={formik.errors}
        touched={formik.touched}
      />
      <button
        type="submit"
        disabled={!formik.isValid || isLoading}
        className={`w-full p-3 rounded-lg text-white font-bold transition-all duration-300 ${formik.isValid && !isLoading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        {isLoading ? 'Signing Up...' : 'Create Account'}
      </button>

      <span className="mt-5 mb-3
      flex items-center
      justify-center
      text-sm
      text-gray-600">
            Already have an account? {" "}
            <Link
              href="/signin"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Sign In
            </Link>
          </span>
    </form>
  );
};

export default RegularSignUpForm;
