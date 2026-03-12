"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import ReviewSection from "@/app/detailcomponents/ReviewSection";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function ProductPage() {
    const params = useParams();
    const title = params.title as string;

    const [wishlisted, setWishlisted] = useState(false);

    return (
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-32">

            {/* PRODUCT SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

                {/* IMAGE */}
                <div className="flex justify-center">
                    <div className="w-full max-w-md h-[380px] border rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                        <Image
                            src="/laptop.jpg"
                            alt={title}
                            width={500}
                            height={380}
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* DETAILS */}
                <div className="space-y-6">

                    <h1 className="text-3xl font-semibold mt-12">
                        {title}
                    </h1>

                    <div className="flex items-center gap-2 text-yellow-500">
                        ⭐⭐⭐⭐☆
                        <span className="text-gray-500 text-sm">(124 reviews)</span>
                    </div>

                    <p className="text-4xl font-bold text-yellow-500">
                        ₹20,000
                    </p>

                    <p className="text-gray-600 leading-relaxed max-w-lg">
                        This is a sample description of the product. You can store real
                        descriptions later in database.
                    </p>

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

                        {/* WISHLIST HEART */}
                        <button
                            onClick={() => setWishlisted(!wishlisted)}
                            className="p-2 hover:scale-110 transition"
                        >
                            <button
                                onClick={() => setWishlisted(!wishlisted)}
                                className="p-2 hover:scale-110 transition"
                            >
                                <Heart
                                    size={24}
                                    className={`transition ${wishlisted ? "text-red-500 fill-red-500" : "text-black"}`}
                                />
                            </button>
                        </button>

                    </div>

                </div>

            </div>

            {/* REVIEWS */}
            <div className="mt-40 pt-16">
                <ReviewSection />
            </div>

        </div>
    );
}