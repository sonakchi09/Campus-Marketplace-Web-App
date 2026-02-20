import "./globals.css";
import Navbar from "./general/navbar/NavBar";
import Footer from "./general/Footer";

import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-white text-black`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
