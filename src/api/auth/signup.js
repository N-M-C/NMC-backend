const axios = require('axios');
const { formatResponse } = require('src/api/formats');
const crypto = require('crypto');
const { b2bUser: b2bUserModel } = require('src/models');

const { API_V2_URL } = process.env;
if (!API_V2_URL) throw new Error('API V2의 URL이 필요합니다');

const signup = [
  async function signup(req, res, next) {
    const { loginType, data: { accessToken, ...restData } = {} } =
      req.body || {};

    const { body } = req;

    let v2Required;
    try {
      if (loginType === 'kakao') {
        const kakaoMe = await axios
          .get('https://kapi.kakao.com/v1/user/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(result => result.data);
        v2Required = {
          profileImage: kakaoMe.properties.profile_image,
          nickname: kakaoMe.properties.nickname,
          socialUserId: kakaoMe.id,
        };
      } else if (loginType === 'fb') {
        const fbMe = await axios
          .get('https://graph.facebook.com/v2.5/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(result => result.data);
        v2Required = {
          socialUserId: fbMe.id,
          nickname: fbMe.name,
        };
      } else if (loginType === 'email') {
        const checkAlreadyExistingAccount = await b2bUserModel.findOne({
          where: {
            userId: body.userId,
          },
        });
        if (checkAlreadyExistingAccount) {
          res.status(403).json({
            error: {
              code: 'FORBIDDEN',
              status: 403,
              message: '이미 존재하는 아이디 입니다.',
            },
          });
          // throw new Error('이미 존재하는 아이디');
        }

        console.log('body: ', body);
        crypto.randomBytes(64, (err, buf) => {
          // 패스워드 암호화
          crypto.pbkdf2(
            body.password,
            buf.toString('base64'),
            105234,
            64,
            'sha512',
            (e, key) => {
              b2bUserModel
                .create({
                  userId: body.userId,
                  password: key.toString('base64'),
                  passwordSalt: buf.toString('base64'),
                  companyId: body.companyId,
                })
                .then(result => {
                  // 추가정보 필요한지 확인하는 로직
                  console.log('dataValues: ', result.dataValues);
                  if (
                    !result.dataValues.location ||
                    !result.dataValues.dapartment
                  ) {
                    res
                      .status(200)
                      .json({ result: { success: true, requiredAddInfo: 1 } });
                  } else {
                    res
                      .status(200)
                      .json({ result: { success: true, requiredAddInfo: 0 } });
                  }
                })
                .catch(error => {
                  // DB쪽 에러는 여기서만 잡힘..
                  // throw error;
                  console.error(error);
                  res.status(403).json({
                    error: {
                      code: 'FORBIDDEN',
                      status: 403,
                      message: '회원가입에 실패하였습니다.',
                    },
                  });
                });
            }
          );
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: { code: 'Server Error', status: 500, message: error } });
      throw error;
    }

    if (loginType === 'kakao' || loginType === 'fb') {
      console.log('email 말고 다른걸로 로그인한 경우.');
      req.body = {
        ...restData,
        ...v2Required,
        loginType,
      };

      /** v2로 보낸다. */
      next();
    }
  },
  async (req, res, next) => {
    try {
      const result = await axios
        .post(`${API_V2_URL}/user/signup`, {
          ...req.body,
        })
        .then(response => response.data)
        .catch(({ response }) => {
          throw response.data.error;
        });
      res.json(formatResponse(result));
    } catch (error) {
      next(error);
    }
  },
];

module.exports = signup;
