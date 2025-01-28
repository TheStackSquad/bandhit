//src/app/layout.js
import Providers from "@/app/provider";
import Header from '@/components/Header';
import { novaFlat, josefin } from '@/app/fonts';
import "./globals.css";
import Head from 'next/head';

export const metadata = {
  title: "Bandhit - Simplify Events",
  description: "The ultimate platform for ticketing and connecting event organizers and vendors.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${novaFlat.variable} ${josefin.variable}`}>
      <Head>
        {/* Preload only critical assets */}
        <link rel="preload" href="/Fontz/JosefinSans-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
