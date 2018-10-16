const { pickUserParamsForUser } = require('src/utils/picks');
const { company: companyModel } = require('src/models');
const { formatResponse } = require('src/api/formats');
const { UnMatchedParams, HttpError } = require('src/errors');
const logger = require('src/utils/logger');
const JSON = require('circular-json');
/**
 * b2b유저가 로그인 후 클라이언트로 보낼 정보 (유저의 정보들)
 */

function divisionInputType(name, id) {
  if (!name && id) {
    return id;
  } else if (name && !id) {
    return name;
  }
  throw new UnMatchedParams();
};

async function find(req, res, next) {
  /** userId 는 table에서 socialUserId임에 유의 */

  const { companyName, companyId } = req.query || {};
  // const id = req.userId;
  // const divisionValue = divisionInputType(companyName, companyId);

  if (!companyId && !companyName) throw new UnMatchedParams();

  try {
    let company;
    if (companyName && !companyId) {
      company = await companyModel
        .findOne({
          where: { engName: companyName },
        })
        .catch(error => {
          console.error('db error: ', error);
          res.status(403).json({
            error: {
              code: 'FORBIDDEN',
              status: 403,
              message: 'DB Error. 해당 값으로 찾지 못하였음.',
            },
          });
        });
    } else if (!companyName && companyId) {
      company = await companyModel
        .findOne({
          where: { id: companyId },
        })
        .catch(error => {
          console.error('db error: ', error);
          res.status(403).json({
            error: {
              code: 'FORBIDDEN',
              status: 403,
              message: 'DB Error. 해당 값으로 찾지 못하였음.',
            },
          });
        });
    }
    const result = company.get();
    res.status(200).json(formatResponse(result));
  } catch (error) {
    console.error(error);

    res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        status: 403,
        message: error,
      },
    });
    // logger.error(error);
  }

  // console.log(me.get());
}

module.exports = {
  find,
};
