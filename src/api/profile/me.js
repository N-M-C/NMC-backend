const { pickUserParamsForUser } = require('src/utils/picks');
const { user: userModel } = require('src/models');
const { formatResponse } = require('src/api/formats');
const { NotAuthenticatedError } = require('src/errors');
const logger = require('src/utils/logger');

/**
 * 나를 찾아줘
 */
async function find(req, res, next) {
  /** userId 는 table에서 socialUserId임에 유의 */
  const id = req.userId;

  if (!id) {
    throw new NotAuthenticatedError({ message: '유저 정보가 없습니다.' });
  }

  let me;
  try {
    me = await userModel.findOne({ where: { id } });
  } catch (error) {
    logger.error(error);
  }

  res.status(200).json(formatResponse(pickUserParamsForUser(me.get())));
}

module.exports = {
  find,
};
