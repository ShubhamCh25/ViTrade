import express from "express";
import auth from "../middleware/auth.js";
import Cart from "../models/CartItem.js";
import Product from "../models/Product.js";
const router = express.Router();

// ✅ Fetch user's cart (only available products)
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.user.id })
      .populate("productId", "name category price images status sellerUsername");

    // Remove sold products automatically
    const soldItems = cart.filter((c) => c.productId?.status === "sold");
    if (soldItems.length > 0) {
      const ids = soldItems.map((r) => r._id);
      await Cart.deleteMany({ _id: { $in: ids } });
    }

    // Return only available products
    const available = cart.filter((c) => c.productId?.status === "available");
    res.json(available);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add to cart
router.post("/add", auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.status === "sold")
      return res.status(400).json({ message: "Product unavailable" });

    // Prevent user from adding their own product
    if (product.sellerId.toString() === userId)
      return res.status(400).json({ message: "You cannot add your own product" });

    const existing = await Cart.findOne({ userId, productId });
    if (existing)
      return res.status(400).json({ message: "Already in cart" });

    const cartItem = new Cart({ userId, productId });
    await cartItem.save();

    res.status(201).json({ message: "Added to cart", cartItem });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Remove from cart
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("Error removing cart item:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
