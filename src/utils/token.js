// jsonwebtoken의 async api를 promise화 시키면서 secret 을 넣어준다.
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error('no SECRET for jwt');
}

function sign(data) {
  return new Promise((resolve, reject) => {
    jwt.sign(data, SECRET, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
}

function verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
}

module.exports = {
  sign,
  verify,
};
