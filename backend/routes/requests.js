import express from "express";
import auth from "../middleware/auth.js";
import Product from "../models/Product.js";
import OrderRequest from "../models/OrderRequest.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Create new order request (user can only order once per product)
router.post("/", auth, async (req, res) => {
  try {
    const { productId, offeredPrice, comment } = req.body;

    // Check if this buyer already requested this product
    const existing = await OrderRequest.findOne({
      buyerId: req.user.id,
      productId,
    });

    if (existing) {
      return res.status(400).json({
        message:
          "You’ve already placed a request for this product. You can edit it from your profile.",
      });
    }

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Create new order request
    const request = new OrderRequest({
      buyerId: req.user.id,
      productId,
      offeredPrice,
      comment,
      sellerId: product.sellerId, // for seller visibility
    });

    await request.save();
    res.status(201).json({ message: "✅ Order request submitted", request });
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Seller views incoming requests (sorted by offered price)
router.get("/incoming", auth, async (req, res) => {
  try {
    const requests = await OrderRequest.find({ sellerId: req.user.id })
      .populate("productId", "name category price images")
      .populate("buyerId", "username vitReg phone vitmail")
      .sort({ offeredPrice: -1 });

    res.json(requests);
  } catch (err) {
    console.error("Error fetching incoming requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Edit existing request
router.patch("/:id", auth, async (req, res) => {
  try {
    const { offeredPrice, comment } = req.body;

    const request = await OrderRequest.findOne({
      _id: req.params.id,
      buyerId: req.user.id,
    });

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    request.offeredPrice = offeredPrice ?? request.offeredPrice;
    request.comment = comment ?? request.comment;

    await request.save();

    res.json({ message: "✅ Order request updated", request });
  } catch (err) {
    console.error("Error updating request:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
