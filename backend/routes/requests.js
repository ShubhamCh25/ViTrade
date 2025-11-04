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
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body; // expected: "accepted" or "rejected"

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const request = await OrderRequest.findById(req.params.id)
      .populate("productId", "name price")
      .populate("buyerId", "_id username");

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.sellerId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const buyer = await User.findById(request.buyerId._id);
    const seller = await User.findById(req.user.id);

    if (buyer) {
      buyer.notifications = buyer.notifications || [];
      const baseMessage = `Your order for ${request.productId.name} with price ₹${request.offeredPrice}`;
      const message =
        status === "accepted"
          ? `${baseMessage} has been accepted by seller ${seller.username}. Call seller to finalize deal.`
          : `${baseMessage} has been rejected by seller ${seller.username}.`;
      buyer.notifications.push({
        message,
        read: false,
        createdAt: new Date(),
      });
      await buyer.save();
    }

    if (status === "accepted") {
      request.status = "accepted";
      await request.save();
      return res.json({ message: "✅ Request accepted and buyer notified" });
    }

    // ✅ If rejected, delete it entirely
    await OrderRequest.findByIdAndDelete(req.params.id);
    return res.json({ message: "✅ Request rejected and removed" });
  } catch (err) {
    console.error("Error updating request status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
