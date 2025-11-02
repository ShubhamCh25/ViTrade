import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Profile = () => {
  const [data, setData] = useState(null);

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
        const updated = await api.get("/user/profile");
        setData(updated.data);
      } catch (err) {
        alert("Error updating request");
      }
    }
  };

  useEffect(() => {
    api
      .get("/user/profile")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to load profile:", err));
  }, []);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  const { user, products, orders } = data;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 py-10">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 px-6">
      <div className="bg-white overflow-hidden shadow rounded-lg border  max-w-md h-min">
          <div className="px-6 py-5 border-b border-gray-200 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 capitalize">
              Your Profile
            </h3>
          </div>
          <div className="divide-y divide-gray-200 max-h-[260px] overflow-hidden border-black">
            <div className="px-6 py-4 grid grid-cols-3">
              <dt className="text-sm font-medium text-gray-500 capitalize">Username</dt>
              <dd className="text-sm text-gray-900 col-span-2 capitalize">
                {user.username}
              </dd>
            </div>
            <div className="px-6 py-4 grid grid-cols-3">
              <dt className="text-sm font-medium text-gray-500 capitalize">Email</dt>
              <dd className="text-sm text-gray-900 col-span-2 capitalize">
                {user.vitmail}
              </dd>
            </div>
            <div className="px-6 py-4 grid grid-cols-3">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="text-sm text-gray-900 col-span-2 capitalize">
                {user.phone}
              </dd>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <section>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Your Uploaded Products
            </h3>
            {products.length === 0 ? (
              <p className="text-gray-500">No products uploaded yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="h-40 w-full object-cover rounded-lg mb-2"
                    />
                    <h4 className="font-semibold text-gray-800 capitalize">Product Title: {p.name}</h4>
                    <p className="capitalize">
                      Category: {p.category}</p>
                    <p className="text-sm mt-1 capitalize">
                      Status: <b>{p.status}</b>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Your Orders</h3>
            {orders.length === 0 ? (
              <p className="text-gray-500">You haven’t placed any orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div
                    key={o._id}
                    className="bg-white p-4 rounded-lg shadow-md border flex justify-between items-center hover:shadow-lg transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{o.productId.name}</p>
                      <p>💰 Offered ₹{o.offeredPrice}</p>
                      <p className="text-sm text-gray-500">
                        {o.comment || "No comment"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEdit(o._id, o.offeredPrice, o.comment)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Edit Order
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
