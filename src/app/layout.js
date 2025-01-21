import Providers from "@/app/provider";
import Header from '@/components/Header';
import { novaFlat, josefin } from '@/app/fonts';
import "./globals.css";

export const metadata = {
  title: "Bandhit - Simplify Events",
  description: "The ultimate platform for ticketing and connecting event organizers and vendors.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${novaFlat.variable} ${josefin.variable}`}>
      <body>
        <Providers>
        <Header />
          {children}
          </Providers>
      </body>
    </html>
  );
}
