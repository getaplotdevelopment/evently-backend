"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require("../../models/index");

var _index2 = _interopRequireDefault(_index);

var _authHelper = require("../../helpers/authHelper");

var _authHelper2 = _interopRequireDefault(_authHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  User
} = _index2.default;

exports.default = async (req, res, next) => {
  const email = await (0, _authHelper2.default)(req);
  const anyUser = await User.findOne({
    where: {
      email
    }
  });

  if (!anyUser) {
    return res.status(401).json({
      status: 401,
      message: 'You are not connected'
    });
  }

  req.user = anyUser.dataValues;
  next();
};