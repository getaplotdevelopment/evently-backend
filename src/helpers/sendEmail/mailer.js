import nodemailer from 'nodemailer';
import { emailTemplates } from './emailTemplates';
import { email } from '../../config/config';

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
    this.senderEmail = email.user;
    this.senderPass = email.pass;
    this.senderPort = email.port;
    this.host = email.host;
  }

  /**
   * Adds a token.
   * @param {string} token token
   * @param {string} template email.
   * @returns {promises} reject or resolve.
   */
  addTokenToEmail(token, template = 'verification') {
    return new Promise(async (resolve, reject) => {
      const mailOptions = emailTemplates[template];
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
      const transporter = nodemailer.createTransport({
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

export default Mailer;
