const axios = require('axios');

const { formatResponse } = require('src/api/formats');
const { user: userModel } = require('src/models');
const { b2bUser: b2bUserModel } = require('src/models');
const { sign, verify } = require('src/utils/token');
const logger = require('src/utils/logger');

const crypto = require('crypto');

/**
 * social id를 받아 jwt token을 리턴한다.
 * TODO: 미래에 한 유저당 여러 로그인 방식을 지원해야할 경우, 1:n social auth 테이블을 만들고 kakao, facebook 타입을 받아야한다.
 */

async function getTokenById(value, type) {
  let targetUser;
  let token;
  if (type === 'social_login') {
    targetUser = await userModel.findOne({
      where: {
        userId: value,
      },
    });
    // console.log('카카오: ', value, targetUser.dataValues);
    const userId = targetUser.get('id');
    token = sign({ userId, userIdx: userId });
    // console.log('카카오 userId: ', userId);
    return token;
  } else if (type === 'b2b_login') {
    try {
      targetUser = await b2bUserModel.findOne({
        where: {
          userId: value,
        },
      });
      const userId = targetUser.get('idx');
      token = sign({ userId, userIdx: userId });
    } catch (e) {
      console.error(e);
      return null;
    }
    return token;
  }
}

async function getPasswordFromDB(id) {
  // console.log('getPasswordFromDB userId: ', id);
  const targetUser = await b2bUserModel.findOne({
    where: {
      userId: id,
    },
  });
  // console.log('리소스: ', targetUser);
  const data = {
    password: targetUser.dataValues.password,
    passwordSalt: targetUser.dataValues.passwordSalt,
  };
  return data;
}

async function cryptoPassword(inputPassword, salt, callback) {
  await crypto.pbkdf2(inputPassword, salt, 105234, 64, 'sha512', (err, key) => {
    if (err) throw err;
    // console.log(key.toString('base64'));
    callback(key.toString('base64'));
  });
}

async function verifyAccountPassword(data, emailAuthCallback) {
  const value = await getPasswordFromDB(data.userId);
  // console.log('getPasswordFromDB 리절트값: ', value);
  const dbPassword = value.password;
  const inputPassword = data.password;
  const salt = value.passwordSalt;

  const cryptoCallback = hashPassword => {
    let isVerified;

    // console.log('hashPassword: ', hashPassword, 'dbPassword: ', dbPassword);
    if (dbPassword === hashPassword) {
      // console.log('비밀번호 일치');
      isVerified = 1;
      emailAuthCallback(isVerified);
    } else {
      // console.log('비밀번호 불일치');
      isVerified = 0;
      emailAuthCallback(isVerified);
    }
  };

  await cryptoPassword(inputPassword, salt, cryptoCallback);
}

/**
 *
 * @param userId
 * @returns {Promise<{password: *, passwordSalt: (b2bUser.passwordSalt|{type, allowNull, field})}>}
 */
async function checkRequireAddInfo(userId) {
  const targetUser = await b2bUserModel.findOne({
    where: {
      userId,
    },
  });
  // console.log('리소스: ', targetUser);
  const data = {
    location: targetUser.dataValues.location,
    department: targetUser.dataValues.department,
  };

  console.log('data: ', data);
  if (
    data.location == null ||
    data.department == null ||
    data.location === '' ||
    data.department === ''
  ) {
    console.log('데이터 없음에 걸림');
    return 1;
  }
  console.log('데이터 있음에 걸림');
  return 0;
}

/**
 *카카오 로그인
 */
async function kakaoAuth(req, res, next) {
  const { data: { accessToken } = {} } = req.body;
  // console.log('리퀘스트 바디: ', req.body);

  let kakaoMe;
  try {
    kakaoMe = await axios.get('https://kapi.kakao.com/v1/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const pt = await getTokenById(kakaoMe.data.id, 'social_login');

    res.status(200).json(formatResponse({ success: true, pt }));
    console.log('카카오: ', kakaoMe.data);
  } catch (error) {
    res
      .status(403)
      .json({ error: { code: 'FORBIDDEN', status: 403, message: 'no' } });
    // console.error(error);
    // next(error);
  }
}

/**
 *페이스북 로그인
 */
async function facebookAuth(req, res, next) {
  const { data: { accessToken } = {} } = req.body;

  let fbMe;
  try {
    fbMe = await axios.get('https://graph.facebook.com/v2.5/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const pt = await getTokenById(fbMe.data.id, 'social_login');
    res.status(200).json({ result: { success: true, pt } });
  } catch (error) {
    res
      .status(403)
      .json({ error: { code: 'FORBIDDEN', status: 403, message: 'no' } });
    logger.error(error.response);
    // next(error);
  }
}

/**
 *
 * 이메일 로그인
 */
async function emailAuth(req, res, next) {
  const { body: data } = req;
  // console.log('data.userId: ', data.userId);
  try {
    const pt = await getTokenById(data.userId, 'b2b_login');
    // console.log('emailAuth pt: ', pt);

    if (!pt) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          status: 403,
          success: false,
          comment: '토큰정보를 불러올 수 없습니다.',
        },
      });
    }

    const callbackVerifyAccountPassword = async isVerified => {
      // console.log('emailAuth result: ', isVerified);
      if (isVerified) {
        const isRequireAddInfo = await checkRequireAddInfo(data.userId);
        console.log(isRequireAddInfo);
        if (isRequireAddInfo) {
          // 추가정보가 없으면 isRequireAddInfo = 1, 있으면 isRequireAddInfo = 0.
          res.status(200).json({
            result: {
              success: true,
              requiredAddInfo: 1,
              pt,
              comment: '추가정보 필요',
            },
          });
        } else {
          res
            .status(200)
            .json({ result: { success: true, requiredAddInfo: 0, pt } });
        }
      } else {
        res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            status: 401,
            message: '비밀번호 일치하지 않음.',
          },
        });
      }
    };
    await verifyAccountPassword(data, callbackVerifyAccountPassword);
  } catch (e) {
    res
      .status(500)
      .json({ error: { code: 'FORBIDDEN', status: 500, message: e } });
    console.error(e);
  }
}

async function verifiedAuth(req, res, next) {
  try {
    logger.info(res.body);
    const { data } = req.body;
    const { accessToken } = data;
    await verify(accessToken);

    res.status(200).json({ result: { success: true, pt: accessToken } });
  } catch (error) {
    res
      .status(403)
      .json({ error: { code: 'FORBIDDEN', status: 403, message: 'no' } });
    logger.error(error.response);
  }
}

module.exports = function(req, res, next) {
  const { loginType } = req.body;

  if (loginType === 'kakao') {
    return kakaoAuth(req, res, next);
  } else if (loginType === 'fb') {
    return facebookAuth(req, res, next);
  } else if (loginType === 'email') {
    return emailAuth(req, res, next);
  } else if (loginType === 'verified') {
    return verifiedAuth(req, res, next);
  }

  return next();
};
