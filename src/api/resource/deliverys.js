const { Op } = require('sequelize');
const moment = require('moment');

const { deliveryMeta } = require('src/models');
const { formatResponse } = require('src/api/formats');

async function getAll(req, res) {
  const options = {
    //서버시간에서 9시간을 더해야함.
    where: {
      submitted_at: {
        [Op.gte]: moment()
          .add(9, 'hours')
          .format('YYYY-MM-DD'),
        [Op.lte]: moment()
          .add(1, 'days')
          .format('YYYY-MM-DD'),
      },
    },
  };

  const deliverys = await deliveryMeta.findAll(options);
  res.send(formatResponse(deliverys));
}

module.exports = {
  getAll,
};
