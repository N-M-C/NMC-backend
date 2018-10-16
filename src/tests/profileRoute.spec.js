require('config/env');
const expect = require('chai').expect;
const request = require('supertest');

const server = require('../server');

const kakaoAccessToken = process.env.KAKAO_ACCESS_TOKEN;
const facebookAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;

if (!kakaoAccessToken || !facebookAccessToken) {
  throw new Error('Access Token 을 .env.test.local에 넣어주세요.');
}

describe('user test', () => {
  let pt;
  before(done => {
    request(server)
      .post('/auth/v3/signin')
      .send({ type: 'kakao', data: { accessToken: kakaoAccessToken } })
      .expect(200)
      .then(res => {
        pt = res.body.result.pt;
        done();
      });
  });

  it('v3/me 테스트', done => {
    request(server)
      .get('/profile/v3/me')
      .set('pt', pt)
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        done();
      });
  });
});
