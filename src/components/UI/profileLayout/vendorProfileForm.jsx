// src/components/UI/profileLayout/VendorProfileForm.jsx

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { uploadVendorCoverImage, submitVendorProfile } from '@/utils/profileUtils/vendorUtils';
import { showError, showSuccess } from '@/lib/alertManager';
import { vendorValidation } from '@/utils/profileUtils/vendorValidation';
import Image from 'next/image';



// Cover Image Component
const CoverImageUpload = ({ setFieldValue, coverImageUrl, formValues }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(coverImageUrl || '');
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Get the previous image ID (if any) from formValues prop
      const previousImageId = formValues?.cover_image_public_id || null;

      const result = await uploadVendorCoverImage(file, previousImageId);

      if (result && result.secure_url) {
        setPreviewUrl(result.secure_url);
        setFieldValue('cover_image_url', result.secure_url);
        setFieldValue('cover_image_public_id', result.public_id);
        showSuccess('Cover image uploaded successfully');
      }
    } catch (error) {
      showError('Failed to upload cover image');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-full h-48 md:h-64 bg-white rounded-t-lg overflow-hidden">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {previewUrl ? (
        <Image
          src={previewUrl}
          alt="Business Cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-200">
          <p className="text-gray-500">Add a cover image for your business</p>
        </div>
      )}

      <div className="absolute bottom-4 right-4">
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="px-4 py-2 bg-white text-indigo-600 rounded-md shadow-md hover:bg-indigo-50 transition-colors disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : previewUrl ? 'Change Cover' : 'Add Cover'}
        </button>
      </div>
    </div>
  );
};

// Cover Image Component
const CategorySelector = ({ values, setFieldValue }) => {
  const categories = [
    { id: 'catering', name: 'Catering' },
    { id: 'venue', name: 'Venue' },
    { id: 'equipment', name: 'Equipment Rental' },
    { id: 'photography', name: 'Photography' },
    { id: 'videography', name: 'Videography' },

    { id: 'entertainment', name: 'Entertainment' },
    { id: 'planning', name: 'Event Planning' },

  ];

  const handleCategoryToggle = (categoryId) => {
    const updatedCategories = values.business_categories.includes(categoryId)
      ? values.business_categories.filter(id => id !== categoryId)
      : [...values.business_categories, categoryId];

    setFieldValue('business_categories', updatedCategories);
  };

  return (
    <div className="mb-6">
      <label htmlFor="business_categories" className="block text-gray-700 text-sm font-semibold mb-2">
        Business Categories
      </label>
      <input
        type="text"
        id="business_categories"
        name="business_categories"
        value={values.business_categories}
        readOnly
        style={{ display: 'none' }}
      />
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            type="button"
            onClick={() => handleCategoryToggle(category.id)}
            className={`px-3 py-1 rounded-full text-sm ${values.business_categories.includes(category.id)
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <ErrorMessage name="business_categories" component="p" className="mt-1 text-red-500 text-xs" />
    </div>
  );
};

// Social Media Input Component
const SocialMediaInput = ({ fieldName, placeholder, iconType }) => {
  // Define SVG icons inline
  const icons = {
    twitter: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
      </svg>
    ),
    facebook: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    ),
    instagram: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  };

  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {icons[iconType]}
      </div>
      <Field
        type="text"
        name={fieldName}
        placeholder={placeholder}
        className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      />
      <ErrorMessage name={fieldName} component="p" className="mt-1 text-red-500 text-xs" />
    </div>
  );
};

// Main Vendor Profile Form Component
const VendorProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    try {
      // Check if localStorage is available (prevents errors in SSR or when disabled)
      if (typeof window !== 'undefined' && window.localStorage) {
        const authDataString = localStorage.getItem('persist:auth');

        // Check if auth data exists
        if (!authDataString) {
          console.warn('No authentication data found in localStorage');
          return;
        }

        // Safely parse the auth data
        let authData;
        try {
          authData = JSON.parse(authDataString);
        } catch (parseError) {
          console.error('Failed to parse auth data:', parseError);
          showError('Authentication data corrupted');
          return;
        }

        // Check if user data exists and parse it
        if (!authData?.user) {
          console.warn('No user data found in auth object');
          return;
        }

        // Safely parse user data
        let user;
        try {
          user = JSON.parse(authData.user);
        } catch (userParseError) {
          console.error('Failed to parse user data:', userParseError);
          showError('User data corrupted');
          return;
        }

        // Set user ID if available
        if (user?._id) {
          setUserId(user._id);
        } else {
          console.warn('User ID not found in user object');
        }
      }
    } catch (error) {
      console.error('Error retrieving user ID:', error);
      showError('Authentication error');
    }
  }, []);

  const initialValues = {
    business_name: '',
    business_categories: [],
    address: '',
    description: '',
    phone: '',
    twitter: '',
    facebook: '',
    instagram: '',
    cover_image_url: null,
    cover_image_public_id: null,
  };

  const handleSubmit = async (values, { setSubmitting,
    // eslint-disable-next-line
    resetForm }) => {
    if (!userId) {
      showError('User authentication failed');
      setSubmitting(false);
      return;
    }

    try {
      setLoading(true);

      // Ensure image metadata is included
      const payload = {
        ...values,
        cover_image_url: values.cover_image_url || null,
        cover_image_public_id: values.cover_image_public_id || null,
        user_id: userId
      };

      const response = await submitVendorProfile(payload);

      if (response && response.success) {
        showSuccess('Profile updated successfully');
      } else {
        showError(response?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile submission error:', error);
      showError('An error occurred while updating your profile');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };


  return (

    <div className="w- h-full mx-auto rounded-lg shadow-md overflow-hidden">

      <Formik
        initialValues={initialValues}
        validationSchema={vendorValidation}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => {
          return (
            <Form className="w-full">
              {/* Cover Image Section */}
              <CoverImageUpload
                setFieldValue={setFieldValue}
                coverImageUrl={values.cover_image_url}
                formValues={values}
              />

              {/* Form Fields */}
              <div className="p-6 w-full">
                <div className="mb-6">
                  <label htmlFor="business_name"
                    className="block text-gray-700 text-sm font-semibold mb-2">
                    Business Name
                  </label>
                  <div className="flex flex-wrap gap-2">


                    <Field
                      type="text"
                      id="business_name"
                      name="business_name"
                      className={`w-full px-3 py-2 border ${errors.business_name && touched.business_name ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Your Business Name"
                    />
                  </div>
                  <ErrorMessage name="business_name" component="p" className="mt-1 text-red-500 text-xs" />
                </div>

                <CategorySelector values={values} setFieldValue={setFieldValue} />

                <div className="mb-6">
                  <label htmlFor="address" className="block text-gray-700 text-sm font-semibold mb-2">
                    Business Address
                  </label>
                  <Field
                    type="text"
                    id="address"
                    name="address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your Business Address"
                  />
                  <ErrorMessage name="address" component="p" className="mt-1 text-red-500 text-xs" />
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">
                    Business Phone
                  </label>
                  <Field
                    type="text"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your Business Phone Number"
                  />
                  <ErrorMessage name="phone" component="p" className="mt-1 text-red-500 text-xs" />
                </div>

                <div className="mb-6">
                  <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">
                    Business Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Describe your business..."
                  />
                  <ErrorMessage name="description" component="p" className="mt-1 text-red-500 text-xs" />
                </div>

                <div className="mb-6">
                  <h3 className="text-gray-700 font-semibold mb-4">Social Media Profiles</h3>
                  <div className="space-y-4">
                    <SocialMediaInput
                      iconType="twitter"
                      fieldName="twitter"
                      placeholder="Twitter username"
                    />
                    <SocialMediaInput
                      iconType="facebook"
                      fieldName="facebook"
                      placeholder="Facebook page URL"
                    />
                    <SocialMediaInput
                      iconType="instagram"
                      fieldName="instagram"
                      placeholder="Instagram username"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting || loading ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            </Form>
          );
        }}

      </Formik>
    </div>
  );
};

export default VendorProfileForm;