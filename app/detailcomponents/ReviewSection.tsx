"use client";

import { useState, useEffect } from "react";
import { ref, push, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/src/firebase/config";

type Review = {
  id: string;
  text: string;
  authorName: string;
  authorInitial: string;
  uid: string;
  createdAt: number;
};

type Props = {
  productId: string;   // the Firebase push key of the product
  sellerId: string;    // the sellerId (uid of seller)
};

export default function ReviewSection({ productId, sellerId }: Props) {
  const [reviews, setReviews]     = useState<Review[]>([]);
  const [text, setText]           = useState("");
  const [currentUser, setCurrentUser] = useState<{ uid: string; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Listen to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const name =
          user.displayName ||
          user.email?.split("@")[0] ||
          "Anonymous";
        setCurrentUser({ uid: user.uid, name });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsub();
  }, []);

  // Read reviews from: products/{sellerId}/{productId}/reviews
  useEffect(() => {
    if (!sellerId || !productId) return;
    const reviewsRef = ref(db, `products/${sellerId}/${productId}/reviews`);
    const unsub = onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Review[] = Object.entries(data).map(([id, val]: any) => ({
          id,
          ...val,
        }));
        // Sort newest first
        list.sort((a, b) => b.createdAt - a.createdAt);
        setReviews(list);
      } else {
        setReviews([]);
      }
    });
    return () => unsub();
  }, [sellerId, productId]);

  const handleSubmit = async () => {
    if (!text.trim() || !currentUser || submitting) return;
    setSubmitting(true);
    try {
      await push(
        ref(db, `products/${sellerId}/${productId}/reviews`),
        {
          text: text.trim(),
          authorName: currentUser.name,
          authorInitial: currentUser.name[0].toUpperCase(),
          uid: currentUser.uid,
          createdAt: Date.now(),
        }
      );
      setText("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);
    } catch (err: any) {
      alert("Failed to submit review: " + err.message);
    }
    setSubmitting(false);
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="mt-16">

      {/* TITLE */}
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

      {/* WRITE REVIEW */}
      {currentUser ? (
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-semibold text-sm shrink-0">
            {currentUser.name[0].toUpperCase()}
          </div>

          <input
            type="text"
            placeholder="Write your review..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            onClick={handleSubmit}
            disabled={submitting || !text.trim()}
            className="bg-yellow-400 px-10 py-2 rounded-lg font-medium hover:bg-yellow-500 disabled:opacity-50 transition"
          >
            {submitted ? "✓ Sent!" : submitting ? "Posting..." : "Submit"}
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-10">
          Please{" "}
          <a href="/signin" className="text-yellow-500 font-semibold underline">
            sign in
          </a>{" "}
          to write a review.
        </p>
      )}

      {/* REVIEWS LIST */}
      {reviews.length === 0 ? (
        <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
      ) : (
        <div className="flex flex-col gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold shrink-0">
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
  );
}