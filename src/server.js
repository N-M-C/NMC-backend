
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const router = require('./api/router');

const app = express();

// 선두에 적용되어야 하는 보안과 cors설정이다.
app.use(helmet());
app.use(cors());

// ping 
app.get('/test', (req, res) => {
  res.send('test message!');
});

app.use(bodyParser.json());

app.use('/', router);

// error 핸들러
app.use((error, req, res, next) => {
  logger.info('here');
  sendMessage(`
      에러 발생
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
