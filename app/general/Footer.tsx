import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-yellow-400 text-gray-300 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* LEFT SECTION */}
        <div>
          <h2 className="text-xl font-bold text-black mb-4">
            CampusCart
          </h2>

          <p className="mb-6 text-gray-500 leading-relaxed">
            Your one-stop platform for all campus essentials.
            Buy, sell, and exchange items with fellow students
            easily and safely.
          </p>
        </div>

       

        {/* CONTACT SECTION */}
        <div>
          <h3 className="text-black text-lg font-semibold mb-6">
            Contact Us
          </h3>

          <div className="flex items-start gap-3 mb-4">
            <MapPin className="text-yellow-600 mt-1" size={18} />
            <p className="text-gray-500">
              Student Union Building, University Campus,
              Nasarawa State University, Keffi
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-yellow-600" size={18} />
            <p className="text-gray-500">
              official@campusmarketplace.store
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-center items-center text-black text-sm">
        <p>© 2026 CampusCart. All rights reserved.</p>
</div>
    </footer>
  );
}
