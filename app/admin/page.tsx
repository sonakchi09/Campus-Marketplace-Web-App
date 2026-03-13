"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle, XCircle, Clock, Package,
  Search, ShoppingBag, AlertCircle, Eye,
} from "lucide-react";
import { ref, onValue, remove, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/src/firebase/config";

const ADMIN_UIDS = [
  "RI1GbI9luNcLsLiMeUkdU5EyjQg1",
  "XvLIPhxcDDaOJ5LXcJG87NE9Ch82",
];

type Status = "pending" | "approved";

type Product = {
  id: string;
  uid: string;
  name: string;
  price: string;
  quantity: string;
  category: string;
  description: string;
  imagePreview: string;
  status: Status;
  sellerId: string;
  sellerEmail: string;
  createdAt: number;
};

const statusConfig: Record<Status, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:  { label: "Pending",  color: "text-amber-600",   bg: "bg-amber-50 border-amber-200",    icon: <Clock size={14} /> },
  approved: { label: "Approved", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: <CheckCircle size={14} /> },
};

export default function AdminPage() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState<Status | "all">("all");
  const [selected, setSelected]     = useState<Product | null>(null);
  const [uid, setUid]               = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Load pending products
  useEffect(() => {
    if (!uid || !ADMIN_UIDS.includes(uid)) return;
    const unsubscribe = onValue(ref(db, "pendingProducts"), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Product[] = [];
        Object.entries(data).forEach(([uid, userProducts]: any) => {
          Object.entries(userProducts).forEach(([id, val]: any) => {
            list.push({ id, uid, ...val });
          });
        });
        setProducts(list);
      } else {
        setProducts([]);
      }
    });
    return () => unsubscribe();
  }, [uid]);

  const approveProduct = async (product: Product) => {
    await set(ref(db, `products/${product.sellerId}/${product.id}`), {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      description: product.description,
      imagePreview: product.imagePreview,
      sellerId: product.sellerId,
      sellerEmail: product.sellerEmail,
      createdAt: product.createdAt,
      status: "approved",
    });
    await remove(ref(db, `pendingProducts/${product.sellerId}/${product.id}`));
    if (selected?.id === product.id) setSelected(null);
  };

  const rejectProduct = async (product: Product) => {
    await remove(ref(db, `pendingProducts/${product.sellerId}/${product.id}`));
    await remove(ref(db, `products/${product.sellerId}/${product.id}`));
    if (selected?.id === product.id) setSelected(null);
  };

  const deleteProduct = async (product: Product) => {
    await remove(ref(db, `pendingProducts/${product.sellerId}/${product.id}`));
    await remove(ref(db, `products/${product.sellerId}/${product.id}`));
    if (selected?.id === product.id) setSelected(null);
  };

  const approveAll = async () => {
    const pending = products.filter((p) => p.status === "pending");
    await Promise.all(pending.map((p) => approveProduct(p)));
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: products.length,
    pending: products.filter((p) => p.status === "pending").length,
    approved: products.filter((p) => p.status === "approved").length,
  };

  // Loading state
  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Loading...
    </div>
  );

  // Access denied
  if (!uid || !ADMIN_UIDS.includes(uid)) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <ShoppingBag size={40} className="text-gray-300" />
      <p className="text-2xl font-bold text-gray-700">Access Denied</p>
      <p className="text-gray-400 text-sm">You don't have permission to view this page.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-yellow-400 flex items-center justify-center shadow">
            <ShoppingBag size={18} className="text-black" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">Campus<span className="text-yellow-400">Cart</span></span>
            <p className="text-xs text-gray-400 leading-none">Admin Panel — Product Approvals</p>
          </div>
        </div>
        {counts.pending > 0 && (
          <button onClick={approveAll} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-semibold px-5 py-2 rounded-full transition-all hover:scale-105 shadow-md shadow-yellow-200">
            <CheckCircle size={15} />
            Approve All Pending ({counts.pending})
          </button>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Uploads",  value: counts.all,      icon: <Package size={20} />,     color: "text-gray-700",    accent: "bg-gray-100"  },
            { label: "Pending Review", value: counts.pending,  icon: <AlertCircle size={20} />, color: "text-amber-600",   accent: "bg-amber-50"  },
            { label: "Approved",       value: counts.approved, icon: <CheckCircle size={20} />, color: "text-emerald-600", accent: "bg-emerald-50" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${stat.accent} flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by product name or category..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "pending", "approved"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all border ${
                  filter === f ? "bg-yellow-400 text-black border-yellow-400 shadow-md shadow-yellow-100" : "bg-white text-gray-600 border-gray-200 hover:border-yellow-300"
                }`}
              >
                {f === "all" ? `All (${counts.all})` : `${f} (${counts[f as Status]})`}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY STATE */}
        {products.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <Package size={40} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-1">No products to approve</h3>
            <p className="text-gray-400 text-sm">When sellers submit products, they'll appear here for review.</p>
          </div>
        )}

        {/* TABLE + DETAIL PANEL */}
        {products.length > 0 && (
          <div className="flex gap-6">
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                      <th className="text-left px-5 py-3">Product</th>
                      <th className="text-left px-5 py-3">Category</th>
                      <th className="text-left px-5 py-3">Price</th>
                      <th className="text-left px-5 py-3">Qty</th>
                      <th className="text-left px-5 py-3">Seller</th>
                      <th className="text-left px-5 py-3">Status</th>
                      <th className="text-left px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-12 text-gray-400">No products match your search</td></tr>
                    ) : (
                      filtered.map((product) => {
                        const st = statusConfig[product.status] ?? statusConfig["pending"];
                        return (
                          <tr key={product.id} onClick={() => setSelected(product)}
                            className={`border-b border-gray-50 hover:bg-yellow-50/40 transition-colors cursor-pointer ${selected?.id === product.id ? "bg-yellow-50" : ""}`}
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                {product.imagePreview ? (
                                  <img src={product.imagePreview} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Package size={16} className="text-gray-300" /></div>
                                )}
                                <span className="font-semibold text-gray-800">{product.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-gray-500">{product.category || "—"}</td>
                            <td className="px-5 py-3.5 font-bold text-gray-800">₹{Number(product.price).toLocaleString("en-IN")}</td>
                            <td className="px-5 py-3.5 text-gray-500">{product.quantity ?? "—"}</td>
                            <td className="px-5 py-3.5 text-gray-500 text-xs">{product.sellerEmail ?? "—"}</td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${st.color} ${st.bg}`}>
                                {st.icon}{st.label}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => approveProduct(product)} className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition" title="Approve">
                                  <CheckCircle size={16} />
                                </button>
                                <button onClick={() => rejectProduct(product)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition" title="Reject">
                                  <XCircle size={16} />
                                </button>
                                <button onClick={() => setSelected(product)} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 transition" title="View Details">
                                  <Eye size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {selected && (
              <div className="w-72 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 self-start sticky top-24">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Product Details</h3>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
                </div>
                {selected.imagePreview ? (
                  <img src={selected.imagePreview} alt={selected.name} className="w-full h-40 object-cover rounded-xl border border-gray-100" />
                ) : (
                  <div className="w-full h-40 rounded-xl bg-gray-100 flex items-center justify-center"><Package size={36} className="text-gray-300" /></div>
                )}
                <div>
                  <p className="text-lg font-bold text-gray-900">{selected.name}</p>
                  <p className="text-xs text-gray-400">{selected.category} · Qty: {selected.quantity ?? "—"}</p>
                  <p className="text-xs text-gray-400 mt-1">{selected.sellerEmail ?? "—"}</p>
                </div>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">{selected.description || "No description provided."}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price</span>
                  <span className="font-bold text-yellow-500">₹{Number(selected.price).toLocaleString("en-IN")}</span>
                </div>
                <div className={`flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-xl border ${statusConfig[selected.status]?.color} ${statusConfig[selected.status]?.bg}`}>
                  {statusConfig[selected.status]?.icon}{statusConfig[selected.status]?.label}
                </div>
                <button onClick={() => approveProduct(selected)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2.5 rounded-xl transition hover:scale-105 flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> Approve Product
                </button>
                <button onClick={() => rejectProduct(selected)} className="w-full bg-red-50 hover:bg-red-100 text-red-500 font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 border border-red-100">
                  <XCircle size={16} /> Reject Product
                </button>
                <button onClick={() => deleteProduct(selected)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                  🗑 Delete Product
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}