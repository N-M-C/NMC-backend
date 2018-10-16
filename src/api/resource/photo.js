const { user: userModel } = require('src/models');
const { NotAuthenticatedError } = require('src/errors');
const logger = require('src/utils/logger');

/**
 * 나를 찾아줘
 */
async function deletePhoto(req, res) {
  /** userId 는 table에서 socialUserId임에 유의 */
  const { id } = req.params;
  const userId = parseInt(id, 10);
  if (!userId) {
    throw new NotAuthenticatedError({ message: '유저 정보가 없습니다.' });
  }

  try {
    const user = userModel.findOne({ where: { id: userId } });
    let userInfo = await user;
    userInfo.update({ profileImage: null });
    res.status(200).send('사진이 정상적으로 삭제 되었습니다.');
  } catch (error) {
    logger.error(error);
    res.status(500).send('사진이 정상적으로 삭제 되지 않았습니다.');
  }
}

module.exports = {
  deletePhoto,
};
