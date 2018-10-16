const { b2bUser: b2bUserModel } = require('src/models');
const { formatResponse } = require('src/api/formats');
const { NotAuthenticatedError } = require('src/errors');
const logger = require('src/utils/logger');

/**
 * 회원가입2 (추가정보 입력 받는) 페이지에 쓰일 API.
 * Id를 받아서 해당 유저에 부서명(department), 몇층(location), 이름(userName)등을 update한다.
 */
async function putOne(req, res, next) {
  const { body: value } = req;
  const { userId } = req;
  console.log('req value: ', value);

  let b2bUser;
  try {
    if (!req.userId) {
      console.log('아이디없을때');
      throw new NotAuthenticatedError({ message: '유저 정보가 없습니다.' });
    } else {
      b2bUser = await b2bUserModel.findOne({ where: { idx: req.userId } });

      if (!value.location || !value.department) {
        // 위치나 부서명 입력안하면 에러 출력~

        await res
          .status(403)
          .json(formatResponse({ message: '잘못된 요청. 값을 입력 해주세요' }));
      } else {
        // 위치/부서 입력하면 db에 입력
        await b2bUser.update({
          userName: value.userName || null,
          email: value.email || null,
          location: value.location,
          department: value.department,
        });

        const userData = b2bUser.get();
        console.log('result ', userData);
        delete userData.password;
        delete userData.passwordSalt;
        const result = {};
        result.code = '200';
        result.message = 'ok';
        result.userData = userData;

        await res.status(200).json(formatResponse(result));
      }
    }
  } catch (error) {
    console.log(error);
    logger.error(error);

    await res
      .status(500)
      .json(formatResponse({ code: 500, message: 'DB 및 서버오류', error }));
  }
}

module.exports = {
  putOne,
};
