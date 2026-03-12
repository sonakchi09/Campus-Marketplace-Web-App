"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, db } from "@/src/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        onValue(ref(db, `users/${user.uid}`), (snapshot) => {
          setUserData(snapshot.val());
        });

        // products/{uid}/{productId}
        onValue(ref(db, `products/${user.uid}`), (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setListings(Object.entries(data).map(([id, val]: any) => ({ id, ...val })));
          } else {
            setListings([]);
          }
        });

        onValue(ref(db, `checkout/${user.uid}`), (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setOrders(Object.entries(data).map(([id, val]: any) => ({ id, ...val })));
          } else {
            setOrders([]);
          }
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/signin");
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (!firebaseUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">You are not logged in</h2>
        <p className="text-gray-500">Please sign in to view your profile.</p>
        <Link href="/signin" className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition">
          Go to Sign In
        </Link>
      </div>
    );
  }

  const user = {
    name: userData?.firstName ?? firebaseUser.displayName ?? "User",
    email: firebaseUser.email ?? "",
    phone: userData?.phone ?? "+91 XXXXXXXXXX",
    college: "KIIT University",
    year: "3rd Year",
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-32 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">My Profile</h1>

      <div className="max-w-6xl mx-auto space-y-10">

        {/* Profile Card */}
        <div className="bg-white p-8 rounded-xl shadow">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p>{user.email}</p>
              <p>{user.phone}</p>
              <p>{user.college}</p>
              <p>{user.year}</p>
            </div>
          </div>
        </div>

        {/* Listings + Orders Side by Side */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* My Listings */}
          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6">My Listings</h2>
            {listings.length === 0 && <p className="text-gray-500">No listings yet.</p>}
            {listings.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b py-4 gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.imagePreview ?? "/placeholder.png"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p>₹{item.price}</p>
                  </div>
                </div>
                <span className={`px-4 py-1 rounded-full text-sm ${item.status === "Sold" ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"}`}>
                  {item.status ?? "Active"}
                </span>
              </div>
            ))}
          </div>

          {/* Order History */}
          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6">Order History</h2>
            {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b py-4 gap-4">
                <div>
                  <h3 className="font-semibold">Order #{order.id.slice(0, 6)}</h3>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <p className="font-bold">₹{Number(order.total).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Logout */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}