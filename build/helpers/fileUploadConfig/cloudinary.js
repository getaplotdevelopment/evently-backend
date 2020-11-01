"use strict";

var _cloudinary = require("cloudinary");

var _cloudinary2 = _interopRequireDefault(_cloudinary);

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable camelcase */
const {
  CLOUD_NAME: cloud_name,
  CLOUD_API_KEY: api_key,
  CLOUD_API_SECRET: api_secret
} = process.env;

_cloudinary2.default.config({
  cloud_name,
  api_key,
  api_secret
});

exports.uploads = (file, folder) => {
  return new Promise(resolve => {
    _cloudinary2.default.uploader.upload(file, result => {
      resolve({
        url: result.url,
        id: result.public_id
      });
    }, {
      resource_type: 'auto',
      folder
    });
  });
};