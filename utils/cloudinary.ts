import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({
  path: './.env'
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    });
    fs.unlinkSync(localFilePath); // remove local file
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove local file
    return null;
  }
};

export { uploadOnCloudinary };
