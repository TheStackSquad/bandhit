"use client";
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Calendar, DollarSign, CheckCircle, Clock } from "lucide-react";
import { mockVendorProfile } from "@/components/data/bookingData";

export default function BookingPage() {
  const vendorProfile = mockVendorProfile;

  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const bookingPayload = {
        vendorId: vendorProfile.id,
        service: selectedService,
        date: bookingDate,
        time: bookingTime,
      };

      // API call to create booking
      await fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(bookingPayload),
      });
    } catch (error) {
      console.error("Booking failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Book {vendorProfile.name}</h2>

      <form onSubmit={handleBookingSubmit} className="space-y-4">
        {/* Service Selection */}
        <div>
          <label htmlFor="service-select" className="block mb-2">
            Select Service
          </label>
          <select
            id="service-select"
            value={selectedService || ""}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Choose a Service</option>
            {vendorProfile.services?.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div className="flex items-center space-x-2">
          <Calendar className="text-gray-500" />
          <input
            type="date"
            value={bookingDate || ""}
            onChange={(e) => setBookingDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Time Selection */}
        <div className="flex items-center space-x-2">
          <Clock className="text-gray-500" />
          <input
            type="time"
            value={bookingTime || ""}
            onChange={(e) => setBookingTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Pricing */}
        <div className="flex items-center space-x-2 text-green-600">
          <DollarSign />
          <span>Base Price: ${vendorProfile.basePrice || "N/A"}</span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 flex items-center justify-center"
        >
          {isSubmitting ? "Submitting..." : "Book Now"}
          <CheckCircle className="ml-2" />
        </button>
      </form>
    </div>
  );
}
