"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passportGoogleOauth = require("passport-google-oauth20");

var _passportGoogleOauth2 = _interopRequireDefault(_passportGoogleOauth);

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  APP_URL,
  PRODUCTION_URL
} = process.env;
const url = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : APP_URL;
const googleStrategy = new _passportGoogleOauth2.default({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${url}/api/users/login/google/redirect`,
  profileFields: ['id', 'displayName', 'photos', 'email']
}, (accessToken, refreshToken, profile, done) => {
  const userGoogle = {
    username: profile.displayName,
    isActivated: true
  };
  done(null, userGoogle);
});
exports.default = googleStrategy;