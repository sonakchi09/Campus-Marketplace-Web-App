"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue, remove, push } from "firebase/database";
import { auth, db } from "@/src/firebase/config";

type WishlistItem = {
  id: string;
  title: string;
  price: string;
  image: string;
  category: string;
};

const conditionColors: Record<string, string> = {
  New: "bg-green-100 text-green-700",
  "Like New": "bg-blue-100 text-blue-700",
  Good: "bg-yellow-100 text-yellow-700",
  Fair: "bg-orange-100 text-orange-700",
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        const unsubscribeWishlist = onValue(ref(db, `wishlist/${user.uid}`), (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setItems(Object.entries(data).map(([id, val]: any) => ({ id, ...val })));
          } else {
            setItems([]);
          }
          setLoading(false);
        });
        return () => unsubscribeWishlist();
      } else {
        setUid(null);
        setItems([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleRemove = async (id: string) => {
    if (!uid) return;
    await remove(ref(db, `wishlist/${uid}/${id}`));
  };

  const handleClearAll = async () => {
    if (!uid) return;
    await remove(ref(db, `wishlist/${uid}`));
  };

  const handleAddToCart = async (item: WishlistItem) => {
    if (!uid) return;
    await push(ref(db, `carts/${uid}`), {
      name: item.title,
      price: Number(String(item.price).replace(/,/g, "")),
      image: item.image,
      category: item.category,
      quantity: 1,
      seller: "",
      inStock: true,
      color: "",
      size: "",
    });
  };

  const handleAddAllToCart = async () => {
    if (!uid) return;
    await Promise.all(items.map((item) => handleAddToCart(item)));
  };

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading wishlist...</p>
      </div>
    );
  }

  if (!uid) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">You are not logged in</h2>
        <p className="text-gray-500">Please sign in to view your wishlist.</p>
        <Link href="/signin" className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition">
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 tracking-widest uppercase">
          <Link href="/" className="hover:text-yellow-500 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-black">Wishlist</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight leading-none">
              My <span className="text-yellow-400">Wishlist</span>
            </h1>
            <p className="mt-3 text-gray-400 text-sm">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors underline underline-offset-2 self-start sm:self-auto"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      {items.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs border transition-all duration-200 ${
                filter === cat
                  ? "bg-yellow-400 border-yellow-400 text-black font-bold"
                  : "border-gray-200 text-gray-500 hover:border-yellow-400 hover:text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-full border-2 border-yellow-400 flex items-center justify-center mb-6">
            <span className="text-3xl">🤍</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Nothing saved yet</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-xs">
            Browse the marketplace and tap the heart icon to save items here.
          </p>
          <Link href="/products" className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition">
            Explore Products
          </Link>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group border border-gray-100 rounded-2xl overflow-hidden hover:border-yellow-300 hover:shadow-lg transition-all duration-300"
            >
              {/* Image Area */}
              <div className="relative bg-gray-50 h-48 flex items-center justify-center overflow-hidden">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
                  {categoryEmoji(item.category)}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-red-300 hover:text-red-400"
                >
                  ❤️
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <h3 className="text-sm font-semibold leading-snug line-clamp-2 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{item.category}</p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-yellow-400">₹{Number(String(item.price).replace(/,/g, "")).toLocaleString("en-IN")}</span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="text-xs border border-yellow-400 px-3 py-1.5 rounded-full hover:bg-yellow-400 transition-colors font-semibold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results for filter */}
      {filtered.length === 0 && items.length > 0 && (
        <div className="text-center py-20 text-gray-400 text-sm">
          No items in "{filter}" category.{" "}
          <button onClick={() => setFilter("All")} className="underline text-black">Show all</button>
        </div>
      )}

      {/* Footer Summary */}
      {filtered.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Total value:{" "}
            <span className="text-black font-bold">
              ₹{filtered.reduce((acc, i) => acc + Number(String(i.price).replace(/,/g, "")), 0).toLocaleString("en-IN")}
            </span>
          </p>
          <button
            onClick={handleAddAllToCart}
            className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition"
          >
            Add All to Cart
          </button>
        </div>
      )}
    </main>
  );
}

function categoryEmoji(cat: string) {
  const map: Record<string, string> = {
    Electronics: "⚡",
    Electronic: "⚡",
    Books: "📚",
    Furniture: "🪑",
    furniture: "🪑",
    Appliances: "🏠",
    Transport: "🚲",
    Clothing: "👕",
    Stationary: "🎒",
  };
  return map[cat] ?? "🛍️";
}