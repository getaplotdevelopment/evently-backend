/* eslint-disable camelcase */
import cloudinary from 'cloudinary';
import 'dotenv/config';

const {
  CLOUD_NAME: cloud_name,
  CLOUD_API_KEY: api_key,
  CLOUD_API_SECRET: api_secret
} = process.env;

cloudinary.config({
  cloud_name,
  api_key,
  api_secret
});

exports.uploads = (file, folder) => {
  return new Promise(resolve => {
    cloudinary.uploader.upload(
      file,
      result => {
        resolve({
          url: result.url,
          id: result.public_id
        });
      },
      {
        resource_type: 'auto',
        folder
      }
    );
  });
};
