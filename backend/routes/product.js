import express from "express";
import upload, { uploadToS3 } from "../middleware/s3Upload.js";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
const router = express.Router();

 // add this import

 router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/upload", auth, upload.array("images", 3), async (req, res) => {
  try {
    const { category, name, price, description } = req.body;

    const seller = await User.findById(req.user.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const uploadedImages = await Promise.all(
      req.files.map(file => uploadToS3(file))
    );

    const product = new Product({
      category,
      name,
      price,
      description,
      images: uploadedImages,
      sellerId: req.user.id,
      sellerUsername: seller.username,
    });

    await product.save();
    res.status(201).json({ message: "✅ Product uploaded successfully", product });
  } catch (err) {
    console.error("Error uploading product:", err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
