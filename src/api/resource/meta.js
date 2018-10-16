const { meta: MetaModel } = require('src/models');

async function updateDeliveryTime(req, res) {
  const { time } = req.body;
  const meta = await MetaModel.findOne({
    where: { key: 'TIME_SLOT_AVAILABLE_UNTIL_MINUTES' },
  });
  try {
    meta.update({
      value: time,
    });
    res.status(200).send(`주문가능 시간이 ${time}분전으로 정상적으로 변경되었습니다.`);
  } catch (err) {
    res.status(500).send('정상적으로 시간이 변경되지 않았습니다!');
  }
}

async function getDeliveryTime(req, res) {
  const meta = await MetaModel.findOne({
    where: { key: 'TIME_SLOT_AVAILABLE_UNTIL_MINUTES' },
  });
  res.status(200).send(meta.get().value);
}
module.exports = { updateDeliveryTime, getDeliveryTime };
