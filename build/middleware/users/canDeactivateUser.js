"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _authHelper = require("../../helpers/authHelper");

var _authHelper2 = _interopRequireDefault(_authHelper);

var _authStrategy = require("../../helpers/authStrategy");

var _authStrategy2 = _interopRequireDefault(_authStrategy);

var _shouldDeactivateUser = require("../../helpers/shouldDeactivateUser");

var _shouldDeactivateUser2 = _interopRequireDefault(_shouldDeactivateUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async (req, res, next) => {
  const {
    id
  } = req.body;
  const email = await (0, _authHelper2.default)(req);
  const condition = {
    email,
    role: 'SUPER USER'
  };
  const condition2 = {
    email
  };
  const superUser = await (0, _authStrategy2.default)(condition, condition2);
  await (0, _shouldDeactivateUser2.default)(email, id);
  req.user = superUser.dataValues;
  next();
};