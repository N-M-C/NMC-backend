const { userAddress: userAddressModel } = require('src/models');
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

  const userAddresses = await userAddressModel.findAll(options);

  res.send(formatResponse(userAddresses.map(c => c.get()), { limit, offset }));
}

async function getOne(req, res) {
  const userAddress = await userAddressModel.findOne({
    where: {
      userId: req.userId,
      id: req.params.addressId,
    },
  });

  if (!userAddress) {
    return res.status(404).end();
  }

  res.send(formatResponse(userAddress.get()));
}

async function getActive(req, res) {
  const activeUserAddress = await userAddressModel.findOne({
    where: {
      userId: req.userId,
      inUse: true,
    },
  });

  if (!activeUserAddress) {
    return res.status(404).end();
  }

  res.send(formatResponse(activeUserAddress.get()));
}

/**
 * 새로운 user address를 등록하고 inUse로 바꾼다. 
 */
async function postOne(req, res) {
  // TODO: required check
  const {
    address,
    roadNameAddress,
    addressDetail,
    deliveryAvailable,
    lunchDeliveryAvailable,
    breakfastDeliveryAvailable,
    area,
    lat,
    lon,
  } = req.body;

  const userId = req.userId;
  /** 
   * active를 찾아 deactive 시킨다.
   * active는 하나밖에 없지만, 혹시모르니 모두 검색하여 deactive한다 
   */
  const activeUserAddresses = await userAddressModel.findAll({
    where: {
      userId,
      inUse: true,
    },
  });

  await Promise.all(
    activeUserAddresses.map(addr => {
      return addr.update({
        inUse: false,
      });
    })
  );

  /**
   * active로 userAddress를 하나 생성한다.
   */
  const newUserAddress = await userAddressModel.create({
    address,
    roadNameAddress,
    addressDetail,
    deliveryAvailable,
    lunchDeliveryAvailable,
    breakfastDeliveryAvailable,
    area,
    lat,
    lon,

    userId,
    inUse: true,
  });

  res.send(newUserAddress);
}

/**
 * 특정 주소를 active (inUse)하게 한다.
 */
async function putActive(req, res) {
  const targetUserAddress = await userAddressModel.findOne({
    where: {
      userId: req.userId,
      id: req.params.addressId,
    },
  });

  // target이 있는지 검사
  if (!targetUserAddress) {
    return res.send(404);
  }

  // 이미 active인지 검사
  if (targetUserAddress.get('inUse')) {
    return res.send(200);
  }

  // 모든 active 찾기
  const activeUserAddresses = await userAddressModel.findAll({
    where: {
      userId: req.userId,
      inUse: true,
    },
  });

  // 모두 deactive
  await Promise.all(
    activeUserAddresses.map(addr =>
      addr.update({
        inUse: false,
      })
    )
  );

  // target active
  await targetUserAddress.update({ inUse: true });

  res.send(200);
}

async function deleteOne(req, res) {
  req.send(501);
}

module.exports = {
  getAll,
  getOne,
  getActive,
  putActive,
  deleteOne,
  postOne,
};
