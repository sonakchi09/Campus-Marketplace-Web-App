"use client";

import { useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState([
    { id: "1", name: "iPhone 15", price: 80000, quantity: 1 },
    { id: "2", name: "AirPods Pro", price: 25000, quantity: 2 },
  ]);

  const increase = (id: string) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrease = (id: string) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-32 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        Your Cart
      </h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-bold">
                {item.name}
              </h2>
              <p>₹{item.price}</p>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => decrease(item.id)}
                  className="bg-yellow-400 px-3 rounded"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => increase(item.id)}
                  className="bg-yellow-400 px-3 rounded"
                >
                  +
                </button>
              </div>
            </div>

            <p className="font-bold">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}

        <div className="text-right mt-10">
          <h2 className="text-2xl font-bold">
            Total: ₹{total}
          </h2>

          <Link href="/checkout">
            <button className="mt-5 bg-yellow-400 px-8 py-3 rounded-full font-bold hover:scale-105 transition">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}



