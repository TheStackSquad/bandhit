// src/app/welcome/page.jsx
//'use client';

import HeroSection from '@/components/UI/welcomeLayout/heroSection';
import EventShowcase from '@/components/UI/welcomeLayout/eventShowcase';
import AttendeeFeatures from '@/components/UI/welcomeLayout/attendeeFeatures';
import VendorFeatures from '@/components/UI/welcomeLayout/vendorFeatures';
import Footer from '@/components/UI/welcomeLayout/footer';

export const metadata = {
  title: 'Welcome | Bandhit',
  description: 'Welcome to Bandhit – Your gateway to unforgettable events and services.',
};

export default function Welcome() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Event Showcase Section */}
      <EventShowcase />

      {/* Attendee Features Section */}
      <AttendeeFeatures />

      {/* Vendor Features Section */}
      <VendorFeatures />

       {/* Footer Section */}
       <Footer />
    </div>
  );
}