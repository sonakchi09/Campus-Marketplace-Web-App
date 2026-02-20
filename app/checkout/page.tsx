"use client";

export default function CheckoutPage() {
  const cart = [
    { id: "1", name: "iPhone 15", price: 80000, quantity: 1 },
    { id: "2", name: "AirPods Pro", price: 25000, quantity: 2 },
  ];

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.18;
  const shipping = 50;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-32 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        Checkout
      </h1>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow space-y-6">

        <h2 className="text-2xl font-bold">Order Summary</h2>

        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between"
          >
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}

        <hr />

        <div className="text-right space-y-2">
          <p>Subtotal: ₹{subtotal}</p>
          <p>GST (18%): ₹{tax.toFixed(0)}</p>
          <p>Shipping: ₹{shipping}</p>
          <h2 className="text-xl font-bold">
            Total: ₹{total.toFixed(0)}
          </h2>
        </div>

        <hr />

        <h2 className="text-2xl font-bold">Payment Method</h2>

        <div className="space-y-3">
          <label className="flex gap-3 items-center">
            <input type="radio" name="payment" defaultChecked />
            UPI
          </label>

          <label className="flex gap-3 items-center">
            <input type="radio" name="payment" />
            Credit / Debit Card
          </label>

          <label className="flex gap-3 items-center">
            <input type="radio" name="payment" />
            Cash on Delivery
          </label>
        </div>

        <button
          onClick={() => alert("Payment Successful!")}
          className="mt-6 w-full bg-yellow-400 py-3 rounded-full font-bold hover:scale-105 transition"
        >
          Pay Now
        </button>

      </div>
    </div>
  );
}