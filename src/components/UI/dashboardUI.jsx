//src/components/UI/dashboard.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form, Field } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/reduxStore/actions/authActions';
import dashboardValidationSchema from "@/schemas/validationSchema/dashboardSchema";
import ValidationModal from '@/components/modal/validationModal';

import {
  getCoverImageContainerClass,
  getProfileImageContainerClass,
  useSubmitForm,
  useProfileImage,
} from "@/utils/dashboardUtils";

const DashboardUI = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
   const router = useRouter();
  // console.log('user state:', user);
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileUploadStatus, setProfileUploadStatus] = useState("idle");
  const [coverUploadStatus, setCoverUploadStatus] = useState("idle");
  //eslint-disable-next-line
  const [imageError, setImageError] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [modalState, setModalState] = useState({
    show: false,
    type: 'success',
    message: ''
  });

//  const [imageError, setImageError] = useState(false);

  const [token, setToken] = useState(null);
  // Function to handle image load errors
  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  // default image path
  const defaultImagePath = "/uploads/dashboardDefault/drgnimages.jpeg";



  // Custom hooks with proper dependencies
  //eslint-disable-next-line
  const { isSubmitting, submitForm } = useSubmitForm(
    selectedImage,
    token,
    setCoverUploadStatus
  );
  //eslint-disable-next-line
  const { profileImage, uploadProfileImage } = useProfileImage(
    token,
    setProfileUploadStatus
  );

  // Initial form values
  const initialValues = {
    eventName: "",
    time: "",
    date: "",
    price: "",
    venue: "",
    capacity: "",
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Handle profile image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadProfileImage(file);
    }
  };


  // Handle modal closing and navigation
  const handleModalClose = useCallback(() => {
    setModalState(prev => ({ ...prev, show: false }));
    
    // Only navigate on successful logout
    if (modalState.type === 'success') {
      router.push('/events');
    }
  }, [router, modalState.type]);

  // Clear all local storage items
  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem('auth');
      localStorage.removeItem('persist:auth');
      localStorage.removeItem('persist:cart');
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }, []);

  // Main logout handler
  const handleLogoutClick = async () => {
    // Prevent multiple logout attempts
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      // First try to clear localStorage
      const storageCleared = clearLocalStorage();
      if (!storageCleared) {
        throw new Error('Failed to clear local storage');
      }

      // Then dispatch logout action to Redux
      const logoutResult = await dispatch(logoutAction());
      
      // Check if logout was successful (adjust condition based on your Redux action)
      if (!logoutResult) {
        throw new Error('Logout action failed');
      }

      // Show success modal
      setModalState({
        show: true,
        type: 'success',
        message: 'You have successfully logged out of your account'
      });

    } catch (error) {
      console.error('Logout failed:', error);
      
      // Show error modal
      setModalState({
        show: true,
        type: 'error',
        message: 'Failed to logout. Check your network settings and try again.'
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Auto-close success modal after delay
  useEffect(() => {
    if (modalState.show && modalState.type === 'success') {
      const timer = setTimeout(() => {
        handleModalClose();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [modalState.show, modalState.type, handleModalClose]);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const authData = localStorage.getItem("auth");
      const auth = authData ? JSON.parse(authData) : null;
      setToken(auth?.accessToken);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* User Profile Section */}
      <>
      <div className="container mx-auto mb-8 px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          {/* Left Section: Profile Image and Welcome Message */}
          <div className="flex items-center gap-4 relative w-full sm:w-auto">
            {/* Profile Image Container with Camera Icon */}
            <div className="relative">
              <div className={getProfileImageContainerClass(profileUploadStatus)}>
                <Image
                  src={
                    user?.profileImage?.url && !user.imageError
                      ? user.profileImage.url
                      : defaultImagePath
                  }
                  alt={`Profile picture of ${user?.name || 'User'}`}
                  width={64}
                  height={64}
                  style={{
                    maxWidth: '100%',
                    height: '100%',
                  }}
                  className="object-cover w-16 h-16 rounded-full"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  priority
                />
              </div>
              <label
                htmlFor="profileImageUpload"
                className="absolute -right-2 bottom-0 bg-blue-500 rounded-full p-1 cursor-pointer hover:bg-blue-600 transition-colors"
              >
                <Camera size={16} className="text-white" />
              </label>
              <input
                type="file"
                id="profileImageUpload"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
            </div>
            
            {/* Welcome Message */}
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome, {user?.name || 'User'}
            </h2>
          </div>

          {/* Right Section: Logout Button */}
          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className={`${
              isLoggingOut ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
            } text-white px-4 py-2 rounded transition-colors w-full sm:w-auto`}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Logout Success Modal */}
       <ValidationModal
        isOpen={modalState.show}
        type={modalState.type}
        message={modalState.message}
        onClose={handleModalClose}
      />
    </>

      {/* Main Content */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md relative">
  <input
    type="file"
    accept="image/*"
    className="hidden"
    id="imageUpload"
    onChange={handleImageChange}
  />
  <label
    htmlFor="imageUpload"
    className="absolute top-4 right-4 cursor-pointer text-blue-500 hover:text-blue-700"
  >
    <Camera />
  </label>
  {selectedImage ? (
    <Image
      src={URL.createObjectURL(selectedImage)}
      alt="Selected Event"
      fill
      className="object-cover rounded-lg w-full h-64"
      unoptimized
    />
  ) : (
    <div className={getCoverImageContainerClass(coverUploadStatus)}>
      No Image Selected
    </div>
  )}
</div>

        {/* Event Creation Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={dashboardValidationSchema}
          onSubmit={submitForm}
        >
          {({ errors, touched }) => (
            <Form className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="eventName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Name
                  </label>
                  <Field
                    name="eventName"
                    placeholder="Enter event name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-0"
                  />
                  {errors.eventName && touched.eventName && (
                    <div className="text-red-500 text-sm">
                      {errors.eventName}
                    </div>
                  )}
                </div>

                {/* Short entry fields */}
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Time
                    </label>
                    <Field
                      name="time"
                      type="time"
                      placeholder="HH:MM"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-0"
                    />
                    {errors.time && touched.time && (
                      <div className="text-red-500 text-sm">{errors.time}</div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date
                    </label>
                    <Field
                      name="date"
                      type="date"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-0"
                    />
                    {errors.date && touched.date && (
                      <div className="text-red-500 text-sm">{errors.date}</div>
                    )}
                  </div>

                  <div>
  <label
    htmlFor="price"
    className="block text-sm font-medium text-gray-700"
  >
    Price
  </label>
  <div className="relative mt-1">
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
    <Field
      name="price"
      placeholder="0.00"
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-0 pl-7"
    />
  </div>
  {errors.price && touched.price && (
    <div className="text-red-500 text-sm">{errors.price}</div>
  )}
</div>
                 
                </div>

                <div>
                  <label
                    htmlFor="venue"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Venue
                  </label>
                  <Field
                    name="venue"
                    placeholder="Enter event venue"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-0"
                  />
                  {errors.venue && touched.venue && (
                    <div className="text-red-500 text-sm">{errors.venue}</div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="capacity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Capacity
                  </label>
                  <Field
                    name="capacity"
                    placeholder="Enter venue capacity"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-0"
                  />
                  {errors.capacity && touched.capacity && (
                    <div className="text-red-500 text-sm">
                      {errors.capacity}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              >
                Create Event
              </button>
            </Form>
          )}
        </Formik>

        {/* Sales Tracking Section */}
        <div className="col-span-full bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Sales Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Total Ticket Sales",
                value: "256",
                bgGradient: "from-blue-50 to-blue-100",
                textColor: "text-blue-600",
              },
              {
                title: "Total Revenue",
                value: "₦256,000",
                bgGradient: "from-green-50 to-green-100",
                textColor: "text-green-600",
              },
              {
                title: "App Commission",
                value: "₦25,600",
                bgGradient: "from-purple-50 to-purple-100",
                textColor: "text-purple-600",
              },
            ].map(({ title, value, bgGradient, textColor }) => (
              <div
                key={title}
                className={`bg-gradient-to-br ${bgGradient} p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/50`}
              >
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  {title}
                </h3>
                <p className={`text-3xl font-bold ${textColor}`}>
                  {value.includes("₦") ? (
                    <>
                      <span className="text-green-500">₦</span>
                      {value.substring(1)}
                    </>
                  ) : (
                    value
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;
