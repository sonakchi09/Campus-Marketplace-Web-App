"use client";

import Link from "next/link";
import {
  ShoppingCart,
  User,
  ShieldCheck,
  Heart,
  LogIn,
  Menu,
  Search,
  X,
} from "lucide-react";

import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { useRouter } from "next/navigation";

import { auth, db } from "@/src/firebase/config";
import MobileNav from "./MobileNav";

const ADMIN_UIDS = [
  "RI1GbI9luNcLsLiMeUkdU5EyjQg1",
  "XvLIPhxcDDaOJ5LXcJG87NE9Ch82",
];

type Product = {
  id: string;
  sellerId: string;
  name: string;
  price: string;
  category: string;
  imagePreview: string;
};

const staticProducts: Product[] = [
  { id: "s1",  sellerId: "", name: "Laptop",     price: "20,000", category: "Electronics", imagePreview: "/laptop.jpg" },
  { id: "s2",  sellerId: "", name: "Calculator", price: "500",    category: "Stationary",  imagePreview: "/calculator.jpg" },
  { id: "s3",  sellerId: "", name: "TextBook",   price: "600",    category: "Books",        imagePreview: "/textbook.jpg" },
  { id: "s4",  sellerId: "", name: "Usb Driver", price: "800",    category: "Electronics", imagePreview: "/usbdriver.jpg" },
  { id: "s5",  sellerId: "", name: "Chair",      price: "300",    category: "Furniture",   imagePreview: "/chair.png" },
  { id: "s6",  sellerId: "", name: "Camera",     price: "20,000", category: "Electronics", imagePreview: "/camera.png" },
  { id: "s7",  sellerId: "", name: "Table",      price: "200",    category: "Furniture",   imagePreview: "/table.png" },
  { id: "s8",  sellerId: "", name: "Charger",    price: "1800",   category: "Electronics", imagePreview: "/charger.png" },
  { id: "s9",  sellerId: "", name: "Bag",        price: "500",    category: "Stationary",  imagePreview: "/bag.png" },
  { id: "s10", sellerId: "", name: "Bottle",     price: "300",    category: "Other",       imagePreview: "/bottle.png" },
];

export default function Navbar() {
  const router = useRouter();

  const [cartCount, setCartCount]         = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [uid, setUid]                     = useState<string | null>(null);
  const [navOpen, setNavOpen]             = useState(false);

  const [query, setQuery]                 = useState("");
  const [allProducts, setAllProducts]     = useState<Product[]>(staticProducts);
  const [results, setResults]             = useState<Product[]>([]);
  const [showDropdown, setShowDropdown]   = useState(false);
  const searchRef                         = useRef<HTMLDivElement>(null);

  // Auth + live counts
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        const unsubCart = onValue(ref(db, `carts/${user.uid}`), (snap) => {
          const data = snap.val();
          setCartCount(data ? Object.keys(data).length : 0);
        });
        const unsubWish = onValue(ref(db, `wishlist/${user.uid}`), (snap) => {
          const data = snap.val();
          setWishlistCount(data ? Object.keys(data).length : 0);
        });
        return () => { unsubCart(); unsubWish(); };
      } else {
        setUid(null);
        setCartCount(0);
        setWishlistCount(0);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Load Firebase products into search index
  useEffect(() => {
    const unsub = onValue(ref(db, "products"), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Product[] = [];
        Object.entries(data).forEach(([sellerId, userProducts]: any) => {
          Object.entries(userProducts).forEach(([id, val]: any) => {
            if (!val || typeof val !== "object" || !val.name) return;
            list.push({ id, sellerId, name: val.name, price: val.price, category: val.category, imagePreview: val.imagePreview });
          });
        });
        setAllProducts([...list, ...staticProducts]);
      }
    });
    return () => unsub();
  }, []);

  // Filter on every keystroke
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const q = query.toLowerCase();
    const filtered = allProducts
      .filter((p) => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      .slice(0, 6);
    setResults(filtered);
    setShowDropdown(true);
  }, [query, allProducts]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (product: Product) => {
    setQuery("");
    setShowDropdown(false);
    router.push(`/individualproduct/${encodeURIComponent(product.name)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowDropdown(false);
    const exact = allProducts.find((p) => p.name.toLowerCase() === query.toLowerCase());
    if (exact) {
      router.push(`/individualproduct/${encodeURIComponent(exact.name)}`);
    } else if (results.length > 0) {
      router.push(`/individualproduct/${encodeURIComponent(results[0].name)}`);
    }
    setQuery("");
  };

  return (
    <>
      <nav className="fixed w-full z-50 bg-gray-100 shadow-sm">
        <div className="flex items-center justify-between h-16 px-6 md:px-10">

          {/* Logo */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-yellow-400">
            CampusCart
          </h1>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center space-x-9 text-black text-sm">
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
          <div className="flex items-center gap-4">

            {/* Search */}
            <div className="hidden md:block relative" ref={searchRef}>
              <form onSubmit={handleSubmit}>
                <div className="flex items-center border border-yellow-400 rounded-full bg-white px-3 py-2 gap-2">
                  <Search size={14} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim() && setShowDropdown(true)}
                    className="outline-none text-sm bg-transparent w-44 focus:w-56 transition-all duration-200"
                  />
                  {query && (
                    <button type="button" onClick={() => { setQuery(""); setShowDropdown(false); }}>
                      <X size={14} className="text-gray-400 hover:text-gray-700 transition" />
                    </button>
                  )}
                </div>

                {/* Dropdown */}
                {showDropdown && results.length > 0 && (
                  <div className="absolute top-full mt-2 left-0 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {results.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelect(product)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yellow-50 transition text-left"
                      >
                        <img
                          src={product.imagePreview || "/placeholder.png"}
                          alt={product.name}
                          className="w-9 h-9 rounded-lg object-cover border border-gray-100 shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.category}</p>
                        </div>
                        <span className="text-xs font-bold text-yellow-500 shrink-0">₹{product.price}</span>
                      </button>
                    ))}
                    <div className="border-t border-gray-100 px-4 py-2.5 text-xs text-gray-400 text-center">
                      Press Enter to go to top result
                    </div>
                  </div>
                )}

                {/* No results */}
                {showDropdown && query.trim() && results.length === 0 && (
                  <div className="absolute top-full mt-2 left-0 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-4 z-50 text-center">
                    <p className="text-sm text-gray-400">No products found for "{query}"</p>
                  </div>
                )}
              </form>
            </div>

            {/* Icons */}
            <div className="hidden md:flex items-center gap-6">
              {uid ? (
                <>
                  {/* Admin button — only visible to admin UIDs */}
                  {ADMIN_UIDS.includes(uid) && (
                    <Link href="/admin">
                      <button className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold px-4 py-2 rounded-full transition-all hover:scale-105">
                        <ShieldCheck size={15} />
                        Admin
                      </button>
                    </Link>
                  )}

                  <Link href="/wishlist" className="relative group">
                    <Heart className="w-6 h-6 text-black group-hover:text-yellow-400 transition" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link href="/addToCart" className="relative group">
                    <ShoppingCart className="w-6 h-6 text-black group-hover:text-yellow-400 transition" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <Link href="/profile" className="group">
                    <User className="w-6 h-6 text-black group-hover:text-yellow-400 transition" />
                  </Link>
                </>
              ) : (
                <Link
                  href="/signin"
                  className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold px-4 py-2 rounded-full transition-all hover:scale-105"
                >
                  <LogIn size={15} />
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu */}
            <button onClick={() => setNavOpen(true)} className="md:hidden">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      <MobileNav navOpen={navOpen} setNavOpen={setNavOpen} />
    </>
  );
}