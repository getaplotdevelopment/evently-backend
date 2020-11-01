"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _authHelper = require("../../helpers/authHelper");

var _authHelper2 = _interopRequireDefault(_authHelper);

var _authStrategy = require("../../helpers/authStrategy");

var _authStrategy2 = _interopRequireDefault(_authStrategy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async (req, res, next) => {
  const email = await (0, _authHelper2.default)(req);
  const condition = {
    email
  };
  const condition2 = {
    role: 'SUPER USER'
  };
  const superUser = await (0, _authStrategy2.default)(condition, condition2);
  const {
    dataValues
  } = superUser;
  req.superUser = dataValues;
  next();
};