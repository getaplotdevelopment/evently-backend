"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cloudinary = require("cloudinary");

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _sharp = require("sharp");

var _sharp2 = _interopRequireDefault(_sharp);

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  CLOUD_NAME: cloud_name,
  CLOUD_API_KEY: api_key,
  CLOUD_API_SECRET: api_secret
} = process.env;

exports.default = async file => {
  const buffer = await (0, _sharp2.default)(file).png().toBuffer();

  _cloudinary2.default.config({
    cloud_name,
    api_key,
    api_secret
  });

  const uploadCloudinary = _ => {
    return new Promise((resolve, reject) => {
      _cloudinary2.default.uploader.upload_stream(result => resolve(result)).end(buffer);
    });
  };

  const {
    url
  } = await uploadCloudinary();
  return url;
};