import mongoose from "mongoose";



const productSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  images: [String],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sellerUsername: { type: String, required: true },
  status: { type: String, enum: ["available", "sold"], default: "available" }, // ✅ new field
  createdAt: { type: Date, default: Date.now }
});



export default mongoose.model("Product", productSchema);
