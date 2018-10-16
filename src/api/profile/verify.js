const axios = require('axios');
const { user: userModel } = require('src/models');
const { flatToDash } = require('src/utils/mobileFormat');
const { sign } = require('src/utils/token');
const { formatResponse } = require('src/api/formats');
const { getAccessToken } = require('src/utils/iamportToken');
const logger = require('src/utils/logger');

/** 
 * user가 있을때, 
 * 같은 번호를 가진 계정이 있다면 그 계정의 accessToken을 주고
 * 같은 번호를 가진계정이 없다면 user의 mobile을 업데이트한다.
 * TODO: auth check 해서 요청자가 인증자와 동일한지 확인.
 */
const certificationUrl = 'https://api.iamport.kr/certifications';

async function verify(req, res, next) {
  try {
    const userId = req.userId;
    const { uid } = req.params;
    logger.info('uid', uid);
    if (!uid) return res.send(400);

    const certifiedRes = await getAccessToken().then(iamportAccessToken => {
      logger.info('iamport access token', iamportAccessToken);
      return axios
        .get(`${certificationUrl}/${uid}`, {
          headers: {
            Authorization: iamportAccessToken,
          },
        })
        .then(res => res.data);
    });
    const {
      certified,
      phone: flatPhone,
      merchant_uid: verifiedUserId,
    } = certifiedRes.response;

    logger.info('certified', certifiedRes);
    if (!certified) return res.send(400);

    // dashed
    const mobile = flatToDash(flatPhone);
    const mobileUniqUser = await userModel.findOne({ where: { mobile } });

    logger.info('mobile', mobile, mobileUniqUser);

    let response;
    if (mobileUniqUser && mobileUniqUser.get('id') !== userId) {
      const originalUserId = mobileUniqUser.get('id');
      const accessToken = await sign({
        userId: originalUserId,
        userIdx: originalUserId,
      });

      response = { success: true, accessToken };
    } else {
      const user = await userModel.findOne({
        where: {
          id: verifiedUserId,
        },
      });

      // 인증된 유저의 정보가 없을 때
      if (!user) {
        return res.send(404);
      }

      // 요청자와 인증자가 다를 때
      if (user.get('id') !== userId) {
        return res.send(403);
      }

      await user.update({ mobile });
      response = { success: true };
    }

    res.send(formatResponse(response));
  } catch (error) {
    logger.error(error);
  }
}

module.exports = verify;
