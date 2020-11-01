"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require("lodash.random");

var _lodash2 = _interopRequireDefault(_lodash);

var _slugify = require("slugify");

var _slugify2 = _interopRequireDefault(_slugify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = item => {
  return `${(0, _slugify2.default)(item)}-${(0, _lodash2.default)(10000, 20000)}`;
};