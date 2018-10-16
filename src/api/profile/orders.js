const { orderMeta, orderDetail } = require('src/models');
const { formatResponse } = require('src/api/formats');

async function getAll(req, res) {
  const { offset: _offset, limit: _limit } = req.query || {};

  const options = {
    where: {
      userId: req.userId,
    },
    order: [['id', 'DESC']],
  };

  const limit = parseInt(_limit);
  const offset = parseInt(_offset);

  if (limit) options.limit = limit;
  if (offset) options.offset = offset;

  const orders = await orderMeta.findAll(options);

  res.send(formatResponse(orders.map(c => c.get()), { limit, offset }));
}

async function getOne(req, res) {
  const meta = await orderMeta.findOne({
    where: {
      userId: req.userId,
      id: req.params.orderId,
    },
  });

  if (!meta) {
    return res.status(404).end();
  }

  const order = await orderDetail.findOne({
    where: {
      id: req.params.orderId,
    },
  });

  res.send(formatResponse(order.get()));
}

module.exports = {
  getAll,
  getOne,
};
