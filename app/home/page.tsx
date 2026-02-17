import { LogIn } from "lucide-react";
import Link from "next/link";

export default function HomeSection() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-4xl text-center">
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-black">
          <span className="bg-yellow-400 px-3 py-1 inline-block">
            BUY & SELL
          </span>{" "}
          WITHIN YOUR
          <br className="hidden sm:block" />
          CAMPUS
        </h1>

        <p className="mt-6 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          CampusCart helps students trade books, electronics,
          hostel items and more — safely inside campus.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          
          {/* SIGN IN Button */}
         <Link
  href="/signin"
  className="flex items-center justify-center gap-2
             bg-yellow-400 text-black 
             px-8 py-3 rounded-full 
             font-extrabold 
             hover:scale-105 transition 
             w-full sm:w-auto"
>
  <LogIn size={18} />
  SIGN IN
</Link>


          {/* Explore Products Button */}
          <Link
            href="/products"
            className="border-2 border-yellow-400 text-yellow-400 px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 hover:text-black transition w-full sm:w-auto text-center"
          >
            Explore Products
          </Link>

        </div>

      </div>
    </div>
  );
}
