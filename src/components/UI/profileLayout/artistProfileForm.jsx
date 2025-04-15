// src/components/UI/artistLayout/ArtistProfileForm.jsx

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import { uploadArtistCoverImage } from '@/utils/profileUtils/artistUtils';
import { showError, showSuccess } from '@/lib/alertManager';
import { artistValidation } from '@/utils/profileUtils/vendorValidation';
import { useDispatch } from 'react-redux';
import { updateArtistProfile } from '@/reduxStore/actions/authActions';
import Image from 'next/image';



// Cover Image Component
const CoverImageUpload = ({ setFieldValue, coverImageUrl }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(coverImageUrl || '');
  const fileInputRef = useRef(null);
  const { values } = useFormikContext();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      //    console.log('Uploading new cover image...');

      // Fetch previous image ID from Formik values 
      // //eslint-disable-next-line
      const previousImageId = values.cover_image_public_id || null;

      // Upload new image (automatically deletes previous one if exists)
      const result = await uploadArtistCoverImage(file, previousImageId);

      if (result && result.secure_url) {
        //    console.log('Cover image uploaded successfully:', result);

        // Update form state with new image data
        setPreviewUrl(result.secure_url);
        setFieldValue('cover_image_url', result.secure_url);
        setFieldValue('cover_image_public_id', result.public_id);

        showSuccess('Cover image uploaded successfully');
      } else {
        console.warn('Upload returned an unexpected result:', result);
      }
    } catch (error) {
      console.error('Failed to upload cover image:', error);
      showError('Failed to upload cover image');
    } finally {
      setIsUploading(false);
    }
  };



  return (
    <div className="relative w-full h-48 md:h-64 bg-gray-100 rounded-t-lg overflow-hidden">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />

      {previewUrl ? (
        <Image
          src={previewUrl}
          alt="Artist Cover"
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

const CategorySelector = ({ values, setFieldValue }) => {
  const categories = [
    { value: 'musician', label: 'Musician' },
    { value: 'dj', label: 'DJ' },
    { value: 'comedian', label: 'Comedian' },
    { value: 'magician', label: 'Magician' },
    { value: 'speaker', label: 'Speaker' },
    { value: 'dancer', label: 'Dancer' },
    { value: 'actor', label: 'Actor' },
    { value: 'other', label: 'Other' }
  ];

  // Function to toggle category selection
  const handleCategoryToggle = (categoryValue) => {
    const updatedCategories = values.art_forms.includes(categoryValue)
      ? values.art_forms.filter(value => value !== categoryValue) // Remove if exists
      : [...values.art_forms, categoryValue]; // Add if not exists

    setFieldValue('art_forms', updatedCategories);
  };

  return (
    <div className="mb-6">
      <label htmlFor="art_forms" className="block text-gray-700 text-sm font-semibold mb-2">
        Art Form
      </label>

      {/* Hidden input field to store selected categories */}
      <input
        type="text"
        id="art_forms"
        name="art_forms"
        value={values.art_forms.join(', ')} // Show as comma-separated values
        readOnly
        style={{ display: 'none' }}
      />

      {/* Category Selection Buttons */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.value} // Corrected key
            type="button"
            onClick={() => handleCategoryToggle(category.value)} // Corrected reference
            className={`px-3 py-1 rounded-full text-sm ${values.art_forms.includes(category.value)
              ? 'bg-indigo-600 text-white' // Selected state
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Default state
              }`}
          >
            {category.label} {/* Corrected to label */}
          </button>
        ))}
      </div>

      {/* Error message for validation */}
      <ErrorMessage name="art_forms" component="p" className="mt-1 text-red-500 text-xs" />
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
const ArtistProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();

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
    artist_name: '',
    art_forms: [],
    address: '',
    bio: '',
    phone: '',
    twitter: '',
    facebook: '',
    instagram: '',
    cover_image_url: null,
    cover_image_public_id: null,
  };


  const artistProfileSubmit = async (values, { setSubmitting, resetForm }) => { // Add resetForm
    if (!userId) {
      showError('User authentication failed');
      setSubmitting(false);
      return;
    }

    try {
      setLoading(true);

      // Construct payload ensuring DB schema consistency
      const payload = {
        ...values,
        user_id: userId,
        art_forms: Array.isArray(values.art_forms) ? values.art_forms : [],
        cover_image_url: values.cover_image_url || null,
        cover_image_public_id: values.cover_image_public_id || null,
      };

      // Dispatch the Redux action instead of direct API call
      const response = await dispatch(updateArtistProfile(payload));

      if (response?.success) {
        showSuccess('Profile updated successfully');
        resetForm(); // Reset the form here
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

    <div className="w-100 mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <Formik
        initialValues={initialValues}
        validationSchema={artistValidation}
        onSubmit={artistProfileSubmit}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form className="w-full">
            {/* Cover Image Section */}
            <CoverImageUpload
              setFieldValue={setFieldValue}
              coverImageUrl={values.cover_image_url}
            />

            {/* Form Fields */}
            <div className="p-6 w-full">
              <div className="mb-6">
                <label htmlFor="artist_name"
                  className="block text-gray-700 text-sm
                font-semibold mb-2">
                  Artist Name
                </label>
                <div className="flex flex-wrap gap-2">


                  <Field
                    type="text"
                    id="artist_name"
                    name="artist_name"
                    className={`w-full px-3 py-2
                    border ${errors.artist_name && touched.artist_name ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Stage Name"
                  />
                </div>
                <ErrorMessage name="artist_name" component="p" className="mt-1 text-red-500 text-xs" />
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
                  Official Phone
                </label>
                <Field
                  type="text"
                  id="phone"
                  name="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Phone Number"
                />
                <ErrorMessage name="phone" component="p" className="mt-1 text-red-500 text-xs" />
              </div>

              <div className="mb-6">
                <label htmlFor="bio" className="block text-gray-700 text-sm font-semibold mb-2">
                  Bio
                </label>
                <Field
                  as="textarea"
                  id="bio"
                  name="bio"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Bio..."
                />
                <ErrorMessage name="bio" component="p" className="mt-1 text-red-500 text-xs" />
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
        )}
      </Formik>
    </div>
  );
};

export default ArtistProfileForm;