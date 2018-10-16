const { card: cardModel } = require('src/models');
const { NotAuthenticatedError } = require('src/errors');
const logger = require('src/utils/logger');

/**
 * 나를 찾아줘
 */
async function deleteCard(req, res) {
  /** userId 는 table에서 socialUserId임에 유의 */
  const { id } = req.params;
  const user_idx = parseInt(id, 10);

  if (!user_idx) {
    throw new NotAuthenticatedError({ message: '유저 정보가 없습니다.' });
  }

  try {
    cardModel.destroy({ where: { user_idx } });
    res.status(200).send('카드가 잘삭제 되었습니다.');
  } catch (error) {
    logger.error(error);
    res.status(500).send('카드가 정상적으로 삭제되지 않았습니다.');
  }
}

module.exports = {
  deleteCard,
};
