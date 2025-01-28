//src/components/UI/signupComponents/ageVerificationSwitch.jsx

'use client';
import React from 'react';
import { ShieldCheck } from 'lucide-react';

const AgeVerificationSwitch = ({ 
  values, 
  handleChange, 
  handleBlur, 
  errors, 
  touched 
}) => {
  return (
    <div className="mb-4 flex items-center">
      <ShieldCheck className="mr-3 text-gray-500 w-6 h-6" />
      <div className="flex-grow">
        <label 
          htmlFor="isAdult" 
          className="inline-flex items-center cursor-pointer"
        >
          <input
            type="checkbox"
            id="isAdult"
            name="isAdult"
            checked={values.isAdult}
            onChange={handleChange}
            onBlur={handleBlur}
            className="mr-2 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">
            I confirm I am 18 years or older
          </span>
        </label>
      </div>
      {errors.isAdult && touched.isAdult && (
        <p className="text-red-500 text-sm mt-1">{errors.isAdult}</p>
      )}
    </div>
  );
};

export default AgeVerificationSwitch;