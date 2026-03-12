"use client";

import Image from "next/image";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, set, get, update, push } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/src/firebase/config";

type ProductCardProps = {
  image: string;
  title: string;
  price: string;
  category?: string;
  isNew?: boolean;
  isBase64?: boolean;
};

export default function ProductCard({
  image,
  title,
  price,
  category = "Uncategorized",
  isNew = false,
  isBase64 = false,
}: ProductCardProps) {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
    });
    return () => unsubscribe();
  }, []);

  const handleCardClick = () => {
    router.push(`/product/${encodeURIComponent(title)}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!uid) { router.push("/signin"); return; }
    if (added) return;

    setAdded(true);

    const snapshot = await get(ref(db, `carts/${uid}`));
    const data = snapshot.val();

    if (data) {
      const entries = Object.entries(data) as [string, any][];
      const existing = entries.find(([, val]) => val.name === title);
      if (existing) {
        const [existingKey, existingVal] = existing;
        await update(ref(db, `carts/${uid}/${existingKey}`), {
          quantity: existingVal.quantity + 1,
        });
        setTimeout(() => setAdded(false), 2000);
        return;
      }
    }

    // Parse price safely — strip commas and convert
    const numericPrice = Number(String(price).replace(/,/g, "")) || 0;

    await push(ref(db, `carts/${uid}`), {
      name: title,
      price: numericPrice,
      image,
      category,
      quantity: 1,
      seller: "",
      inStock: true,
      color: "",
      size: "",
    });

    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!uid) { router.push("/signin"); return; }
    await set(ref(db, `wishlist/${uid}/${title.replace(/\s+/g, "_")}`), {
      title, price, image, category,
    });
    setWishlisted(true);
    setTimeout(() => setWishlisted(false), 2000);
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-full max-w-sm rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      {/* Use plain <img> for base64, Next Image for file paths */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-gray-100">
        {isBase64 || image.startsWith("data:") ? (
          <img
            src={image}
            alt={title || "Product image"}
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={image || "/placeholder.png"}
            alt={title || "Product image"}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-yellow-200/60 px-3 py-0.5 text-xs font-medium text-yellow-700">
            {category}
          </span>
          {isNew && (
            <span className="rounded-full bg-yellow-200/60 px-3 py-0.5 text-xs font-medium text-yellow-700">
              New
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-800 line-clamp-2">{title}</h3>
        <span className="block text-lg font-bold text-yellow-400">₹{price}</span>

        <hr className="border-gray-200" />

        <div className="flex items-center justify-between">
          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition ${
              added
                ? "bg-green-400 text-white"
                : "bg-yellow-400 text-black hover:bg-yellow-500 hover:scale-105"
            }`}
          >
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
            {added ? "Added!" : "Add to Cart"}
          </button>
          <button
            onClick={handleWishlist}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <Heart
              size={18}
              className={wishlisted ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500 transition"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}