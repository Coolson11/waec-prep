import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  const missing = [];
  if (!cloudName) missing.push("CLOUDINARY_CLOUD_NAME");
  if (!apiKey) missing.push("CLOUDINARY_API_KEY");
  if (!apiSecret) missing.push("CLOUDINARY_API_SECRET");
  
  console.error(`Missing Cloudinary environment variables: ${missing.join(", ")}`);
  // We don't throw here to avoid breaking the whole app if not using Cloudinary, 
  // but we should warn.
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export async function uploadToCloudinary(file: string, folder: string = "waec-prep") {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not properly configured. Missing environment variables.");
  }

  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: "raw",
      type: "upload",
      access_mode: "public",
      // If the user has an upload preset they want to use for server-side uploads:
      upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET,
    });
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

export default cloudinary;
