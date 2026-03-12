"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/src/firebase/config";
import ProductCard from "./ProductCard";

const staticProducts = [
  { image: "/laptop.jpg",     title: "Laptop",     price: "20,000", category: "Electronics", isNew: false, isBase64: false },
  { image: "/calculator.jpg", title: "Calculator", price: "500",    category: "Stationary",  isNew: false, isBase64: false },
  { image: "/textbook.jpg",   title: "TextBook",   price: "600",    category: "Books",        isNew: true,  isBase64: false },
  { image: "/usbdriver.jpg",  title: "Usb Driver", price: "800",    category: "Electronics", isNew: true,  isBase64: false },
  { image: "/chair.png",      title: "Chair",      price: "300",    category: "Furniture",   isNew: true,  isBase64: false },
  { image: "/camera.png",     title: "Camera",     price: "20,000", category: "Electronics", isNew: true,  isBase64: false },
  { image: "/table.png",      title: "Table",      price: "200",    category: "Furniture",   isNew: false, isBase64: false },
  { image: "/charger.png",    title: "Charger",    price: "1800",   category: "Electronics", isNew: false, isBase64: false },
  { image: "/bag.png",        title: "Bag",        price: "500",    category: "Stationary",  isNew: true,  isBase64: false },
  { image: "/bottle.png",     title: "Bottle",     price: "300",    category: "Other",       isNew: false, isBase64: false },
];

export default function ProductSection() {
  const [firebaseProducts, setFirebaseProducts] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "products"), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: any[] = [];
        Object.entries(data).forEach(([uid, userProducts]: any) => {
          // each key under a uid is either a product (has "name") or something else — skip non-products
          Object.entries(userProducts).forEach(([id, val]: any) => {
            // skip if val is not an object or has no "name" field (e.g. reviews node)
            if (!val || typeof val !== "object" || !val.name) return;
            list.push({ id, uid, ...val });
          });
        });
        setFirebaseProducts(list);
      } else {
        setFirebaseProducts([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const firebaseCards = firebaseProducts
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

  const allProducts = [...firebaseCards, ...staticProducts];

  return (
    <main className="p-6">
      <section id="products" className="scroll-mt-16">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-yellow-400">Products on Campus</h2>
          <p className="mt-2 text-gray-600">
            Everything students need — bought, sold, and serviced right on campus
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {allProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </section>
    </main>
  );
}