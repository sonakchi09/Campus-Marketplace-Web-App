"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState([
    {
      id: "1",
      name: "Laptop",
      price: 20000,
      quantity: 1,
      color: "Black",
      image: "/laptop.jpg",
      inStock: true,
      seller: "XYZ"
    }
  ]);

  const increase = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrease = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-32 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* LEFT SIDE - CART ITEMS */}
        <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 border-b pb-6 mb-6"
              >
                <div className="w-40 h-48 relative rounded-xl overflow-hidden bg-gray-50">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-semibold leading-snug">
                    {item.name}
                  </h2>

                  <p className="text-green-600 text-sm mt-1">
                    {item.inStock ? "In stock" : "Out of stock"}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Sold by {item.seller}
                  </p>

                  <div className="mt-3 text-sm space-y-1">
                    <p>
                      <span className="font-medium">Size:</span> {item.size}
                    </p>
                    <p>
                      <span className="font-medium">Color:</span> {item.color}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border rounded-full px-3 py-1 gap-3">
                      <button
                        onClick={() => decrease(item.id)}
                        className="text-lg font-bold"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increase(item.id)}
                        className="text-lg font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1 text-red-500 text-sm"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold">₹{item.price}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT SIDE - SUMMARY */}
        <div className="bg-white p-8 rounded-2xl shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>

          <div className="border-t my-4"></div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>

          <Link href="/checkout">
            <button className="mt-6 w-full bg-yellow-400 py-3 rounded-full font-semibold hover:scale-105 transition">
              Proceed to Checkout
            </button>
          </Link>

          <p className="text-xs text-gray-500 mt-4">
            By placing your order, you agree to our Terms & Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
