const moment = require('moment');
const qs = require('qs');
const { isString } = require('lodash');
const { Op } = require('sequelize');
const {
  orderDetail: orderDetailModel,
  menu: menuModel,
} = require('src/models');
const { formatResponse } = require('src/api/formats');

async function getAll(req, res, nextMw) {
  try {
    const {
      menuType,
      menuId,
      startDate,
      endDate,
      offset: _offset = 0,
      limit: _limit = 10,
    } =
      req.query || {};

    // review는 orderDetail에 있으며, comment만 가져온다.
    const where = {
      ratedTime: {
        [Op.ne]: null,
      },
      comment: {
        [Op.ne]: null,
      },
    };

    const menuWhere = {};

    if (isString(menuId)) where.menuId = Number(menuId);

    if (isString(startDate)) {
      const startMoment = moment(startDate, 'YYYY-MM-DD');
      if (startMoment.isValid()) {
        where.ratedTime = where.ratedTime || {};
        where.ratedTime[Op.gte] = startMoment;
      }
    }

    if (isString(endDate)) {
      where.ratedTime = where.ratedTime || {};
      where.ratedTime[Op.lt] = moment(endDate, 'YYYY-MM-DD');
    }

    if (isString(menuType)) menuWhere.menuType = menuType.toUpperCase();

    const options = {
      where,
      order: [['ratedTime', 'DESC']],
      include: [
        {
          model: menuModel,
          // attributes: ['id', 'menuType', 'nameMenuKor', 'nameMenuEng', 'shortName', 'reviewCount'],
          where: menuWhere,
        },
      ],
    };

    let limit = parseInt(_limit);
    limit = limit > 0 ? limit : 0;
    let offset = parseInt(_offset);
    offset = offset > 0 ? offset : 0;
    options.limit = limit;
    options.offset = offset;

    // row를 찾으면서 총 개수를 센다.

    // const { count, rows } = await orderDetailModel.findAndCountAll(options); // findAndCountAll은 unhandled rejection issue가 있었다. https://github.com/sequelize/sequelize/pull/8474
    const count = await orderDetailModel.count(options);
    const rows = await orderDetailModel.findAll(options);

    const pathname = req.originalUrl.split('?')[0];

    // 다음 pagination link를 만든다.
    const nextOffset = offset + limit;
    const nextQs = qs.stringify({
      offset: nextOffset,
      limit,
      menuType,
      menuId,
      startDate,
      endDate,
    });
    const next = nextOffset < count ? `${pathname}?${nextQs}` : undefined;

    // 이전 pagination link를 만든다.
    const prevOffset = offset - limit > 0 ? offset - limit : 0;
    const prevQs = qs.stringify({
      offset: prevOffset,
      limit,
      menuType,
      menuId,
      startDate,
      endDate,
    });
    const prev = offset > 0 ? `${pathname}?${prevQs}` : undefined;

    res.send(formatResponse(rows.map(c => c.get()), { prev, next, count }));
  } catch (error) {
    nextMw(error);
  }
}

module.exports = {
  getAll,
};
