const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const getAccessToken = async () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENTID,
    process.env.OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });   

  const accessToken = await oAuth2Client.getAccessToken();
  return accessToken;
};

const sendEmail = async (to, subject, text, html) => {
  const accessToken = await getAccessToken();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html: html || text, // Fallback to text if no HTML provided
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Generates a styled HTML email for registration confirmation
 * @param {string} name - User's name
 * @param {string} login - User's login
 * @param {string} password - User's password
 * @param {string} websiteUrl - URL to the school website
 * @returns {string} HTML content for the email
 */
const generateRegistrationEmail = (name, login, password, websiteUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Добро пожаловать в нашу школу!</title>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Roboto', sans-serif;
          line-height: 1.6;
          color: #212121;
          background-color: #F5F5F5;
          margin: 0;
          padding: 0;
        }
        .card {
          max-width: 500px;
          margin: 20px auto;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .header h1 {
          font-family: 'Montserrat', sans-serif;
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }
        .content {
          padding: 20px;
        }
        .welcome-text {
          text-align: center;
          margin-bottom: 25px;
        }
        .info-box {
          background-color: #F5F5F5;
          border-left: 4px solid #4CAF50;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 0 4px 4px 0;
        }
        .info-box-title {
          font-family: 'Montserrat', sans-serif;
          color: #388E3C;
          font-weight: 600;
          margin: 0 0 5px 0;
          font-size: 16px;
        }
        .info-box-content {
          font-family: 'Roboto', sans-serif;
          color: #212121;
          margin: 0;
          font-size: 18px;
          word-break: break-all;
        }
        .website-button {
          display: block;
          background-color: #FFC107;
          color: #212121;
          text-decoration: none;
          text-align: center;
          padding: 12px 20px;
          border-radius: 4px;
          margin: 25px auto 15px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          width: 200px;
          transition: background-color 0.3s;
        }
        .website-button:hover {
          background-color: #FFA000;
        }
        .footer {
          background-color: #C8E6C9;
          padding: 15px;
          text-align: center;
          font-size: 14px;
          color: #757575;
        }
        .note {
          font-size: 13px;
          color: #757575;
          text-align: center;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Добро пожаловать в нашу школу!</h1>
        </div>
        <div class="content">
          <p class="welcome-text">Здравствуйте, <strong>${name}</strong>! Поздравляем с успешной регистрацией в нашей школе. Ниже приведены ваши данные для входа в систему:</p>
          
          <div class="info-box">
            <p class="info-box-title">Логин:</p>
            <p class="info-box-content">${login}</p>
          </div>
          
          <div class="info-box">
            <p class="info-box-title">Пароль:</p>
            <p class="info-box-content">${password}</p>
          </div>
          
          <a href="${websiteUrl}" class="website-button">Перейти на сайт школы</a>
          
        </div>
        <div class="footer">
          <p>© InternationalSchool 2025. Все права защищены.</p>
          <p>Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  sendEmail,
  generateRegistrationEmail
};
