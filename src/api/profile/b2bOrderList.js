const { b2bOrderMeta: b2bOrderMetaModel, orderDetail } = require('src/models');

const { formatResponse } = require('src/api/formats');

async function getAll(req, res) {
  const { offset: _offset, limit: _limit } = req.query || {};

  console.log('userId: ', req.userId);
  const options = {
    where: {
      userIdx: req.userId,
    },
    // order: [['id', 'DESC']],
  };

  try {
    const limit = parseInt(_limit);
    const offset = parseInt(_offset);

    if (limit) options.limit = limit;
    if (offset) options.offset = offset;

    console.log('options', options);
    const orders = await b2bOrderMetaModel.findAll(options);
    console.log('orders', orders);
    res.send(formatResponse(orders.map(c => c.get()), { limit, offset }));
  } catch (e) {
    console.error(e);
  }
}

async function getOne(req, res) {
  const meta = await b2bOrderMetaModel.findOne({
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
  console.log('order: ', order);

  // res.send(formatResponse(order.get()));
}

module.exports = {
  getAll,
  getOne,
};
