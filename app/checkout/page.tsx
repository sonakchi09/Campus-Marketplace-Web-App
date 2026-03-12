"use client";

import { useState, useEffect } from "react";
import { ref, push, update, onValue, remove } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/src/firebase/config";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        const cartRef = ref(db, `carts/${user.uid}`);
        const unsubscribeCart = onValue(cartRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setCart(Object.entries(data).map(([id, val]: any) => ({ docId: id, ...val })));
          } else {
            setCart([]);
          }
          setLoading(false);
        });
        return () => unsubscribeCart();
      } else {
        setUid(null);
        setCart([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const shipping = cart.length > 0 ? 50 : 0;
  const total = subtotal + tax + shipping;

  const handlePayment = async () => {
    if (!uid || cart.length === 0) return;
    try {
      const newRef = await push(ref(db, `checkout/${uid}`), {
        items: cart,
        subtotal,
        tax: parseFloat(tax.toFixed(0)),
        shipping,
        total: parseFloat(total.toFixed(0)),
        createdAt: Date.now(),
        status: "paid",
      });

      // Update users itemsBought
      const updates: Record<string, boolean> = {};
      cart.forEach((item) => { updates[item.docId] = true; });
      await update(ref(db, `users/${uid}/itemsBought`), updates);

      // Clear cart after successful payment
      await remove(ref(db, `carts/${uid}`));

      setOrderId(newRef.key);
      setPaid(true);
      alert("Payment Successful!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDownloadReceipt = async () => {
    const jsPDF = (await import("jspdf")).default;
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFillColor(250, 204, 21);
    doc.rect(0, 0, pageW, 40, "F");
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("CampusCart", pageW / 2, 18, { align: "center" });
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Payment Receipt", pageW / 2, 30, { align: "center" });

    y = 55;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    if (orderId) doc.text(`Order ID: ${orderId}`, 15, y);
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, pageW - 15, y, { align: "right" });
    if (auth.currentUser?.email) { y += 8; doc.text(`Email: ${auth.currentUser.email}`, 15, y); }

    y += 14;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y, pageW - 15, y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Item", 15, y);
    doc.text("Qty", 110, y, { align: "center" });
    doc.text("Price", pageW - 15, y, { align: "right" });
    y += 6;
    doc.line(15, y, pageW - 15, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    cart.forEach((item) => {
      doc.text(item.name, 15, y);
      doc.text(`x${item.quantity}`, 110, y, { align: "center" });
      doc.text(`Rs.${(item.price * item.quantity).toLocaleString("en-IN")}`, pageW - 15, y, { align: "right" });
      y += 9;
    });

    y += 4;
    doc.line(15, y, pageW - 15, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text("Subtotal", 15, y);
    doc.text(`Rs.${subtotal.toLocaleString("en-IN")}`, pageW - 15, y, { align: "right" });
    y += 8;
    doc.text("GST (18%)", 15, y);
    doc.text(`Rs.${parseInt(tax.toFixed(0)).toLocaleString("en-IN")}`, pageW - 15, y, { align: "right" });
    y += 8;
    doc.text("Shipping", 15, y);
    doc.text(`Rs.${shipping}`, pageW - 15, y, { align: "right" });
    y += 8;
    doc.line(15, y, pageW - 15, y);
    y += 10;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Total", 15, y);
    doc.text(`Rs.${parseInt(total.toFixed(0)).toLocaleString("en-IN")}`, pageW - 15, y, { align: "right" });

    y += 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("Thank you for shopping on CampusCart!", pageW / 2, y, { align: "center" });

    doc.save(`campuscart-receipt-${orderId ?? Date.now()}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-32 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Checkout</h1>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow space-y-6">
        <h2 className="text-2xl font-bold">Order Summary</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.docId} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
            </div>
          ))
        )}

        <hr />
        <div className="text-right space-y-2">
          <p>Subtotal: ₹{subtotal.toLocaleString("en-IN")}</p>
          <p>GST (18%): ₹{parseInt(tax.toFixed(0)).toLocaleString("en-IN")}</p>
          <p>Shipping: ₹{shipping}</p>
          <h2 className="text-xl font-bold">Total: ₹{parseInt(total.toFixed(0)).toLocaleString("en-IN")}</h2>
        </div>

        <hr />
        <h2 className="text-2xl font-bold">Payment Method</h2>
        <div className="space-y-3">
          <label className="flex gap-3 items-center"><input type="radio" name="payment" defaultChecked />UPI</label>
          <label className="flex gap-3 items-center"><input type="radio" name="payment" />Credit / Debit Card</label>
          <label className="flex gap-3 items-center"><input type="radio" name="payment" />Cash on Delivery</label>
        </div>

        <button
          onClick={handlePayment}
          disabled={cart.length === 0 || paid}
          className="mt-6 w-full bg-yellow-400 py-3 rounded-full font-bold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {paid ? "Paid ✓" : "Pay Now"}
        </button>

        {paid && (
          <button onClick={handleDownloadReceipt} className="w-full border-2 border-yellow-400 text-black py-3 rounded-full font-bold hover:bg-yellow-400 transition">
            Download Receipt
          </button>
        )}
      </div>
    </div>
  );
}