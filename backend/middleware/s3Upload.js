import multer from "multer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "path";
import { randomUUID } from "crypto";

dotenv.config();

// Initialize S3 client (SDK v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer will temporarily hold files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload helper function
export const uploadToS3 = async (file) => {
  const ext = path.extname(file.originalname);
  const key = `products/${Date.now()}-${randomUUID()}${ext}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // allows browser access
  };

  await s3.send(new PutObjectCommand(params));

  // Return public S3 URL
  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

export default upload;
