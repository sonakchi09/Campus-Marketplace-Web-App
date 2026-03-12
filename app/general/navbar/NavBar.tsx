"use client";

import Link from "next/link";
import { ShoppingCart, User, ShieldCheck, Heart, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, db } from "@/src/firebase/config";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);

        const unsubscribeCart = onValue(ref(db, `carts/${user.uid}`), (snapshot) => {
          const data = snapshot.val();
          setCartCount(data ? Object.keys(data).length : 0);
        });

        const unsubscribeWishlist = onValue(ref(db, `wishlist/${user.uid}`), (snapshot) => {
          const data = snapshot.val();
          setWishlistCount(data ? Object.keys(data).length : 0);
        });

        return () => {
          unsubscribeCart();
          unsubscribeWishlist();
        };
      } else {
        setUid(null);
        setCartCount(0);
        setWishlistCount(0);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  return (
    <nav className="fixed w-full z-50 bg-gray-100 shadow-sm">
      <div className="flex items-center justify-between h-16 px-10">

        {/* Logo */}
        <h1 className="text-3xl font-extrabold text-yellow-400">
          CampusCart
        </h1>

        {/* Center Links */}
        <ul className="flex items-center space-x-9 text-black text-sm">
          <li><Link href="/#home" className="hover:text-yellow-400 transition">Home</Link></li>
          <li><Link href="/#aboutus" className="hover:text-yellow-400 transition">About Us</Link></li>
          <li><Link href="/#products" className="hover:text-yellow-400 transition">Products</Link></li>
          <li>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-yellow-400 transition"
            >
              Contact
            </button>
          </li>
          <li><Link href="/uploadproduct" className="hover:text-yellow-400 transition">Sell Item</Link></li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 rounded-full border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          />

          {uid ? (
            <>
              {/* Admin */}
              <Link href="/admin">
                <button className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold px-4 py-2 rounded-full transition-all hover:scale-105">
                  <ShieldCheck size={15} />
                  Admin
                </button>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative group">
                <Heart className="w-6 h-6 text-black group-hover:text-yellow-400 transition" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/addToCart" className="relative group">
                <ShoppingCart className="w-6 h-6 text-black group-hover:text-yellow-400 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <Link href="/profile" className="group">
                <User className="w-6 h-6 text-black group-hover:text-yellow-400 transition" />
              </Link>
            </>
          ) : (
            /* Not logged in — show Sign In button */
            <Link href="/signin" className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold px-4 py-2 rounded-full transition-all hover:scale-105">
              <LogIn size={15} />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}