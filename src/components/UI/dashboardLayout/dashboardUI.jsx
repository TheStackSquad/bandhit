//src/components/UI/dashboard.jsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import { useSelector, useDispatch } from "react-redux";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/reduxStore/actions/authActions';
import {
  useSubmitForm,
  useProfileImage,
  useEventImage,
  getProfileImageUrl
} from "@/utils/otherUtils/dashboardUtils";
import dashboardValidationSchema from "@/schemas/validationSchema/dashboardSchema";
import ValidationModal from '@/components/modal/validationModal';
import { clearLocalStorage, handleModalClose } from "@/utils/otherUtils/dashboardUtils";
import  EventMetricDashboard from '@/components/UI/eventLayout/eventsMetrics';
import ReelUI from '@/components/UI/reelLayout/reelUI';
import ToggleableCard from '@/components/modal/toggleableCard';


const DashboardUI = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [modalState, setModalState] = useState({ show: false, type: '', message: '' });
  const fileRef = useRef(null);
  const [formValues, setFormValues] = useState({}); 
  const [formikValues, setFormikValues] = useState({}); 
  const [editingEvent, setEditingEvent] = useState(null);
  const formikRef = useRef(null);

  // Parse user data if it's stored as a string
  const userData = typeof user === 'string' ? JSON.parse(user) : user;

  // Initialize hooks
  const { submitForm, loading: submitLoading } = useSubmitForm();

  const {
    //eslint-disable-next-line
    profileImage,
    handleProfileImageUpload,
    loading: profileLoading
  } = useProfileImage();

  const {
    selectedImage,
    setSelectedImage,
    handleEventImageUpload,
    loading: eventImageLoading
  } = useEventImage();

  const initialValues = {
    eventName: "",
    time: "",
    date: "",
    price: "",
    venue: "",
    capacity: "",
    coverImage: null,
    coverImagePublicId: null,
  };

  // Handler for profile image upload
  const handleProfileImageChange = (file) => {
    //   console.log("Uploading profile image:", file);
    //   console.log("User ID:", userData._id);

    handleProfileImageUpload(file, userData._id); // Pass userData._id
  };

  // Handler for form submission

const handleEventSubmit = async (values, formikBag) => {
 //   console.log("handleEventSubmit triggered with values:", values);

    try {
        // Determine mode and eventId based on current editing state
        const mode = editingEvent ? 'update' : 'create';
        const eventId = editingEvent ? editingEvent.eventId : null;

   //     console.log(`Submission mode: ${mode}`);
     //   console.log(`Event ID: ${eventId || "New Event"}`);
      //  console.log("User ID:", userData._id);

        // console.log("Calling submitForm with parameters:", {
        //     values,
        //     userId: userData._id,
        //     formikBag,
        //     mode,
        //     eventId
        // });

        await submitForm(values, userData._id, formikBag, mode, eventId);

  //      console.log("Form submission successful!");

        // Reset editing state and image-related states
//        console.log("Resetting form states...");
        setEditingEvent(null);
        setSelectedImage(null);

        if (fileRef.current) {
     //       console.log("Clearing file input...");
            fileRef.current.value = "";
        }

  //      console.log("Form reset complete.");
    } catch (error) {
        console.error("Event form submission failed:", error);
    }
};

  
  const handleEditEvent = (editEventPayload) => {
  //  console.log("Editing event payload:", editEventPayload);

    // Set the editing event state
    setEditingEvent({
      mode: editEventPayload.mode,
      eventId: editEventPayload.eventId
    });

    // Update Formik's initial values
    formikRef.current?.setValues(editEventPayload.initialValues);
  };
  // Main logout handler
  const handleLogoutClick = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      // Clear localStorage
      const storageCleared = clearLocalStorage();
      if (!storageCleared) {
        throw new Error("Failed to clear local storage");
      }

      // Dispatch Redux logout action
      dispatch(logoutAction());

      // Show success modal
      setModalState({
        show: true,
        type: "success",
        message: "You have successfully logged out of your account"
      });

      // Navigate to login page after a short delay
      setTimeout(() => {
        window.location.href = '/signup'; // Or use router.push('/login') if using a router
      }, 1500); // Allow time for the success message to be seen

    } catch (error) {
      console.error("Logout failed:", error);
      // Show error modal
      setModalState({
        show: true,
        type: "error",
        message: "Failed to logout. Check your network settings and try again."
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleModalCloseWrapper = useCallback(() => {
    handleModalClose(router, modalState);
    setModalState(prev => ({ ...prev, show: false }));
  }, [router, modalState]);


  // Auto-close success modal after delay
  useEffect(() => {
    if (modalState.show && modalState.type === "success") {
      const timer = setTimeout(handleModalCloseWrapper, 2000);
      return () => clearTimeout(timer);
    }
  }, [modalState.show, modalState.type, handleModalCloseWrapper]);


  // This component's only job is to sync Formik values to external state
  const FormValueSync = ({ setFormikValues }) => {
    const { values } = useFormikContext();

    React.useEffect(() => {
      setFormikValues(values);
    }, [values, setFormikValues]);

    return null; // Doesn't render anything
  };
  
// Update formValues when formikValues change

  useEffect(() => {
    setFormValues(formikValues); 
  }, [formikValues]);



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* User Profile Section */}
      <>
        {/* Container for the entire header with proper spacing */}

        <div className="container mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Left Section: Profile Image and Welcome Message with better alignment */}
            <div className="flex items-center gap-6">
              {/* Profile Image Container with improved positioning */}
              <div className="relative">
                <div className="image-preview">
                  {/* User Profile Image with consistent size */}
                  <Image
                    src={getProfileImageUrl(userData)}
                    alt="Profile Picture"
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-2 border-gray-200"
                    priority
                  />

                  {/* Loading overlay for image upload with improved visibility */}
                  {profileLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full">
                      <span className="text-white text-xs font-medium">Uploading...</span>
                    </div>
                  )}
                </div>

                {/* Camera Icon for Profile Image Upload with better positioning */}
                <label
                  htmlFor="profileImageUpload"
                  className="absolute -right-2 bottom-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors shadow-md"
                  aria-label="Upload profile image"
                >
                  <Camera size={16} className="text-white" />
                </label>
              </div>

              {/* Hidden File Input for Profile Image Upload */}
              <input
                type="file"
                id="profileImageUpload"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleProfileImageChange(e.target.files[0])}
              />

              {/* Welcome Message with improved typography */}
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome, {user?.name || "User"}
              </h2>
            </div>

            {/* Logout Button with improved styling and positioning */}
            <button
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className={`${isLoggingOut ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
                } text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-sm`}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        {/* Logout Success Modal - unchanged but properly commented */}
        <ValidationModal
          isOpen={modalState.show}
          type={modalState.type}
          message={modalState.message}
          onClose={handleModalClose}
        />
      </>

      {/* ===== MAIN CONTENT ===== */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* === EVENT CREATION SECTION === */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={dashboardValidationSchema}
            onSubmit={handleEventSubmit}
          >
            {({ errors, touched, setFieldValue, 
            //eslint-disable-next-line
            values }) => {

              return (
                <Form className="w-full bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {/* Image Upload Section */}
                  <div className="relative mb-6">
                    <div className="h-64 w-full relative">
                      {/* Hidden File Input for Event Cover Image Upload */}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="imageUpload"
                        ref={fileRef}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            handleEventImageUpload(file, setFieldValue);
                          }
                        }}
                      />

                      {/* Camera Icon for Uploading Event Cover Image */}
                      <label
                        htmlFor="imageUpload"
                        className="absolute top-4 right-4 cursor-pointer text-blue-500 hover:text-blue-700 transition-colors"
                        aria-label="Upload event image"
                      >
                        <Camera size={24} />
                      </label>

                      {/* Display Selected Image or Placeholder */}
                      {selectedImage ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={URL.createObjectURL(selectedImage)}
                            alt="Selected Event"
                            fill
                            className="object-cover rounded-lg"
                            unoptimized
                          />
                          {eventImageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
                              <span className="text-white">Uploading...</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                          <p className="text-gray-500">No Image Selected</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <FormValueSync setFormikValues={setFormikValues} />

                  {/* Event Details Form */}
                  <div className="space-y-4">
                    {/* Event Name Field */}
                    <div>
                      <label htmlFor="eventName" className="block text-gray-700 mb-1 font-medium">
                        Event Name
                      </label>
                      <Field
                        type="text"
                        id="eventName"
                        name="eventName"
                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${touched.eventName && errors.eventName ? "border-red-500" : ""
                          }`}
                      />
                      <ErrorMessage name="eventName" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* Short Entry Fields: Date, Time, Price */}
                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="date" className="block text-gray-700 mb-1 font-medium">
                          Date
                        </label>
                        <Field
                          type="date"
                          id="date"
                          name="date"
                          className={`w-full p-2 border rounded focus:outline-none focus:ring-2
                            focus:ring-blue-500 transition-all ${touched.date && errors.date ? "border-red-500" : ""
                            }`}
                        />
                        <ErrorMessage name="date" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="time" className="block text-gray-700 mb-1 font-medium">
                          Time
                        </label>
                        <Field
                          type="time"
                          id="time"
                          name="time"
                          className={`w-full p-2 border rounded focus:outline-none
                            focus:ring-2 focus:ring-blue-500 transition-all ${touched.time && errors.time ? "border-red-500" : ""
                            }`}
                        />
                        <ErrorMessage name="time" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="price" className="block text-gray-700 mb-1 font-medium">
                          Price
                        </label>
                        <Field
                          type="text"
                          id="price"
                          name="price"
                          className={`w-full p-2 border rounded focus:outline-none
                            focus:ring-2 focus:ring-blue-500 transition-all ${touched.price && errors.price ? "border-red-500" : ""
                            }`}
                        />
                        <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>

                    {/* Venue and Capacity Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="venue" className="block text-gray-700 mb-1 font-medium">
                          Venue
                        </label>
                        <Field
                          type="text"
                          id="venue"
                          name="venue"
                          className={`w-full p-2 border rounded focus:outline-none focus:ring-2
                            focus:ring-blue-500 transition-all ${touched.venue && errors.venue ? "border-red-500" : ""
                            }`}
                        />
                        <ErrorMessage name="venue" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="capacity" className="block text-gray-700 mb-1 font-medium">
                          Capacity
                        </label>
                        <Field
                          type="text"
                          id="capacity"
                          name="capacity"
                          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${touched.capacity && errors.capacity ? "border-red-500" : ""
                            }`}
                        />
                        <ErrorMessage name="capacity" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className={`${submitLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                        } text-white px-6 py-3 rounded-lg transition-all w-full`}
                    >
                      {submitLoading ? "Submitting..." : "Create Event"}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>

        {/* === IMAGE PREVIEW SECTION === */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Event Preview</h3>
          <div className="h-96 w-full bg-gray-50 rounded-lg border border-gray-200">
            {/* Display Selected Image or Placeholder */}
            {selectedImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected Event"
                  fill
                  className="object-cover rounded-lg"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-gray-400 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No Image Selected</p>
                <p className="text-gray-400 text-sm mt-1">Upload an image using the form on the left</p>
              </div>
            )}
          </div>

          {/* Event Details Preview */}
          {formValues && Object.keys(formValues).some((key) => formValues[key]) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3">Event Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {formValues.eventName && (
                  <>
                    <div className="text-gray-500">Event:</div>
                    <div className="font-medium">{formValues.eventName}</div>
                  </>
                )}
                {formValues.date && (
                  <>
                    <div className="text-gray-500">Date:</div>
                    <div className="font-medium">{formValues.date}</div>
                  </>
                )}
                {formValues.venue && (
                  <>
                    <div className="text-gray-500">Venue:</div>
                    <div className="font-medium">{formValues.venue}</div>
                  </>
                )}
                {formValues.price && (
                  <>
                    <div className="text-gray-500">Price:</div>
                    <div className="font-medium">₦{formValues.price}</div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sales Tracking Section */}
      <div className="col-span-full bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full">
          {/* Event Metric Dashboard Card */}
          <ToggleableCard
            leftButtonText="View Metrics"
            rightButtonText="Close"
          >
            <EventMetricDashboard onEditEvent={handleEditEvent} />
          </ToggleableCard>

          {/* Video Upload Form Card */}
          <ToggleableCard
            leftButtonText="Upload Reel"
            rightButtonText="Close"
          >
            <ReelUI />
          </ToggleableCard>
        </div>
      </div>

      </div>
    // </div>
  );
};

export default DashboardUI;
