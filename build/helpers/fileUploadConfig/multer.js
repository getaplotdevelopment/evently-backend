"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const storage = _multer2.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './');
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb({
      message: 'Unsupported file format'
    }, false);
  }
};

const upload = (0, _multer2.default)({
  storage,
  limits: {
    fileSize: 1024 * 1024
  },
  fileFilter
});
exports.default = upload;