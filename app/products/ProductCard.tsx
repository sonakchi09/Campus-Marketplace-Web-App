"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

type ProductCardProps = {
  image: string;
  title: string;
  price: string;
  category?: string;
  isNew?: boolean;
};

export default function ProductCard({
  image,
  title,
  price,
  category = "Uncategorized",
  isNew = false,
}: ProductCardProps) {
  return (
    <Link href={`/product/${title}`}>
      <div className="w-full max-w-sm rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">

        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">

          {/* Category + New */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-yellow-200/60 px-3 py-0.5 text-xs font-medium text-yellow-700">
              {category}
            </span>

            {isNew && (
              <span className="rounded-full bg-yellow-200/60 px-3 py-0.5 text-xs font-medium text-yellow-700">
                New
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-800 line-clamp-2">
            {title}
          </h3>

          {/* Price */}
          <span className="block text-lg font-bold text-yellow-400">
            ₹{price}
          </span>

          <hr className="border-gray-200" />

          {/* Buttons Row */}
          <div className="flex items-center justify-between">

            {/* Add to Cart */}
            <Link href="/addtocart">
  <button className="text-sm bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 hover:scale-105 transition">
    Add to Cart
  </button>
</Link>


            {/* Wishlist */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Wishlisted:", title);
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Heart size={18} className="text-gray-600 hover:text-red-500 transition" />
            </button>

          </div>
        </div>
      </div>
    </Link>
  );
}
