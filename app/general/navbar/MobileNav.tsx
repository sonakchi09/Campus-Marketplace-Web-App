"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface MobileNavProps {
  navOpen: boolean;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileNav({ navOpen, setNavOpen }: MobileNavProps) {

  const showMobileNav = navOpen ? "translate-x-0" : "translate-x-full";

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setNavOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          navOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Side Panel */}
      <ul
        className={`fixed flex items-center justify-center text-white flex-col h-full transform transition-all duration-500 w-[80%] sm:w-[60%] bg-slate-800 space-y-6 right-0 top-0 z-50 ${showMobileNav}`}
      >
        <button
          onClick={() => setNavOpen(false)}
          className="absolute top-6 right-6 text-2xl"
        >
          <X />
        </button>

        <li>
          <Link
            href="/#home"
            onClick={() => setNavOpen(false)}
            className="text-xl font-medium"
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            href="/#aboutus"
            onClick={() => setNavOpen(false)}
            className="text-xl font-medium"
          >
            About Us
          </Link>
        </li>

        <li>
          <Link
            href="/#products"
            onClick={() => setNavOpen(false)}
            className="text-xl font-medium"
          >
            Products
          </Link>
        </li>

        <li>
          <Link
            href="/uploadproduct"
            onClick={() => setNavOpen(false)}
            className="text-xl font-medium"
          >
            Sell Item
          </Link>
        </li>

        <li>
          <Link
            href="/signin"
            onClick={() => setNavOpen(false)}
            className="text-xl font-medium"
          >
            Sign In
          </Link>
        </li>
      </ul>
    </>
  );
}