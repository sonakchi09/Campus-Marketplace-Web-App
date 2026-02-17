"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-gray-100  outline-none">
      <div className="flex items-center justify-between h-16 px-10">
        
        {/* Logo */}
        <h1 className="text-3xl font-extrabold text-yellow-400 font-extrabold">
          CampusCart
        </h1>

        {/* Nav Links */}
        <ul className="flex space-x-9 text-black text-xl">
          <li>
            <Link href="/" className="hover:text-yellow-400 transition">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-yellow-400 transition">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/products" className="hover:text-yellow-400 transition">
              Products
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-yellow-400 transition">
              Contact
            </Link>
          </li>
        </ul>

        {/* Search Bar - Black */}
     <input
  type="text"
  placeholder="Search..."
  className="px-4 py-2 rounded-4xl
             border-1 border-yellow-400 
            
             focus:outline-none 
             focus:ring-2 focus:ring-yellow-400"
/>

      </div>
    </nav>
  );
}
