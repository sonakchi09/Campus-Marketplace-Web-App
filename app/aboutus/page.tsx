"use client";

import { ShoppingCart, Upload, CheckCircle, Store } from "lucide-react";

export default function AboutFlow() {
  return (
    <section id="aboutus" className="py-24 bg-white scroll-mt-16">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-yellow-400">
            How CampusCart Works
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            A simple and secure way to buy and sell within your campus.
          </p>
        </div>

        {/* Flow Container */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center shadow-md">
              <Store size={32} className="text-yellow-500" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">Choose Your Action</h3>
            <p className="mt-2 text-gray-600">
              Start by selecting whether you want to buy or sell products.
            </p>
          </div>

          {/* Arrow */}
          <svg
            className="hidden lg:block"
            width="80"
            height="20"
            viewBox="0 0 80 20"
            fill="none"
          >
            <path
              d="M0 10 H70"
              stroke="#FACC15"
              strokeWidth="2"
            />
            <polygon
              points="70,5 80,10 70,15"
              fill="#FACC15"
            />
          </svg>

          {/* Step 2 - Buy */}
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center shadow-md">
              <ShoppingCart size={32} className="text-yellow-500" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">Browse & Buy</h3>
            <p className="mt-2 text-gray-600">
              Explore campus listings, contact sellers, and complete your purchase safely.
            </p>
          </div>

          {/* Arrow */}
          <svg
            className="hidden lg:block"
            width="80"
            height="20"
            viewBox="0 0 80 20"
            fill="none"
          >
            <path
              d="M0 10 H70"
              stroke="#FACC15"
              strokeWidth="2"
            />
            <polygon
              points="70,5 80,10 70,15"
              fill="#FACC15"
            />
          </svg>

          {/* Step 3 - Sell */}
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center shadow-md">
              <Upload size={32} className="text-yellow-500" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">Upload Product</h3>
            <p className="mt-2 text-gray-600">
              Sellers list their items with details, images, and pricing.
            </p>
          </div>

          {/* Arrow */}
          <svg
            className="hidden lg:block"
            width="80"
            height="20"
            viewBox="0 0 80 20"
            fill="none"
          >
            <path
              d="M0 10 H70"
              stroke="#FACC15"
              strokeWidth="2"
            />
            <polygon
              points="70,5 80,10 70,15"
              fill="#FACC15"
            />
          </svg>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center shadow-md">
              <CheckCircle size={32} className="text-yellow-500" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">Admin Approval</h3>
            <p className="mt-2 text-gray-600">
              Admin reviews the listing to ensure quality and trust before publishing.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
