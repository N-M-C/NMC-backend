const { pickUserParamsForUser } = require('src/utils/picks');
const { b2bUser: b2bUserModel } = require('src/models');
const { formatResponse } = require('src/api/formats');
const { NotAuthenticatedError } = require('src/errors');
const logger = require('src/utils/logger');
const JSON = require('circular-json');
/**
 * b2b유저가 로그인 후 클라이언트로 보낼 정보 (유저의 정보들)
 */
async function find(req, res, next) {
  /** userId 는 table에서 socialUserId임에 유의 */

  const id = req.userId;

  if (!id) {
    console.log('아이디없을때');
    throw new NotAuthenticatedError({ message: '유저 정보가 없습니다.' });
  }

  let me;
  try {
    me = await b2bUserModel.findOne({ where: { idx: id } });
  } catch (error) {
    console.log(error);
    // logger.error(error);
  }

  // console.log(me.get());
  const result = me.get();
  delete result.password;
  delete result.passwordSalt;

  res.status(200).json(formatResponse(result));
}

module.exports = {
  find,
};
