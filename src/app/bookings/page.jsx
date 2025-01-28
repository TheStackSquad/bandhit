// src/app/booking/page.jsx
'use client';

import { josefin } from '@/app/fonts';
import BookingUI from '@/components/UI/bookingUI';


export default function Booking() {
  return (
    <main className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${josefin.variable} font-josefin`}>
      <BookingUI />
    </main>
  );
}