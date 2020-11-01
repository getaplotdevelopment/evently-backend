"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodemailer = require("nodemailer");

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _emailTemplates = require("./emailTemplates");

var _config = require("../../config/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class module to send email
 * @exports
 * @class
 */
class Mailer {
  /**
   * Initialize user and pass
   * @constructor
   * @param {string} _userEmail - User email
   */
  constructor(_userEmail) {
    this.userMail = _userEmail;
    this.senderEmail = _config.email.user;
    this.senderPass = _config.email.pass;
    this.senderPort = _config.email.port;
    this.host = _config.email.host;
  }
  /**
   * Adds a token.
   * @param {string} token token
   * @param {string} template email.
   * @returns {promises} reject or resolve.
   */


  addTokenToEmail(token, template = 'verification') {
    return new Promise(async (resolve, reject) => {
      const mailOptions = _emailTemplates.emailTemplates[template];
      mailOptions.from = this.senderEmail;
      mailOptions.to = this.userMail;
      const addToken = mailOptions.html.replace('$token', token);
      mailOptions.html = addToken;

      try {
        const response = await this.sendEmail(mailOptions);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * Send email
   * @param {Object} mailOptions - Email template
   * @return {Promise} resolve or reject
   */


  sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
      const transporter = _nodemailer2.default.createTransport({
        host: this.host,
        port: this.senderPort,
        secure: false,
        auth: {
          user: this.senderEmail,
          pass: this.senderPass
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(`Email sent: ${info.response}`);
        }
      });
    });
  }

}

exports.default = Mailer;