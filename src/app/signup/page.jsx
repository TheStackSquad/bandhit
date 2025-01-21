// src/app/components/UI/page.jsx
import { josefin } from '../fonts';
import SignupUI from '@/components/UI/signUp';

export const metadata = {
  title: 'Categories | Bandhit',
  description: 'Discover events by category on Bandhit'
};

export default function SignUpPage() {
  return (
    <main className={`min-h-screen ${josefin.variable} font-josefin`}>
      < SignupUI />
    </main>
  );
}