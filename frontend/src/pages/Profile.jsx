import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Profile = () => {
  const [data, setData] = useState(null);
  const [productIndex, setProductIndex] = useState(0);

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
  const handleMarkSold = async (productId) => {
    const confirmSold = window.confirm("Confirm marking this product as sold?");
    if (!confirmSold) return;
  
    try {
      const res = await api.patch(`/products/${productId}/sold`);
      alert(res.data.message);
  
      const updated = await api.get("/user/profile");
      setData(updated.data);
    } catch (err) {
      console.error("Error marking product as sold:", err);
      alert("Error marking product as sold");
    }
  };
  
  // 🗑️ Delete product
  const handleDelete = async (productId) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      const res = await api.delete(`/products/${productId}`);
      alert(res.data.message);
      const updated = await api.get("/user/profile");
      setData(updated.data);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product");
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

  const prevProduct = () =>
    setProductIndex((productIndex - 1 + products.length) % products.length);
  const nextProduct = () =>
    setProductIndex((productIndex + 1) % products.length);

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-50 w-full p-10">
      <div className="max-w-7xl w-full flex flex-col justify-evenly items-center ">
        {/* Profile Card */}
        <div className="flex w-[90%] p-10 items-start bg-gray-200 rounded-xl">
          <div className="w-1/3">
            <h3 className="text-2xl font-semibold text-gray-800 capitalize text-left">
              Your Profile
            </h3>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg border w-2/3 ">
            <div className="divide-y divide-gray-200 border-black">
              <div className="px-6 py-4 grid grid-cols-3">
                <dt className="text-sm font-medium text-gray-500 capitalize">
                  Username
                </dt>
                <dd className="text-sm text-gray-900 col-span-2 capitalize">
                  {user.username}
                </dd>
              </div>
              <div className="px-6 py-4 grid grid-cols-3">
                <dt className="text-sm font-medium text-gray-500 capitalize">
                  Email
                </dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  {user.vitmail}
                </dd>
              </div>
              <div className="px-6 py-4 grid grid-cols-3">
                <dt className="text-sm font-medium text-gray-500 capitalize">
                  Phone
                </dt>
                <dd className="text-sm text-gray-900 col-span-2">
                  {user.phone}
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Products Section */}
        <div className="flex w-[90%] items-start p-10 rounded-xl m-10 bg-gray-200">
          <div className="w-1/3">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 text-left capitalize">
              Your Uploaded Products
            </h3>
          </div>
          <div className="w-2/3">
            {products.length === 0 ? (
              <p className="text-gray-500 text-left">
                No products uploaded yet.
              </p>
            ) : (
              <div className="relative flex flex-col items-center">
                <div
                  key={products[productIndex]._id}
                  className="relative  bg-white p-10 w-[20vw] h-[60vh] rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
                >
                  {products.length > 1 && (
                    <>
                      <button
                        onClick={prevProduct}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow"
                      >
                        ◀
                      </button>
                      <button
                        onClick={nextProduct}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow"
                      >
                        ▶
                      </button>
                    </>
                  )}
                  <img
                    src={products[productIndex].images?.[0]}
                    alt={products[productIndex].name}
                    className="h-40 w-40 object-cover rounded-lg mb-3"
                  />
                  <p className="text-xl font-semibold text-gray-800 mb-1 capitalize">
                    {products[productIndex].name}
                  </p>
                  <p className="text-gray-600 mb-1 capitalize">
                    Category:{" "}
                    <span className="font-medium">
                      {products[productIndex].category}
                    </span>
                  </p>
                  <p className="text-gray-600 mb-1 capitalize">
                    Price:{" "}
                    <span className="font-medium">
                      ₹{products[productIndex].price}
                    </span>
                  </p>
                  <p
                    className={`capitalize mt-3 inline-block px-4 py-1 rounded-full text-sm font-medium
                    ${
                      products[productIndex].status === "available"
                        ? "bg-green-100 text-green-700"
                        : products[productIndex].status === "sold"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {products[productIndex].status}
                  </p>
                  <div className="flex flex-col items-center space-y-3 mt-4">
  <p className="text-gray-500 text-sm">
    Product {productIndex + 1} of {products.length}
  </p>

  {products[productIndex].status !== "sold" ? (
    <>
      <button
        onClick={() => handleMarkSold(products[productIndex]._id)}
        className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg transition-all"
      >
        Mark as Sold
      </button>
      <button
        onClick={() => handleDelete(products[productIndex]._id)}
        className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg transition-all"
      >
        Delete Product
      </button>
    </>
  ) : (
    <p className="text-green-700 font-semibold">Marked as Sold</p>
  )}
</div>

                </div>

              
          
              </div>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div className="flex w-[90%] p-10 items-start bg-gray-200 rounded-xl">
          <div className="w-1/3">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 text-left capitalize">
              Your Orders
            </h3>
          </div>
          <div className="w-2/3 rounded-2xl">
            {orders.length === 0 ? (
              <p className="text-gray-500 text-left">
               No orders placed.
              </p>
            ) : (
              <div className="space-y-4 bg-white rounded-2xl">
                {orders.map((o) => (
                  <div
                    key={o._id}
                    className="relative p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
                  >
                    <div>
                      <p className="text-xl font-semibold text-gray-800 mb-1 capitalize">
                        {o.productId?.name || "Unknown Product"}
                      </p>

                      <p className="text-gray-600 mb-1 capitalize">
                        Offered Price:{" "}
                        <span className="font-medium">₹{o.offeredPrice}</span>
                      </p>
                      <p className="text-gray-600 mb-1 capitalize">
                        {o.comment || "No comment"}
                      </p>
                      <p
                        className={`capitalize mt-3 inline-block px-4 py-1 text-sm font-medium rounded-full
                        ${
                          o.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : o.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : o.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {o.status || "Pending"}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleEdit(o._id, o.offeredPrice, o.comment)
                      }
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-all"
                    >
                      Edit Order
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex w-[90%] p-10 items-start bg-gray-200 mt-10 rounded-2xl">
  <div className="w-1/3">
    <h3 className="text-2xl font-bold mb-4 text-gray-800 text-left capitalize">
      Notifications
    </h3>
  </div>
  <div className="w-2/3 bg-white rounded-2xl p-6 shadow-inner">
    {data.notifications?.length === 0 ? (
      <p className="text-gray-500">No notifications yet.</p>
    ) : (
      <ul className="space-y-3">
        {[...data.notifications].reverse().map((n, index) => (
       
          <li
            key={index}
            className={`p-3 border rounded-lg ${
              n.read ? "bg-gray-50" : "bg-blue-50"
            }`}
          >
            <p className="text-gray-800">{n.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

      </div>
    </div>
  );
};

export default Profile;
