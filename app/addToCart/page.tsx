"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { ref, onValue, update, remove } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/src/firebase/config";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        const cartRef = ref(db, `carts/${user.uid}`);
        const unsubscribeCart = onValue(cartRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setCart(Object.entries(data).map(([id, val]: any) => ({ docId: id, ...val })));
          } else {
            setCart([]);
          }
          setLoading(false);
        });
        return () => unsubscribeCart();
      } else {
        setUid(null);
        setCart([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const increase = async (docId: string, currentQty: number) => {
    if (!uid) return;
    await update(ref(db, `carts/${uid}/${docId}`), { quantity: currentQty + 1 });
  };

  const decrease = async (docId: string, currentQty: number) => {
    if (!uid) return;
    if (currentQty <= 1) {
      await remove(ref(db, `carts/${uid}/${docId}`));
    } else {
      await update(ref(db, `carts/${uid}/${docId}`), { quantity: currentQty - 1 });
    }
  };

  const removeItem = async (docId: string) => {
    if (!uid) return;
    await remove(ref(db, `carts/${uid}/${docId}`));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading cart...</p>
      </div>
    );
  }

  if (!uid) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">You are not logged in</h2>
        <p className="text-gray-500">Please sign in to view your cart.</p>
        <Link href="/signin" className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition">
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-32 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <p className="text-5xl">🛒</p>
              <p className="text-xl font-semibold">No items added yet</p>
              <p className="text-gray-500">Browse products and click Add to Cart</p>
              <Link href="/products" className="mt-2 bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:scale-105 transition">
                Browse Products
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.docId} className="flex gap-6 border-b pb-6 mb-6">
                <div className="w-40 h-48 relative rounded-xl overflow-hidden bg-gray-50">
                  <Image src={item.image} alt={item.name} fill className="object-contain" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold leading-snug">{item.name}</h2>
                  <p className="text-green-600 text-sm mt-1">{item.inStock ? "In stock" : "Out of stock"}</p>
                  <p className="text-sm text-gray-500 mt-1">Sold by {item.seller}</p>
                  <div className="mt-3 text-sm space-y-1">
                    <p><span className="font-medium">Size:</span> {item.size}</p>
                    <p><span className="font-medium">Color:</span> {item.color}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border rounded-full px-3 py-1 gap-3">
                      <button onClick={() => decrease(item.docId, item.quantity)} className="text-lg font-bold">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increase(item.docId, item.quantity)} className="text-lg font-bold">+</button>
                    </div>
                    <button onClick={() => removeItem(item.docId)} className="flex items-center gap-1 text-red-500 text-sm">
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

        <div className="bg-white p-8 rounded-2xl shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between text-sm mb-2"><span>Shipping</span><span className="text-green-600">Free</span></div>
          <div className="border-t my-4"></div>
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{subtotal}</span></div>
          <Link href="/checkout">
            <button className="mt-6 w-full bg-yellow-400 py-3 rounded-full font-semibold hover:scale-105 transition">
              Proceed to Checkout
            </button>
          </Link>
          <p className="text-xs text-gray-500 mt-4">By placing your order, you agree to our Terms & Conditions.</p>
        </div>
      </div>
    </div>
  );
}