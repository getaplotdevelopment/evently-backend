"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require("sequelize");

var _httpError = require("./errorsHandler/httpError");

var _httpError2 = _interopRequireDefault(_httpError);

var _index = require("../models/index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  User,
  Roles
} = _index2.default;

exports.default = async (condition, condition2) => {
  const user = await User.findOne({
    where: {
      [_sequelize.Op.and]: [condition, {
        [_sequelize.Op.or]: condition2
      }]
    }
  });

  if (!user) {
    throw new _httpError2.default(403, "Un-authorized, User role can't perform this action.");
  }

  return user;
};