import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Profile = () => {
  const [data, setData] = useState(null);

  // ✅ Edit order logic
  const handleEdit = async (reqId, offeredPrice, comment) => {
    const newPrice = prompt("Enter new offered price:", offeredPrice);
    const newComment = prompt("Edit your comment:", comment);

    if (newPrice !== null) {
      try {
        const res = await api.patch(`/requests/${reqId}`, {
          offeredPrice: newPrice,
          comment: newComment,
        });
        alert(res.data.message);

        // Refresh updated profile data
        const updated = await api.get("/user/profile");
        setData(updated.data);
      } catch (err) {
        alert("❌ Error updating request");
      }
    }
  };

  // ✅ Fetch profile data
  useEffect(() => {
    api
      .get("/user/profile")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to load profile:", err));
  }, []);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  const { user, products, orders } = data;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">👤 Your Profile</h2>

      {/* User Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-3">{user.username}</h3>
        <p>📧 {user.vitmail}</p>
        <p>📞 {user.phone}</p>
      </div>

      {/* Uploaded Products */}
      <section className="mb-10">
        <h3 className="text-2xl font-bold mb-4">📦 Your Uploaded Products</h3>
        {products.length === 0 ? (
          <p className="text-gray-500">No products uploaded yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="h-40 w-full object-cover rounded-lg mb-2"
                />
                <h4 className="font-semibold">{p.name}</h4>
                <p className="text-gray-500">{p.category}</p>
                <p className="text-sm mt-1">
                  Status: <b>{p.status}</b>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Orders */}
      <section>
        <h3 className="text-2xl font-bold mb-4">🛒 Your Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">You haven’t placed any orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{o.productId.name}</p>
                  <p>💰 Offered ₹{o.offeredPrice}</p>
                  <p className="text-sm text-gray-500">
                    {o.comment || "No comment"}
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(o._id, o.offeredPrice, o.comment)} // ✅ fixed req → o
                  className="text-blue-600 hover:underline"
                >
                  Edit Order
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
