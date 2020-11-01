"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatMessage = undefined;

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const formatMessage = (username, text) => {
  return {
    username,
    text,
    time: (0, _moment2.default)().format('h:m:a')
  };
};

exports.formatMessage = formatMessage;