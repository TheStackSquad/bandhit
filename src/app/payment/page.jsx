// src/app/checkout/page.jsx
'use client';

import { josefin } from '../fonts';
import PaymentUI from '@/components/UI/paymentUI';


export default function Payment() {
  return (
    <main className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${josefin.variable} font-josefin`}>
      <PaymentUI />
    </main>
  );
}