import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
const { CloudinaryStorage } = await import('multer-storage-cloudinary');

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "car-rentals",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    transformation: [{ width: 1200, height: 800, crop: "limit" }],
  },
});

export { cloudinary, storage };

