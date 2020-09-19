/* eslint-disable no-constant-condition */
import dotenv from 'dotenv/config';

const html = (title, action, body, role, urls) => {
  let url;
  if (action === 'RESET PASSWORD') {
    if (role === 'SUPER USER') {
      url =
        process.env.NODE_ENV === 'production'
          ? `${process.env.FRONTEND_PRODUCTION_URL}admin/auth/reset-password?token=$token`
          : `${process.env.FRONTEND_APP_URL}admin/auth/reset-password?token=$token`;
    } else {
      url = `${urls.redirect}/redirect?url=${urls.appUrl}&token=$token`;
    }
  } else if (
    action === 'CANCEL EVENT' ||
    'EVENT POSTPONED' ||
    'EVENT PAUSED' ||
    'EVENT RESUMED'
  ) {
    url = '';
    action = 'learn more';
  } else {
    url = `${urls.redirect}/redirect?url=${urls.appUrl}&token=$token`;
  }

  const secondAction = action.toLowerCase();
  const htmlTemp = `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./style.css">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700&display=swap" rel="stylesheet">
    <style>
    .main {
        margin: 0 auto;
        text-align: center;
        width: 30rem;
        color: rgba(0, 0, 0, 0.76);
        font-family: 'Montserrat', sans-serif;
      }
      .header {
        display: flex;
        padding-top: 1.5rem;
      }
      .header h1 {
        font-size: 2.8rem;
        margin-top: 0rem;
        padding-bottom: 2.5rem;
        border-bottom: rgba(0, 0, 0, 0.192) 1px solid;
      }
      .logo {
        width: 2rem;
        height: 2.4rem;
        /* margin-left: 3.5rem; */
        margin-top: 0.5rem;
      }
      .logo img {
        width: 100%;
        height: 100%;
      }
      .body {
        color: rgba(0, 0, 0, 0.623);
      }
      .body p {
        font-size: 0.9rem;
      }
      
      .button {
        margin: 0 auto;
  margin-top: 2rem;
  width: 12rem;
  height: 2rem;
  text-align: center;
  padding-top: 0.9rem;

  background-color: #174eacc7;
  border-radius: 2rem;

  transition: ease-in-out 0.4s;
      }
      .button a {
        text-decoration: none;
        color: #fff;
        font-size: 0.7rem;
      }
      .button:hover {
        cursor: pointer;
        transform: scale(1.1);
        background-color: #174dac;
      }
      .footer {
        margin-top: 3rem;
        height: 10rem;
        background: linear-gradient(
            90deg,
            #ffffff -352.71%,
            rgba(255, 255, 255, 0) 104.51%
          ),
          #f2f3f5;
        padding: 1rem;
        color: rgba(0, 0, 0, 0.76);
      }
      .footer p {
        color: rgba(0, 0, 0, 0.76);
        font-size: 0.8rem;
      }
      .footer a {
        color: #174dac;
        outline: none;
      }
      
    </style>

</head>

<body>
    <div class="main">
        <div class="header">
            <div class="logo">
                <img src="./img/logo.png" alt="">
            </div>
            <div>
                <h1>${title}</h1>
            </div>

        </div>
        <div class="body">
            <p>
                You are receiving this e-mail because ${body} .
            </p>
            <p>Please click on the button below to ${secondAction}</p>

            <div class="button">
               <a href="${url}">
                    ${action}
                </a>
              </div>
        </div>
        <div class="footer">
            <h2>Evently</h2>
            <p> For any other concern, we will be happy to help you. Do not hesitate to contact the
                <a href="">Help service center</a>
            </p>
        </div>

    </div>
</body>

</html>
  `;

  return htmlTemp;
};

export default html;
