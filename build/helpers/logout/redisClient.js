"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redisClient = undefined;

var _redis = require("redis");

var _redis2 = _interopRequireDefault(_redis);

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const redisClient = exports.redisClient = _redis2.default.createClient(process.env.REDIS_URL, {
  no_ready_check: true
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});
redisClient.on('error', error => {
  console.log('Redis not connected', error);
});