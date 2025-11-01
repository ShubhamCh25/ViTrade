import express from "express";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ✅ Add to cart
router.post("/add", auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // 1️⃣ Verify product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 2️⃣ Prevent user from adding their own product
    if (product.sellerId.toString() === userId)
      return res.status(400).json({ message: "You cannot add your own product" });

    // 3️⃣ Check if item already in cart
    const existing = await CartItem.findOne({ userId, productId });
    if (existing)
      return res.status(409).json({ message: "Product already in cart" });

    // 4️⃣ Add to cart
    const item = new CartItem({ userId, productId });
    await item.save();

    res.status(201).json({ message: "✅ Added to cart", item });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ View cart
router.get("/", auth, async (req, res) => {
  try {
    const items = await CartItem.find({ userId: req.user.id })
      .populate("productId"); // pulls product details

    res.json(items);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Remove item
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await CartItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "🗑️ Removed from cart" });
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
