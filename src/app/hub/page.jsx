//src/app/hub/page.jsx

'use client';
import React from 'react';
import { josefin } from '../fonts';
import HubHeader from '@/components/UI/Hub/HubHeader';
import HubGrid from '@/components/UI/Hub/HubGrid';
import hubData from '@/components/data/hubData';

const HubPage = () => {
  return (
    <main className={`bg-gray-50 min-h-screen ${josefin.variable} px-4`}>
      <HubHeader />
      <HubGrid data={hubData} />
    </main>
  );
};

export default HubPage;
