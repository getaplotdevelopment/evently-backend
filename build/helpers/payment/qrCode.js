"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _qrcode = require("qrcode");

var _qrcode2 = _interopRequireDefault(_qrcode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const generateQRCodeHelper = async text => {
  try {
    const qrCode = await _qrcode2.default.toDataURL(text);
    return qrCode;
  } catch (err) {}
};

exports.default = generateQRCodeHelper;