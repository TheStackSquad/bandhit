// src/app/checkout/page.jsx
'use client';

import CheckoutUI from '@/components/UI/checkoutLayout/checkoutUI';


export default function Checkout() {
  return (
    <main className={`min-h-screen bg-gradient-to-b from-gray-50 to-white`}>
      <CheckoutUI />
    </main>
  );
}