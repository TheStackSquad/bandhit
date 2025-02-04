// src/app/welcome/page.jsx
//'use client';

import { josefin } from '@/app/fonts';
import HeroSection from '@/components/welcomeLayout/heroSection';
import EventShowcase from '@/components/welcomeLayout/eventShowcase';
import AttendeeFeatures from '@/components/welcomeLayout/attendeeFeatures';
import VendorFeatures from '@/components/welcomeLayout/vendorFeatures';
import Footer from '@/components/welcomeLayout/footer';

export const metadata = {
  title: 'Welcome | Bandhit',
  description: 'Welcome to Bandhit – Your gateway to unforgettable events and services.',
};

export default function Welcome() {
  return (
    <div className={`${josefin.variable} font-josefin`}>
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