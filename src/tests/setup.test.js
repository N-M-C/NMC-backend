require('config/env');

before(() => {
  if (process.env.NODE_ENV && process.env.NODE_ENV.toUpperCase() !== 'TEST') {
    throw new Error('환경이 TEST 가 아닙니다.');
  }
});
