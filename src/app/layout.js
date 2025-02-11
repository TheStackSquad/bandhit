//src/app/layout.js
import Providers from "@/app/provider";
import Header from '@/components/Header';
import { roboto, zefani } from '@/app/fonts';
import "./globals.css";

export const metadata = {
  title: "Bandhit - Simplify Events",
  description: "The ultimate platform for ticketing and connecting event organizers and vendors.",
  keywords: "events, ticketing, vendors, event planning, online ticket sales",
  author: "Bandhit Team",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Bandhit - Simplify Events",
    description: "The ultimate platform for ticketing and connecting event organizers and vendors.",
    url: "https://yourwebsite.com",
    siteName: "Bandhit",
    type: "website",
    images: [
      {
        url: "https://yourwebsite.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bandhit - Simplify Events",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Bandhit",
    creator: "@BandhitTeam",
    title: "Bandhit - Simplify Events",
    description: "The ultimate platform for ticketing and connecting event organizers and vendors.",
    images: ["https://yourwebsite.com/twitter-image.jpg"],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable} ${zefani.variable}`}>
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}

