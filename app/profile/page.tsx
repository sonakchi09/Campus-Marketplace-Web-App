"use client";

export default function ProfilePage() {
  const user = {
    name: "abc",
    email: "abc@email.com",
    phone: "+91 9876543210",
    college: "KIIT University",
    year: "3rd Year",
  };

  const listings = [
    {
      id: "1",
      name: "Engineering Maths Book",
      price: 500,
      status: "Active",
      image: "https://via.placeholder.com/80",
    },
    {
      id: "2",
      name: "Hostel Table Lamp",
      price: 700,
      status: "Sold",
      image: "https://via.placeholder.com/80",
    },
  ];

  const orders = [
    {
      id: "1",
      name: "iPhone 15",
      price: 80000,
      date: "12 Feb 2026",
      image: "https://via.placeholder.com/80",
    },
    {
      id: "2",
      name: "AirPods Pro",
      price: 25000,
      date: "10 Feb 2026",
      image: "https://via.placeholder.com/80",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-32 px-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        My Profile
      </h1>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Profile Card */}
        <div className="bg-white p-8 rounded-xl shadow">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0)}
            </div>

            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p>{user.email}</p>
              <p>{user.phone}</p>
              <p>{user.college}</p>
              <p>{user.year}</p>
            </div>
          </div>
        </div>

        {/* Listings + Orders Side by Side */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* My Listings */}
          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6">My Listings</h2>

            {listings.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4 gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p>₹{item.price}</p>
                  </div>
                </div>

                <span
                  className={`px-4 py-1 rounded-full text-sm ${
                    item.status === "Sold"
                      ? "bg-red-200 text-red-700"
                      : "bg-green-200 text-green-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {/* Order History */}
          <div className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6">Order History</h2>

            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between border-b py-4 gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={order.image}
                    alt={order.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-semibold">{order.name}</h3>
                    <p className="text-sm text-gray-500">
                      {order.date}
                    </p>
                  </div>
                </div>

                <p className="font-bold">₹{order.price}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Logout Button */}
        <div className="text-center">
          <button className="bg-red-500 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}