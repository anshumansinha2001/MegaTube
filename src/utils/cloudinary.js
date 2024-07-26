import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to extract public ID from URL
const getPublicIdFromUrl = (url) => {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const publicIdWithExtension = pathname
    .substring(1)
    .split("/")
    .slice(1)
    .join("/");
  const publicId = publicIdWithExtension.substring(
    0,
    publicIdWithExtension.lastIndexOf(".")
  );
  return publicId;
};

// Upload an image
export const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    // Upload the file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("file is uploaded on cloudinary ", response.url);

    // Remove the locally saved temporary file
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // Log the error
    console.error("Error uploading to Cloudinary:", error);

    // Remove the locally saved temporary file if it exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return { error: error.message || "An error occurred during the upload" };
  }
};

// Delete an image by URL
export const deleteFromCloudinary = async (url) => {
  if (!url) return null;

  try {
    // Extract the public ID from the URL
    const publicId = getPublicIdFromUrl(url);

    // Delete the file from Cloudinary
    const response = await cloudinary.uploader.destroy(publicId);

    // Check the response for the result
    if (response.result === "ok") {
      // console.log("file is deleted from cloudinary ", publicId);
      return { message: "File deleted successfully" };
    } else {
      // File deletion failed
      return { error: "Failed to delete the file" };
    }
  } catch (error) {
    // Log the error
    console.error("Error deleting from Cloudinary:", error);

    return { error: error.message || "An error occurred during the deletion" };
  }
};
