"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

require("dotenv/config");

var _redisClient = require("../../helpers/logout/redisClient");

var _httpError = require("../../helpers/errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-nested-ternary */
const checkToken = async (req, res, next) => {
  const token = req.body.token ? req.body.token : req.query.token ? req.query.token : req.headers.authorization ? req.headers.authorization.split(' ')[1] : req.params.token ? req.params.token : null;

  if (!token) {
    throw new _httpError2.default(401, 'Token is required');
  }

  _jsonwebtoken2.default.verify(token, process.env.jwtSecret, (err, res) => {
    if (err) {
      throw new _httpError2.default(403, err);
    }
  });

  const invalid = callback => {
    _redisClient.redisClient.lrange('token', 0, 999999999, (err, result) => callback(result));
  };

  invalid(result => {
    if (result.indexOf(token) > -1) {
      return res.status(401).json({
        status: 401,
        message: 'Invalid token'
      });
    }

    next();
  });
};

exports.default = checkToken;