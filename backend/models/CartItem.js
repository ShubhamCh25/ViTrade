// backend/models/CartItem.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now }
});

export default mongoose.model("CartItem", cartItemSchema);
