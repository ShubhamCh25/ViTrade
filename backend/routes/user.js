import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Request from "../models/OrderRequest.js";

const router = express.Router();

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    const products = await Product.find({ sellerId: req.user.id });
    const orders = await Request.find({ buyerId: req.user.id })
      .populate("productId", "name category price images sellerUsername");

    res.json({ user, products, orders });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
