// src/app/events/page.jsx
'use client';

import EventLayout from "@/components/UI/eventsUI";
import { josefin } from '@/app/fonts';

export default function EventsPage() {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${josefin.variable} --font-josefin`}>
      <EventLayout />
    </div>
  );
}
