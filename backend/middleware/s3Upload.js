import multer from "multer";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "path";
import { randomUUID } from "crypto";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadToS3 = async (file) => {
  const ext = path.extname(file.originalname);
  const key = `products/${Date.now()}-${randomUUID()}${ext}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  await s3.send(new PutObjectCommand(params));

  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};



export const deleteFromS3 = async (fileUrl) => {
  const bucket = process.env.S3_BUCKET_NAME;

  // Match both regional and non-regional S3 URLs
  const regex = new RegExp(`https://${bucket}\\.s3[.-][a-z0-9-]+\\.amazonaws\\.com/(.+)`);
  const match = fileUrl.match(regex);

  if (!match || !match[1]) {
    console.error("❌ Invalid S3 URL format:", fileUrl);
    throw new Error("Invalid S3 file URL");
  }

  const key = match[1]; // Extracts the part after the domain (e.g. products/...jpg)

  try {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    console.log(`✅ Deleted from S3: ${key}`);
  } catch (err) {
    console.error("Error deleting from S3:", err);
    throw err;
  }
};


export default upload;
