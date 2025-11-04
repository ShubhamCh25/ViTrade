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
      .populate("buyerId", "username vitReg vitmail phone")
      .populate("productId", "name images price")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Edit existing request
// ✅ Update request status (accept/reject)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const request = await OrderRequest.findById(req.params.id)
      .populate("buyerId", "username notifications")
      .populate("productId", "name sellerUsername sellerId price");

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    if (request.sellerId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    request.status = status;
    await request.save();

    const buyer = await User.findById(request.buyerId._id);
    const seller = await User.findById(req.user.id);

    if (buyer && seller) {
      let message = "";

      if (status === "accepted") {
        message = `Your order for ${request.productId.name} (₹${request.offeredPrice}) has been accepted by ${seller.username}. Call them at ${seller.phone} to finalize the deal.`;
      } else if (status === "rejected") {
        message = `Your order for ${request.productId.name} (₹${request.offeredPrice}) has been rejected by the seller ${seller.username}.`;
      }

      buyer.notifications.push({
        message,
        read: false,
        createdAt: new Date(),
      });
      await buyer.save();
    }

    res.json({ message: `Request ${status} successfully.` });
  } catch (err) {
    console.error("Error updating request status:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
