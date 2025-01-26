// src/app/profile/page.jsx
'use client';

import { josefin } from '../fonts';
import ProfileLayout from '@/components/UI/profileUI';


export default function Profile() {
  return (
    <main className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${josefin.variable} font-josefin`}>
      <ProfileLayout />
    </main>
  );
}