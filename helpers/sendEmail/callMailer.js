import Mailer from './mailer';

const sendEmail = (userEmail, token, template = 'verification') =>
  new Promise(async (resolve, reject) => {
    try {
      const mailer = new Mailer(userEmail);
      const response = mailer.addTokenToEmail(token, template);
      resolve(response);
    } catch (error) {
      reject(new Error(`Email failed: ${error.message}`));
    }
  });

export default sendEmail;
