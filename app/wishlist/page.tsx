"use client";

import { useState } from "react";
import Link from "next/link";

type WishlistItem = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  seller: string;
  category: string;
  condition: "New" | "Like New" | "Good" | "Fair";
  addedAt: string;
};

const mockWishlist: WishlistItem[] = [
  {
    id: 1,
    name: "Scientific Calculator TI-84 Plus",
    price: 45,
    originalPrice: 120,
    image: "/calculator.png",
    seller: "Alex M.",
    category: "Electronics",
    condition: "Like New",
    addedAt: "2 days ago",
  },
  {
    id: 2,
    name: "Organic Chemistry Textbook (8th Ed.)",
    price: 30,
    originalPrice: 85,
    image: "/book.png",
    seller: "Priya S.",
    category: "Books",
    condition: "Good",
    addedAt: "1 week ago",
  },
  {
    id: 3,
    name: "Ergonomic Study Chair",
    price: 75,
    image: "/chair.png",
    seller: "Jordan K.",
    category: "Furniture",
    condition: "Like New",
    addedAt: "3 days ago",
  },
  {
    id: 4,
    name: "Wireless Noise-Cancelling Headphones",
    price: 60,
    originalPrice: 200,
    image: "/headphones.png",
    seller: "Sam R.",
    category: "Electronics",
    condition: "Good",
    addedAt: "5 days ago",
  },
  {
    id: 5,
    name: "Mini Refrigerator (2.5 cu ft)",
    price: 90,
    image: "/fridge.png",
    seller: "Dana L.",
    category: "Appliances",
    condition: "Good",
    addedAt: "2 weeks ago",
  },
  {
    id: 6,
    name: "Campus Bicycle - Trek FX2",
    price: 180,
    originalPrice: 500,
    image: "/bike.png",
    seller: "Chris B.",
    category: "Transport",
    condition: "Fair",
    addedAt: "1 day ago",
  },
];

const conditionColors: Record<WishlistItem["condition"], string> = {
  New: "bg-green-100 text-green-700",
  "Like New": "bg-blue-100 text-blue-700",
  Good: "bg-yellow-100 text-yellow-700",
  Fair: "bg-orange-100 text-orange-700",
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(mockWishlist);
  const [filter, setFilter] = useState<string>("All");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const categories = ["All", ...Array.from(new Set(mockWishlist.map((i) => i.category)))];

  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  const handleRemove = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setRemovingId(null);
    }, 350);
  };

  return (
    <main className="min-h-screen bg-white px-4 py-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 font-normal tracking-widest uppercase">
          <Link href="/" className="hover:text-yellow-500 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-black">Wishlist</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extralight tracking-tight leading-none">
              My{" "}
              <span className="relative inline-block">
                Wishlist
                <span
                  className="absolute -bottom-1 left-0 h-0.5 bg-yellow-400"
                  style={{ width: "100%" }}
                />
              </span>
            </h1>
            <p className="mt-3 text-gray-400 font-light text-sm">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => setItems([])}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors font-normal underline underline-offset-2 self-start sm:self-auto"
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
              className={`px-4 py-1.5 rounded-full text-xs font-normal border transition-all duration-200 ${
                filter === cat
                  ? "bg-yellow-400 border-yellow-400 text-black"
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
            <HeartIcon className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-extralight mb-2">Nothing saved yet</h2>
          <p className="text-gray-400 font-light text-sm mb-8 max-w-xs">
            Browse the marketplace and tap the heart icon to save items here.
          </p>
          <Link href="/products" className="main-btn max-w-xs">
            <span>Explore Products</span>
            <ArrowIcon />
          </Link>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                opacity: removingId === item.id ? 0 : 1,
                transform: removingId === item.id ? "scale(0.95)" : "scale(1)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
              }}
              className="group border border-gray-100 rounded-2xl overflow-hidden hover:border-yellow-300 hover:shadow-lg transition-all duration-300"
            >
              {/* Image Area */}
              <div className="relative bg-gray-50 h-48 flex items-center justify-center overflow-hidden">
                {/* Placeholder image with category icon */}
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
                  {categoryEmoji(item.category)}
                </div>

                {/* Condition Badge */}
                <span
                  className={`absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full font-normal ${conditionColors[item.condition]}`}
                >
                  {item.condition}
                </span>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-red-300 hover:text-red-400"
                  aria-label="Remove from wishlist"
                >
                  <HeartFilledIcon className="w-4 h-4 text-yellow-400 hover:text-red-400 transition-colors" />
                </button>

                {/* Discount badge */}
                {item.originalPrice && (
                  <span className="absolute bottom-3 left-3 text-[10px] bg-yellow-400 text-black px-2 py-0.5 rounded-full font-normal">
                    -{Math.round((1 - item.price / item.originalPrice) * 100)}% off
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-normal leading-snug line-clamp-2 flex-1">
                    {item.name}
                  </h3>
                </div>

                <p className="text-xs text-gray-400 font-light mb-3">
                  by {item.seller} · {item.addedAt}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-light">${item.price}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-gray-400 line-through ml-1.5 font-light">
                        ${item.originalPrice}
                      </span>
                    )}
                  </div>

                  <button className="flex items-center gap-1.5 text-xs border border-yellow-400 px-3 py-1.5 rounded-full hover:bg-yellow-400 transition-colors duration-200 font-normal">
                    <CartIcon className="w-3 h-3" />
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
        <div className="text-center py-20 text-gray-400 font-light text-sm">
          No items in "{filter}" category.{" "}
          <button onClick={() => setFilter("All")} className="underline text-black">
            Show all
          </button>
        </div>
      )}

      {/* Footer Summary */}
      {filtered.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm font-light text-gray-500">
            Total value:{" "}
            <span className="text-black font-normal">
              ${filtered.reduce((acc, i) => acc + i.price, 0)}
            </span>
          </p>
          <button className="main-btn sm:w-auto px-8 bg-yellow-400 border-yellow-400 hover:bg-yellow-300 transition-colors">
            <CartIcon className="w-4 h-4" />
            Add All to Cart
          </button>
        </div>
      )}
    </main>
  );
}

// ── Inline SVG Icons ──────────────────────────────────────────────

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function HeartFilledIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

function categoryEmoji(cat: string) {
  const map: Record<string, string> = {
    Electronics: "⚡",
    Books: "📚",
    Furniture: "🪑",
    Appliances: "🏠",
    Transport: "🚲",
    Clothing: "👕",
  };
  return map[cat] ?? "🛍️";
}