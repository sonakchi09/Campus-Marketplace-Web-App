"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, onValue, get, push, set, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/src/firebase/config";
import { Heart, Mail, Phone, ShoppingCart, Check } from "lucide-react";

type Product = {
  id: string;
  sellerId: string;
  name: string;
  price: string;
  description: string;
  category: string;
  imagePreview: string;
  quantity: string;
  sellerEmail: string;
};

type SellerProfile = {
  phone?: string;
  firstName?: string;
  lastName?: string;
};

type Review = {
  id: string;
  text: string;
  authorName: string;
  authorInitial: string;
  uid: string;
  createdAt: number;
};

export default function IndividualProductPage() {
  const params = useParams();
  const title = decodeURIComponent(params.title as string);

  const [product, setProduct]         = useState<Product | null>(null);
  const [seller, setSeller]           = useState<SellerProfile | null>(null);
  const [loading, setLoading]         = useState(true);
  const [wishlisted, setWishlisted]   = useState(false);
  const [added, setAdded]             = useState(false);

  const [reviews, setReviews]         = useState<Review[]>([]);
  const [reviewText, setReviewText]   = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [currentUser, setCurrentUser] = useState<{ uid: string; name: string } | null>(null);

  // Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "Anonymous",
        });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsub();
  }, []);

  // Load product
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
        if (found?.sellerId) {
          onValue(ref(db, `users/${found.sellerId}`), (snap) => {
            setSeller(snap.val());
          });
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [title]);

  // Load reviews
  useEffect(() => {
    if (!product) return;
    const unsub = onValue(
      ref(db, `products/${product.sellerId}/${product.id}/reviews`),
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list: Review[] = Object.entries(data).map(([id, val]: any) => ({ id, ...val }));
          list.sort((a, b) => b.createdAt - a.createdAt);
          setReviews(list);
        } else {
          setReviews([]);
        }
      }
    );
    return () => unsub();
  }, [product]);

  const handleAddToCart = async () => {
    if (!currentUser) { window.location.href = "/signin"; return; }
    if (!product || added) return;
    setAdded(true);
    const snapshot = await get(ref(db, `carts/${currentUser.uid}`));
    const data = snapshot.val();
    if (data) {
      const existing = Object.entries(data).find(([, v]: any) => v.name === product.name);
      if (existing) {
        const [key, val]: any = existing;
        await update(ref(db, `carts/${currentUser.uid}/${key}`), { quantity: val.quantity + 1 });
        setTimeout(() => setAdded(false), 2000);
        return;
      }
    }
    const numericPrice = Number(String(product.price).replace(/,/g, "")) || 0;
    await push(ref(db, `carts/${currentUser.uid}`), {
      name: product.name, price: numericPrice,
      image: product.imagePreview, category: product.category,
      quantity: 1, seller: product.sellerEmail,
      inStock: true, color: "", size: "",
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async () => {
    if (!currentUser || !product) return;
    await set(ref(db, `wishlist/${currentUser.uid}/${product.name.replace(/\s+/g, "_")}`), {
      title: product.name, price: product.price,
      image: product.imagePreview, category: product.category,
    });
    setWishlisted(true);
    setTimeout(() => setWishlisted(false), 2000);
  };

  const handleReviewSubmit = async () => {
    if (!reviewText.trim() || !currentUser || !product || submitting) return;
    setSubmitting(true);
    await push(ref(db, `products/${product.sellerId}/${product.id}/reviews`), {
      text: reviewText.trim(),
      authorName: currentUser.name,
      authorInitial: currentUser.name[0].toUpperCase(),
      uid: currentUser.uid,
      createdAt: Date.now(),
    });
    setReviewText("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    setSubmitting(false);
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

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

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-32">

      {/* PRODUCT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* IMAGE */}
        <div className="flex justify-center">
          <div className="w-full max-w-md h-[380px] border rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
            <img
              src={product?.imagePreview || `/${title.toLowerCase().replace(/ /g, "")}.jpg`}
              alt={title}
              className="object-contain w-full h-full"
              onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold mt-12">
            {product?.name ?? title}
          </h1>

          <div className="flex items-center gap-2 text-yellow-500">
            ⭐⭐⭐⭐☆
            <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
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

          {/* SELLER CONTACT */}
          {product && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
              <p className="text-sm font-semibold text-gray-700">Contact Seller</p>
              {product.sellerEmail && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} />
                  <a href={`mailto:${product.sellerEmail}`} className="hover:text-yellow-500 transition">
                    {product.sellerEmail}
                  </a>
                </div>
              )}
              {seller?.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} />
                  <a href={`tel:${seller.phone}`} className="hover:text-yellow-500 transition">
                    {seller.phone}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition ${
                added ? "bg-green-400 text-white" : "bg-yellow-400 hover:bg-yellow-500 text-black"
              }`}
            >
              {added ? <Check size={16} /> : <ShoppingCart size={16} />}
              {added ? "Added!" : "Add to Cart"}
            </button>

            <button
              onClick={handleWishlist}
              className="p-3 rounded-lg border hover:bg-gray-50 transition hover:scale-110"
            >
              <Heart
                size={22}
                className={wishlisted ? "text-red-500 fill-red-500" : "text-gray-600"}
              />
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="mt-24 pt-8 border-t border-gray-100">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

        {product ? (
          currentUser ? (
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-semibold text-sm shrink-0">
                {currentUser.name[0].toUpperCase()}
              </div>
              <input
                type="text"
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReviewSubmit()}
                className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                onClick={handleReviewSubmit}
                disabled={submitting || !reviewText.trim()}
                className="bg-yellow-400 px-8 py-2 rounded-lg font-medium hover:bg-yellow-500 disabled:opacity-50 transition"
              >
                {submitted ? "✓ Sent!" : submitting ? "Posting..." : "Submit"}
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-10">
              Please{" "}
              <a href="/signin" className="text-yellow-500 font-semibold underline">sign in</a>
              {" "}to write a review.
            </p>
          )
        ) : (
          <p className="text-gray-400 text-sm mb-10">Reviews only available for marketplace products.</p>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
        ) : (
          <div className="flex flex-col gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold shrink-0">
                  {review.authorInitial}
                </div>
                <div>
                  <p className="font-semibold">{review.authorName}</p>
                  <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                  <p className="mt-2 text-gray-700 max-w-2xl">{review.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}