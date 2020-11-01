"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const token = payload => {
  const generate = _jsonwebtoken2.default.sign(payload, process.env.jwtSecret, {
    expiresIn: '7d'
  });

  return {
    generate
  };
};

exports.default = token;