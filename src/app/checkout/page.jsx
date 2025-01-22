// src/app/checkout/page.jsx
'use client';

import { josefin } from '../fonts';
import CheckoutUI from '@/components/UI/checkoutUI';


export default function Checkout() {
  return (
    <main className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${josefin.variable} font-josefin`}>
      <CheckoutUI />
    </main>
  );
}