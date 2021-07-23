import cloudinary from 'cloudinary';
import sharp from 'sharp';
import 'dotenv/config';

const {
  CLOUD_NAME: cloud_name,
  CLOUD_API_KEY: api_key,
  CLOUD_API_SECRET: api_secret
} = process.env;

export default async file => {
  const buffer = await sharp(file)
    .png()
    .toBuffer();

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret
  });

  const uploadCloudinary = _ => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(result => resolve(result)).end(buffer);
    });
  };
  const { url } = await uploadCloudinary();
  return url;
};
