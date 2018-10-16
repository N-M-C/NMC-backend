const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const { sendMessage } = require('src/utils/telegram');
const logger = require('src/utils/logger');

const router = require('./api/router');

const app = express();

// 선두에 적용되어야 하는 보안과 cors설정이다.
app.use(helmet());
app.use(cors());
app.use(fileUpload());
// 레거시와 함께하자
// v2를 /v2에 넣어준다.
if (process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase() !== 'TEST') {
  const API_V2_URL = process.env.API_V2_URL;
  if (!API_V2_URL) {
    throw new Error('V2 URL이 필요합니다.');
  }
  app.use(
    '/v2',
    (request, response, next) => {
      // from API_V2
      response.removeHeader('X-Powered-By');
      response.header('Access-Control-Allow-Origin', '*');
      response.header(
        'Access-Control-Allow-Methods',
        'POST, GET, PUT, DELETE, OPTIONS'
      );
      response.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, iu, pt, employeeId, employeeid'
      );

      next();
    },
    proxy(API_V2_URL)
  );
}

// ping 체크
app.get('/hello', (req, res) => {
  res.send('how are you?');
});

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/', router);

// error 핸들러
app.use((error, req, res, next) => {
  logger.info('here');
  sendMessage(`
    ${process.env.NODE_ENV}환경에서 에러 발생
      ip: ${req.ip}
      method: ${req.method}
      url: ${req.url}
      originalUrl: ${req.originalUrl}
      headers: ${JSON.stringify(req.headers, null, 2)}
      body: ${JSON.stringify(req.body, null, 2)}
      error: ${error.stack}
    `);
  logger.error(error);
  logger.info(req);

  res.status(500).send({ error: 'Something failed!' });
});

module.exports = app;
