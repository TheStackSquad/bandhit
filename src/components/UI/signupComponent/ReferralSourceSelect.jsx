//src/components/UI/signupComponents/referralSourceSelect.jsx

'use client';
import React from 'react';
import { ListRestart } from 'lucide-react';

const ReferralSourceSelect = ({ 
  values, 
  handleChange, 
  handleBlur, 
  errors, 
  touched 
}) => {
  const referralOptions = [
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'friend', label: 'Friend Referral' },
    { value: 'internet', label: 'Internet Search' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'ads', label: 'Online Ads' }
  ];

  return (
    <div className="mb-4">
      <div className="relative">
        <ListRestart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <select
          id="referralSource"
          name="referralSource"
          value={values.referralSource}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`
            w-full pl-10 p-3 border rounded-md 
            focus:outline-none focus:ring-2 
            ${errors.referralSource && touched.referralSource 
              ? 'border-red-500 focus:ring-red-500' 
              : 'focus:ring-blue-500'
            }
          `}
        >
          <option value="">Select how you heard about us</option>
          {referralOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {errors.referralSource && touched.referralSource && (
        <p className="text-red-500 text-sm mt-1">{errors.referralSource}</p>
      )}
    </div>
  );
};

export default ReferralSourceSelect;