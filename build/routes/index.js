"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _webPush = require("web-push");

var _webPush2 = _interopRequireDefault(_webPush);

var _api = require("./api");

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();
router.use('/api', _api2.default); // Get home page

router.get('/', (_, res) => {
  return res.status(200).json({
    status: 200,
    message: 'Welcome to get a plot'
  });
});
exports.default = router;