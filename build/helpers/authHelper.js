"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

require("dotenv/config");

var _httpError = require("./errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async req => {
  const token = req.header('Authorization');

  if (!token) {
    throw new _httpError2.default(401, 'Token is required');
  }

  const {
    email
  } = _jsonwebtoken2.default.verify(token.split(' ')[1], process.env.jwtSecret);

  return email;
};