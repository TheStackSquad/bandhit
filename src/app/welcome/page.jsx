//'use client';

import WelcomeUI from '@/components/UI/welcomeUI';
import { josefin } from '@/app/fonts';

export const metadata = {
  title: 'Categories | Bandhit',
  description: 'Discover events by category on Bandhit'
};

export default function Welcome() {
  return (
    <div className={`min-h-screen flex items-center justify-center ${josefin.variable} font-josefin`}>
    <WelcomeUI/>
  </div>
  );
}
