"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpError = require("./errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

var _index = require("../models/index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  User
} = _index2.default;

exports.default = async (email, id) => {
  const user = await User.findOne({
    where: {
      email,
      role: 'SUPER USER'
    }
  });
  const {
    dataValues
  } = user;

  if (!user) {
    throw new _httpError2.default(403, "Un-authorized, User role can't perform this action.");
  }

  if (dataValues.id === id) {
    throw new _httpError2.default(403, "Un-authorized, User role can't perform this action.");
  }

  return user;
};