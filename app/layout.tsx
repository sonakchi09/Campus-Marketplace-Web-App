import { Indie_Flower } from "next/font/google";
import "./globals.css";
import Navbar from "./general/navbar/NavBar";
import Footer from "./general/Footer";

const indie = Indie_Flower({
  subsets: ["latin"],
  weight: ["400"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${indie.className} bg-white text-black`}>
        <Navbar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
