import express from "express";
import upload, { uploadToS3 } from "../middleware/s3Upload.js";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import OrderRequest from "../models/OrderRequest.js";
const router = express.Router();

 
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ status: "available" }).sort({ createdAt: -1 });
    res.json(products);
    console.log(products);
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

router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

  
    await Promise.all(
      product.images.map(async (imageUrl) => {
        try {
          await deleteFromS3(imageUrl);
        } catch (err) {
          console.error("Error deleting from S3:", err);
        }
      })
    );


    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "✅ Product and images deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.patch("/:id/sold", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.sellerId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    // ✅ Update product status to "sold"
    product.status = "sold";
    await product.save();

    // ✅ Find all requests related to this product
    const requests = await OrderRequest.find({ productId: product._id })
      .populate("buyerId", "_id username");

    // ✅ For each request, set status to "rejected" and notify buyer
    for (const reqDoc of requests) {
      reqDoc.status = "rejected";
      await reqDoc.save();

      const buyer = await User.findById(reqDoc.buyerId._id);
      if (buyer) {
        buyer.notifications = buyer.notifications || [];
        buyer.notifications.push({
          message: `Your order for ${product.name} was rejected because the product has been sold.`,
          read: false,
          createdAt: new Date(),
        });
        await buyer.save();
      }
    }

    
    await OrderRequest.deleteMany({ productId: product._id });

    res.json({ message: "✅ Product marked as sold and all related orders rejected" });
  } catch (err) {
    console.error("Error marking product as sold:", err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
