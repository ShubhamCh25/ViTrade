import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Cart = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get("/cart")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching cart:", err));
  }, []);

  const removeItem = async (id) => {
    if (!confirm("Remove item from cart?")) return;
    try {
      await api.delete(`/cart/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const orderItem = async (product) => {
    if (!confirm("Confirm order for this product?")) return;
    try {
      const res = await api.post("/requests", {
        productId: product._id,
        offeredPrice: product.price,
      });
      alert(res.data.message);
      // Remove from cart after order
      setItems((prev) => prev.filter((i) => i.productId._id !== product._id));
      await api.delete(`/cart/${product._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Your Cart</h2>
          <p className="text-gray-500">Review and manage your selected items</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <p className="text-gray-600 text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-gray-400 mt-2">
              Start adding items to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 flex flex-col md:flex-row items-center justify-between"
              >
                {/* Left Section */}
                <div className="flex items-center space-x-6 w-full md:w-2/3">
                  <img
                    src={item.productId.images?.[0]}
                    alt={item.productId.name}
                    className="w-28 h-28 object-cover rounded-xl border border-gray-200"
                  />
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 capitalize mb-1">
                      {item.productId.name}
                    </h3>
                    <p className="text-gray-500 text-sm capitalize">
                      Category: {item.productId.category}
                    </p>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col space-y-3 text-right mt-6 md:mt-0">
                  <p className="text-gray-600 text-sm">
                    Seller:{" "}
                    <span className="font-medium text-gray-800 capitalize">
                      {item.productId.sellerUsername}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    Price:{" "}
                    <span className="font-semibold text-green-600">
                      ₹{item.productId.price}
                    </span>
                  </p>

                  <div className="flex justify-end gap-3 mt-2">
                    <button
                      onClick={() => orderItem(item.productId)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
                    >
                      Order Now
                    </button>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
