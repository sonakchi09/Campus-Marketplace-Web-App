"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/src/firebase/config";
import ReviewSection from "@/app/detailcomponents/ReviewSection";
import { Heart, MessageCircle } from "lucide-react";

type Product = {
  id: string;
  sellerId: string;
  name: string;
  price: string;
  description: string;
  category: string;
  imagePreview: string;
  quantity: string;
};

export default function IndividualProductPage() {
  const params = useParams();
  const title = decodeURIComponent(params.title as string);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "products"), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let found: Product | null = null;
        outer: for (const [sellerId, userProducts] of Object.entries(data) as any) {
          for (const [id, val] of Object.entries(userProducts) as any) {
            if (!val || typeof val !== "object" || !val.name) continue;
            if (val.name.toLowerCase() === title.toLowerCase()) {
              found = { id, sellerId, ...val };
              break outer;
            }
          }
        }
        setProduct(found);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [title]);

  const isBase64 = !!(product?.imagePreview?.startsWith("data:"));
  const displayPrice = (() => {
    if (!product) return "";
    const raw = String(product.price).replace(/,/g, "");
    const num = parseFloat(raw);
    return isNaN(num) ? product.price : `₹${num.toLocaleString("en-IN")}`;
  })();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  // Static product fallback (for products not in Firebase)
  const isStaticProduct = !product;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-32">

      {/* PRODUCT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* IMAGE */}
        <div className="flex justify-center">
          <div className="w-full max-w-md h-[380px] border rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
            {isBase64 ? (
              <img
                src={product!.imagePreview}
                alt={product!.name}
                className="object-contain w-full h-full"
              />
            ) : (
              <img
                src={product?.imagePreview || `/${title.toLowerCase().replace(/ /g, "")}.jpg`}
                alt={title}
                className="object-contain w-full h-full"
                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
              />
            )}
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-6">

          <h1 className="text-3xl font-semibold mt-12">
            {product?.name ?? title}
          </h1>

          <div className="flex items-center gap-2 text-yellow-500">
            ⭐⭐⭐⭐☆
            <span className="text-gray-500 text-sm">(reviews below)</span>
          </div>

          <p className="text-4xl font-bold text-yellow-500">
            {product ? displayPrice : "—"}
          </p>

          <p className="text-gray-600 leading-relaxed max-w-lg">
            {product?.description || "No description provided."}
          </p>

          {product && (
            <p className="text-sm text-gray-400">
              Category: {product.category} · Qty: {product.quantity}
            </p>
          )}

          {/* BUTTON ROW */}
          <div className="flex items-center gap-6 pt-6">

            {/* ADD TO CART */}
            <button className="bg-yellow-400 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
              Add to Cart
            </button>

            {/* CHAT */}
            <button className="flex items-center gap-2 border px-6 py-3 rounded-lg hover:bg-gray-100 transition">
              <MessageCircle size={18} />
              Chat with Seller
            </button>

            {/* WISHLIST — single button, no nesting */}
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className="p-2 hover:scale-110 transition"
            >
              <Heart
                size={24}
                className={`transition ${wishlisted ? "text-red-500 fill-red-500" : "text-black"}`}
              />
            </button>

          </div>

        </div>
      </div>

      {/* REVIEWS — only for Firebase products that have sellerId + productId */}
      <div className="mt-40 pt-16">
        {product ? (
          <ReviewSection productId={product.id} sellerId={product.sellerId} />
        ) : (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
            <p className="text-gray-400 text-sm">Reviews are only available for marketplace products.</p>
          </div>
        )}
      </div>

    </div>
  );
}