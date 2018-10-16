const { meta } = require('src/models');
const { formatResponse } = require('src/api/formats');

// query string의 회사이름을 리턴하고 area를 'backban'으로 설정해 주는 api
async function getMinimum(req, res) {
  const order = await meta.findOne({
    where: {
      key: 'MINIMUM_BACKBAN_ORDER',
    },
  });

  let data = formatResponse(order.get());

  res.send(data);
}

module.exports = {
  getMinimum,
};
