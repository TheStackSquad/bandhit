// src/app/signin/page.jsx

'use client';
import { josefin } from '@/app/fonts';
import SignIn from '@/components/UI/signIn';

export default function SignInPage() {
  return(
    <main className={`min-h-screen ${josefin.variable} font-josefin`}>
<SignIn />
</main>
  );
}