// iamport의 api를 사용하려면 먼저 getToken을 통해 토큰을 받아야한다. 이 토큰을 받는 로직이다.
// TODO: 만료되지 않은 token이 아직 있을 떄 이를 cache해야한다.
const axios = require('axios');
const { IAMPORT_KEY, IAMPORT_SECRET } = process.env;

const getTokenUrl = 'https://api.iamport.kr/users/getToken';

module.exports.getAccessToken = function() {
  return axios
    .post(getTokenUrl, {
      imp_key: IAMPORT_KEY,
      imp_secret: IAMPORT_SECRET,
    })
    .then(res => res.data)
    .then(res => {
      const response = res.response;
      const { access_token } = response;
      return access_token;
    });
};
