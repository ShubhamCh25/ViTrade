import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Cart = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/cart")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching cart:", err));
  }, []);

  const removeItem = async (id) => {
    if (!confirm("Remove item from cart?")) return;
    await api.delete(`/cart/${id}`);
    setItems(items.filter((i) => i._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            🛒 Your Cart
          </h2>
          <p className="text-muted-foreground">Review your selected items</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-lg p-12 text-center border border-border">
            <div className="text-6xl mb-4 opacity-30">🛒</div>
            <p className="text-muted-foreground text-lg">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-2">Start adding items to see them here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="group bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-border hover:border-primary/30"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl text-foreground mb-1">
                      {item.productId.name}
                    </h3>
                    <p className="text-sm text-muted-foreground inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                      {item.productId.category}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground px-6 py-2.5 rounded-lg transition-all duration-200 font-medium border border-destructive/20 hover:border-destructive"
                  >
                    Remove
                  </button>
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
