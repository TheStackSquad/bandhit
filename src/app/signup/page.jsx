// src/app/components/UI/page.jsx

import SignupUI from '@/components/UI/signUp';

export const metadata = {
  title: 'Categories | Bandhit',
  description: 'Discover events by category on Bandhit'
};

export default function SignUpPage() {
  return (
    <main className={`min-h-screen`}>
      < SignupUI />
    </main>
  );
}