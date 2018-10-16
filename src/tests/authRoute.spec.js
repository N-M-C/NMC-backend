require('config/env');
const expect = require('chai').expect;
const request = require('supertest');

const server = require('../server');

const kakaoAccessToken = process.env.KAKAO_ACCESS_TOKEN;
const facebookAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;

if (!kakaoAccessToken || !facebookAccessToken) {
  throw new Error('Access Token 을 .env.test.local에 넣어주세요.');
}

describe('v3 Auth Controller Test', () => {
  describe('Kakao Auth', () => {
    it('Kakao 로그인 성공시에 plating 토큰을 리턴해줘야합니다.', done => {
      request(server)
        .post('/auth/v3/signin')
        .send({ type: 'kakao', data: { accessToken: kakaoAccessToken } })
        .expect(200, done);
    });
    it('Kakao 로그인 실패시에 403 Forbidden', done => {
      request(server)
        .post('/auth/v3/signin')
        .send({ type: 'kakao', data: { accessToken: 'WRONG TOKEN' } })
        .expect(403, done);
    });
  });
  describe('Facebook Auth', () => {
    it('Facebook 로그인 성공시에 plating 토큰을 리턴해줘야합니다.', done => {
      request(server)
        .post('/auth/v3/signin')
        .send({ type: 'facebook', data: { accessToken: facebookAccessToken } })
        .expect(200, done);
    });
    it('Facebook 로그인 실패시에 403 Forbidden', done => {
      request(server)
        .post('/auth/v3/signin')
        .send({ type: 'facebook', data: { accessToken: 'WRONG TOKEN' } })
        .expect(403, done);
    });
  });
});
