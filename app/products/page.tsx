"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/src/firebase/config";
import ProductCard from "./ProductCard";

export default function ProductSection() {
  const [firebaseProducts, setFirebaseProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "products"), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: any[] = [];
        Object.entries(data).forEach(([uid, userProducts]: any) => {
          Object.entries(userProducts).forEach(([id, val]: any) => {
            if (!val || typeof val !== "object" || !val.name) return;
            list.push({ id, uid, ...val });
          });
        });
        setFirebaseProducts(list);
      } else {
        setFirebaseProducts([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const cards = firebaseProducts
    .filter((p) => p.name && p.name.trim() !== "")
    .map((p) => {
      const rawPrice = String(p.price ?? "").replace(/,/g, "");
      const numPrice = parseFloat(rawPrice);
      return {
        image: p.imagePreview || "/placeholder.png",
        title: p.name,
        price: isNaN(numPrice) ? rawPrice : numPrice.toLocaleString("en-IN"),
        category: p.category || "Other",
        isNew: false,
        isBase64: !!(p.imagePreview && p.imagePreview.startsWith("data:")),
        sellerId: p.sellerId,
        productId: p.id,
      };
    });

  return (
    <main className="p-6">
      <section id="products" className="scroll-mt-16">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-yellow-400">Products on Campus</h2>
          <p className="mt-2 text-gray-600">
            Everything students need — bought, sold, and serviced right on campus
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading products...</div>
        ) : cards.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No products listed yet.</p>
            <p className="text-sm mt-1">Be the first to sell something!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {cards.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}