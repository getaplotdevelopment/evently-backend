"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passportFacebook = require("passport-facebook");

var _passportFacebook2 = _interopRequireDefault(_passportFacebook);

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  APP_URL,
  PRODUCTION_URL
} = process.env;
const url = process.env.NODE_ENV === 'production' ? PRODUCTION_URL : APP_URL;
const fbStrategy = new _passportFacebook2.default({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: `${url}/api/users/login/facebook/redirect`,
  profileFields: ['id', 'displayName', 'photos', 'email']
}, (accessToken, refreshToken, profile, done) => {
  const userFacebook = {
    email: profile._json.email,
    username: profile._json.name,
    isActivated: true
  };
  done(null, userFacebook);
});
exports.default = fbStrategy;