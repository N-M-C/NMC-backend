const { couponTxn } = require('src/models');
const { formatResponse } = require('src/api/formats');

async function getAll(req, res) {
  const { offset: _offset, limit: _limit } = req.query || {};

  const options = {
    where: {
      userId: req.userId,
    },
  };

  const limit = parseInt(_limit);
  const offset = parseInt(_offset);

  if (limit) options.limit = limit;
  if (offset) options.offset = offset;

  const coupons = await couponTxn.findAll(options);

  res.send(formatResponse(coupons.map(c => c.get()), { limit, offset }));
}

module.exports = {
  getAll,
};
