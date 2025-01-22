// src/app/checkout/page.jsx
'use client';

import { josefin } from '@/app/fonts';
import BlogUI from '@/components/UI/blogUI';


export default function Payment() {
  return (
    <main className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${josefin.variable} font-josefin`}>
      <BlogUI />
    </main>
  );
}