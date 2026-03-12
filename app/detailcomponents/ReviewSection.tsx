"use client";

export default function ReviewSection() {
  return (
    <div className="mt-16">

      {/* TITLE */}
      <h2 className="text-2xl font-semibold mb-6">
        Customer Reviews
      </h2>

      {/* WRITE REVIEW */}
      <div className="flex items-center gap-4 mb-10">

        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
          N
        </div>

        <input
          type="text"
          placeholder="Write your review..."
          className="flex-1 border rounded-lg px-4 py-2 outline-none"
        />

        <button className="bg-yellow-400 px-10 py-2 rounded-lg font-medium hover:bg-yellow-500">
          Submit
        </button>

      </div>

      {/* SAMPLE REVIEW */}
      <div className="mt-8">

        <div className="flex items-start gap-4">

          <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
            S
          </div>

          <div>

            <p className="font-semibold">
              Shivani
            </p>

            <p className="text-sm text-gray-500">
              25 February 2026
            </p>

            <p className="mt-2 text-gray-700 max-w-2xl">
              The product quality is really good and exactly as described.
              Delivery was quick and packaging was proper. Definitely worth buying.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}