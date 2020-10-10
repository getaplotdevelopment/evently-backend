import 'dotenv/config';

const cloudinary = require('cloudinary').v2;

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

module.exports = { cloudinary };
