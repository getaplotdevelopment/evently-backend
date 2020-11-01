"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _passportFacebook = require("./passport-facebook");

var _passportFacebook2 = _interopRequireDefault(_passportFacebook);

var _passportGoogle = require("./passport-google");

var _passportGoogle2 = _interopRequireDefault(_passportGoogle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get user information from the strategy and then pass it to serialize class
 */
class Authentication {
  /**
   * Authentication constructor
   */
  constructor() {
    this.facebook = _passport2.default.use(_passportFacebook2.default);
    this.google = _passport2.default.use(_passportGoogle2.default);
  }

}

exports.default = Authentication;