"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cloudinary = require("../../utils/cloudinary");

const cloudinaryUploadPresetHelper = async (image, folder) => {
  const uploadedResponse = await _cloudinary.cloudinary.uploader.upload(image, {
    upload_preset: folder,
    folder: 'QRCodes'
  });
  return uploadedResponse;
};

exports.default = cloudinaryUploadPresetHelper;