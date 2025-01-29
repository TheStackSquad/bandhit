//src/components/UI/dashboard.jsx
"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useSelector } from "react-redux";
import { Camera } from "lucide-react";
import Image from "next/image";
import dashboardValidationSchema from "@/schemas/validationSchema/dashboardSchema";

import {
  getCoverImageContainerClass,
  getProfileImageContainerClass,
  useSubmitForm,
  useProfileImage,
} from "@/utils/dashboardUtils";

const DashboardUI = () => {
  const user = useSelector((state) => state.auth.user);
  // console.log('user state:', user);
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileUploadStatus, setProfileUploadStatus] = useState("idle");
  const [coverUploadStatus, setCoverUploadStatus] = useState("idle");
  
  const [imageError, setImageError] = useState(false);

    // Function to handle image load errors
    const handleImageError = () => {
      setImageError(true);
    };

    const handleImageLoad = () => {
      setImageError(false);
    };
  
    // default image path
    const defaultImagePath = '/uploads/dashboardDefault/drgnimages.jpeg';

  const authData = localStorage.getItem("auth");
  const auth = authData ? JSON.parse(authData) : null;
  const token = auth?.accessToken; // Directly access the token

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* User Profile Section */}
   
      <div className="relative container mx-auto mb-8 flex items-center gap-4">
    
    
      <div className={getProfileImageContainerClass(profileUploadStatus)}>
          <Image
            src={!imageError && user?.profileImage?.url ? user.profileImage.url : defaultImagePath}
            alt={`Profile picture of ${user?.name || 'User'}`}
            width={64}
            height={64}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
            className="object-cover w-16 h-16 rounded-full"
            onError={handleImageError}
            onLoad={handleImageLoad}
            priority // Prioritize loading for above-the-fold image
          />
        </div>


        <label
          htmlFor="profileImageUpload"
          className="absolute bottom-0 left-0 bg-blue-500 rounded-full p-1 cursor-pointer hover:bg-blue-600"
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
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome, {user?.name || "User"}
        </h2>
      </div>

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
              width={400}
              height={256}
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
                    <Field
                      name="price"
                      placeholder="₦0.00"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-0"
                    />
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
