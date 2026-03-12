"use client";

import { useState, useEffect } from "react";
import { ref, push } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/src/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UploadProduct() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    imagePreview: "",
    quantity: "1",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
    });
    return () => unsubscribe();
  }, []);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImage(e: any) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm((prev) => ({ ...prev, imagePreview: reader.result as string }));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!uid) { router.push("/signin"); return; }

    setLoading(true);
    try {
      // Save to pendingProducts/{uid}/ node
      await push(ref(db, `pendingProducts/${uid}`), {
        name: form.name,
        price: form.price,
        category: form.category,
        description: form.description,
        imagePreview: form.imagePreview,
        quantity: form.quantity,
        status: "pending",
        sellerId: uid,
        sellerEmail: auth.currentUser?.email ?? null,
        createdAt: Date.now(),
      });
      setSubmitted(true);
    } catch (error: any) {
      alert(error.message);
    }
    setLoading(false);
  }

  if (!uid) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">You are not logged in</h2>
        <p className="text-gray-500">Please sign in to upload a product.</p>
        <Link href="/signin" className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition">
          Go to Sign In
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-extrabold mb-2">Request Sent!</h2>
          <p className="text-gray-500">Your product has been submitted for admin review.</p>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: "", price: "", category: "", description: "", imagePreview: "", quantity: "1" }); }}
            className="mt-6 bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition"
          >
            Upload Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-1">Upload a Product</h1>
        <p className="text-gray-500 mb-8">Fill in the details — see your listing preview live on the right.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* FORM */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-8 flex flex-col gap-5">

            <div>
              <label className="block text-sm font-bold mb-1">Product Name</label>
              <input name="name" value={form.name} placeholder="e.g. Engineering Textbook"
                onChange={handleChange} required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Price (₹)</label>
              <input type="number" name="price" value={form.price} placeholder="e.g. 350"
                onChange={handleChange} required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Quantity</label>
              <input type="number" name="quantity" value={form.quantity} placeholder="e.g. 1"
                onChange={handleChange} required min="1"
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Select a category</option>
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Hostel Items">Hostel Items</option>
                <option value="Clothing">Clothing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Description</label>
              <textarea name="description" value={form.description} rows={4}
                placeholder="Describe the item's condition..."
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Product Image</label>
              <input type="file" accept="image/*" onChange={handleImage}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-bold file:bg-yellow-400 file:text-black"
              />
            </div>

            <button type="submit" disabled={loading}
              className="bg-yellow-400 text-black font-extrabold py-3 rounded-full hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit for Review"}
            </button>
            <p className="text-xs text-gray-400 text-center">Reviewed by admin before going live.</p>

          </form>

          {/* LIVE PREVIEW */}
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Live Preview</p>
            <div className="bg-white rounded-2xl shadow overflow-hidden border-2 border-dashed border-yellow-400">
              {form.imagePreview ? (
                <img src={form.imagePreview} alt="Preview" className="w-full h-56 object-cover" />
              ) : (
                <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400">
                  Image will appear here
                </div>
              )}
              <div className="p-5 flex flex-col gap-2">
                <h2 className="text-xl font-extrabold">
                  {form.name || <span className="text-gray-400 font-normal">Product name...</span>}
                </h2>
                <p className="text-yellow-500 font-bold text-lg">
                  {form.price ? `₹${Number(form.price).toLocaleString("en-IN")}` : <span className="text-gray-400 font-normal text-sm">Price...</span>}
                </p>
                {form.quantity && (
                  <p className="text-sm text-gray-500">Qty: {form.quantity}</p>
                )}
                {form.category && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold w-fit">
                    {form.category}
                  </span>
                )}
                <p className="text-sm text-gray-500">
                  {form.description || "Description will appear here..."}
                </p>
                <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-xs text-yellow-700 font-semibold text-center">
                  ⏳ Pending Admin Approval
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}