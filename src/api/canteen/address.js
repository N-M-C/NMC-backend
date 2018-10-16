const { userAddress: userAddressModel } = require('src/models');
const { company } = require('src/models');
// 새로운 user address를 등록한다.
async function postOne(req, res) {
  const {
    address,
    engName,
    roadNameAddress,
    addressDetail,
    deliveryAvailable,
    lunchDeliveryAvailable,
    area,
    lat,
    lon,
  } = req.body;

  const userId = req.userId;
  const breakfastDeliveryAvailable = 0;

  //body로 받은 주소 데이터를 통해 userAddress에서 1개의 주소를 찾는다.
  const userAddress = await userAddressModel.findOne({
    where: {
      userId,
      address,
      area: 'backban',
      roadNameAddress,
      addressDetail,
    },
  });
  // db와 res할 json 객체의 inUse를 active 시킨다.(1로 바꾼다.)
  if (userAddress) {
    //TODO : 이미 있는 데이터를 반환 할 때, 이미 있는 데이터라고 명시해주면서 반환하기
    userAddress.update({
      inUse: 0,
    });
    userAddress.inUse = 0;
    res.send(userAddress);
  } else {
    //inUse를 active(true로 설정)

    const b2b = await company.findOne({
      where: {
        engName,
      },
    });

    const b2bAddress = await userAddressModel.create({
      address,
      roadNameAddress,
      addressDetail,
      deliveryAvailable,
      lunchDeliveryAvailable,
      area: b2b.get().area,
      lat,
      lon,
      userId,
      breakfastDeliveryAvailable,
      inUse: 1,
    });

    const newUserAddress = await userAddressModel.create({
      address,
      roadNameAddress,
      addressDetail,
      deliveryAvailable,
      lunchDeliveryAvailable,
      area,
      lat,
      lon,
      userId,
      breakfastDeliveryAvailable,
      inUse: 0,
    });

    res.send(newUserAddress);
  }
}

module.exports = {
  postOne,
};
