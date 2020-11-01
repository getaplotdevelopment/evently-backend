"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mailer = require("./mailer");

var _mailer2 = _interopRequireDefault(_mailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sendEmail = (userEmail, token, template = 'verification') => new Promise(async (resolve, reject) => {
  try {
    const mailer = new _mailer2.default(userEmail);
    const response = mailer.addTokenToEmail(token, template);
    resolve(response);
  } catch (error) {
    reject(new Error(`Email failed: ${error.message}`));
  }
});

exports.default = sendEmail;