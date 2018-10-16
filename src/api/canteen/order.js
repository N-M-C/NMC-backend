const DateTimeOffset = require('datetime-offset');

const { pendingOrderMeta: pendingOrderMetaModel } = require('src/models');
const { orderMeta: orderMetaModel } = require('src/models');
const { userAddress: userAddressModel } = require('src/models');
const { meta, menuDaily } = require('src/models');
const moment = require('moment');
const axios = require('axios');

async function postOrder(req, res) {
  //필요한 데이터들은 아래와 같다.
  const {
    userIdx,
    addressIdx,
    serviceType,
    deliveryType,
    orderType,
    timeSlotIdx,
    menuInfos,
    totalPrice,
    mobile,
    payMethod,
    deliveryMemo,
    recipientName,
    entrancePassword,
    includeCutlery,
    deliveryAt,
  } =
    req.body || {};

  const minimum = await meta.findOne({
    where: {
      key: 'MINIMUM_BACKBAN_ORDER',
    },
  });
  const backbanLimit = await meta.findOne({
    where: {
      key: 'BACKBAN_ORDER_LIMIT_TIME',
    },
  });

  const minimumValue = parseInt(minimum.get().value);

  const menuStock = await menuDaily.findOne({
    where: {
      serve_date: deliveryAt,
      area: 'backban',
    },
  });

  const todayMenu = menuStock.get();
  const remain = todayMenu.stock - todayMenu.ordered;
  // 재고가 0보다 작거나 같으면, 그리고 주문하려는게 남은 재고보다 많으면 관련 메시지 전딜
  if (remain <= 0 && remain < menuInfos[0].amount) {
    res.status(500).send('주문하려는 주문수에 비해 재고가 부족해 주문이 실패되었습니다.');
  } else if (remain <= minimumValue) {
    res.status(500).send('최소주문수량보다 남은재고가 적어서 주문이 실패되었습니다.');
  } else if (
    moment()
      .tz('Asia/Seoul')
      .format(`${deliveryAt} ${backbanLimit.get().value}`) <
    moment()
      .tz('Asia/Seoul')
      .format('YYYY-MM-DD HH:mm:ss')
  ) {
    res
      .status(500)
      .send(
        `오늘 백반주문은 ${backbanLimit.get().value}까지만 가능합니다 날짜를 변경하여 주문해주시기 바랍니다!ㅜㅜ`
      );
  } else if (todayMenu.stock < menuInfos[0].amount) {
    res.status(500).send('주문하려는 주문수에 비해 재고가 부족해 주문이 실패되었습니다.');
  } else {
    // pending order 생성

    const newPendingOrder = await pendingOrderMetaModel.create({
      userId: userIdx,
      addressIdx,
      mobile,
      status: '대기',
      totalPrice,
      timeSlotIdx,
      payMethod,
      includeCutlery,
      recipientName,
      serviceType,
      entrancePassword,
      deliveryMemo,
      deliveryType,
      orderType,
      deliveryAt,
      serveAt: deliveryAt,
      amount: menuInfos[0].amount,
      menuIdx: menuInfos[0].idx,
      review: 0,
    });

    //order 생성
    const newOrder = await orderMetaModel.create({
      userId: userIdx,
      addressId: addressIdx,
      serviceType,
      deliveryType,
      orderType,
      timeSlotId: timeSlotIdx,
      userCouponIdx: null,
      couponId: 0,
      menuInfos: [{ idx: menuInfos[0].idx, amount: menuInfos[0].amount }],
      price: totalPrice,
      deliveryPrice: 0,
      pointUsed: 0,
      totalPrice,
      mobile,
      payMethod,
      purchased: 0,
      deliveryMemo,
      recipientName,
      entrancePassword,
      includeCutlery: includeCutlery ? true : false,
      deliveryAt,
      serveAt: deliveryAt,
    });
    newPendingOrder.update({ orderIdx: newOrder.id });

    if (menuInfos[0].amount >= minimumValue) {
      // 배달가능여부를 해당주소의 timeslot시간대로 filtering해서 데이터를 넣는다.
      const allOrder = await getAllOrder(timeSlotIdx, addressIdx, deliveryAt);
      const allOrderAmount = allOrder
        .filter(value => Object.keys(value).length !== 0)
        .filter(order => order.status === '대기' || order.status === '완료')
        .reduce((totalAmount, order) => {
          return totalAmount + order.amount;
        }, 0);

      if (allOrderAmount >= minimumValue) {
        // 빈 object를 주문data에서 빼줌 -> 추후 업데이트 필요
        const alreadyOverThreshold = allOrder
          .filter(value => Object.keys(value).length !== 0)
          .reduce((completeAmount, order) => {
            return completeAmount + (order.status === '완료' ? 1 : 0);
          }, 0);

        if (alreadyOverThreshold >= minimumValue) {
          placeOneOrder(req.body, newPendingOrder.id)
            .then(response => {
              res.json({
                code: 'SUCCESS',
                message: '주문이 성공적으로 접수되었습니다',
              });
            })
            .catch(err => {
              res.status(500).send('placeOneOrder alreadyOverThreshold');
            });
        } else {
          const allOrderArray = [];
          // 빈 object를 주문data에서 빼줌 -> 추후 업데이트 필요
          allOrder
            .filter(value => Object.keys(value).length !== 0)
            .filter(order => order.status !== '완료' && order.status === '대기') // 현재 주문취소가 되면 완료개수가 minimumValue개 미만인 경우가 생긴다. 이럴때에는 어쩔수 없이 그이후에 들어오는 주문은 대기만 결제한다.
            .forEach((order, index) => {
              const formattedOrder = formatPendingOrder(order);
              allOrderArray.push(
                setTimeout(async function() {
                  await placeOneOrder(formattedOrder, order.id);
                }, 3000 * index)
              );
            });
          Promise.all(allOrderArray)
            .then(response => {
              res.json({
                code: 'SUCCESS',
                message: '주문이 성공적으로 접수되었습니다',
              });
            })
            .catch(err => {
              console.log(err);
              res.status(500).send('Promise.all catch');
            });
        }
      }
    } else {
      // 배달가능여부를 해당주소의 timeslot시간대로 filtering해서 데이터를 넣는다.
      const allOrder = await getAllOrder(timeSlotIdx, addressIdx, deliveryAt);
      // console.log('주문', allOrder);
      // 빈 object를 주문data에서 빼줌 -> 추후 업데이트 필요
      const allOrderAmount = allOrder
        .filter(value => Object.keys(value).length !== 0)
        .filter(order => order.status === '대기' || order.status === '완료')
        .reduce((totalAmount, order) => {
          return totalAmount + order.amount;
        }, 0);
      if (allOrderAmount >= minimumValue) {
        const alreadyOverThreshold = allOrder
          .filter(value => Object.keys(value).length !== 0)
          .reduce((completeAmount, order) => {
            return completeAmount + (order.status === '완료' ? 1 : 0);
          }, 0);

        if (alreadyOverThreshold >= minimumValue) {
          placeOneOrder(req.body, newPendingOrder.id)
            .then(response => {
              res.json({
                code: 'SUCCESS',
                message: '주문이 성공적으로 접수되었습니다',
              });
            })
            .catch(err => {
              res.status(500).send('placeOneOrder alreadyOverThreshold');
            });
        } else {
          const allOrderArray = [];
          allOrder
            .filter(value => Object.keys(value).length !== 0)
            .filter(order => order.status !== '완료' && order.status === '대기')
            .forEach((order, index) => {
              const formattedOrder = formatPendingOrder(order);
              allOrderArray.push(
                setTimeout(async function() {
                  await placeOneOrder(formattedOrder, order.id);
                }, 3000 * index)
              );
            });
          Promise.all(allOrderArray)
            .then(response => {
              res.json({
                code: 'SUCCESS',
                message: '주문이 성공적으로 접수되었습니다',
              });
            })
            .catch(err => {
              res.status(500).send('Promise.all catch');
            });
        }
      } else {
        // 아무것도 안한다.
        res.status(200).send('더 주문 필요');
      }
    }
  }
}

async function getAmount(req, res) {
  try {
    const { timeSlotIdx, addressIdx, deliveryAt } = req.query;
    const allOrder = await getAllOrder(timeSlotIdx, addressIdx, deliveryAt);
    const allOrderAmount = allOrder
      .filter(value => Object.keys(value).length !== 0)
      .filter(order => order.status === '대기' || order.status === '완료')
      .reduce((totalAmount, order) => {
        if (order.amount) {
          return totalAmount + order.amount;
        }
        return totalAmount;
      }, 0);
    res.send({ amount: allOrderAmount });
  } catch (err) {
    res.status(500).send({ err });
  }
}

async function placeOneOrder(orderData, pendingOrderId) {
  const pendingOrder = await pendingOrderMetaModel.findOne({
    where: {
      id: pendingOrderId,
    },
  });
  pendingOrder.update({
    status: '완료',
  });

  //결제 부분

  return axios.post(
    process.env.API_V2_URL + '/order',

    {
      ...orderData,
      orderIdx: pendingOrder.orderIdx,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        pt: process.env.MASTER_TOKEN,
      },
    }
  );
}

// 총 주문 데이터를 받는다.
async function getAllOrder(timeSlotIdx, addressIdx, deliveryAt) {
  let available = {};
  //filter된 주문정보들이 담길 배열(같은주소,같은시간대)
  let allOrder = [];
  // 1. 일단 timeslot 으로 filtering 한다.
  const filteredOrders = await pendingOrderMetaModel.findAll({
    where: {
      timeSlotIdx,
      deliveryAt: new Date(deliveryAt),
    },
  });
  // 2. 주문한 유저의 주소 정보를 받는다.
  const userAddress = await userAddressModel.findOne({
    where: {
      id: addressIdx,
    },
  });
  // 주문한 유저의 주소의 orderdetail과 다른 주문의 orderdetail로 일단은 주소가 같은지 체크한다. -> 수정되어야 함.
  // 아래 변수는 현재 주문유저의 상세주소
  let checkAddressByDetail = userAddress.get().addressDetail;

  // 5. timeslot으로 filtering한 데이터를 주소로 다시 filtering 한다.
  filteredOrders.forEach(async fo => {
    // 각 주문데이터의 주문 시각
    allOrder.push(
      new Promise(async (resolve, reject) => {
        const filterdUserAddress = await userAddressModel.findOne({
          where: {
            id: fo.get().addressIdx,
          },
        });
        //4. 같은 날짜로 filtering

        //주문자의 주소정보와 timeslot으로 filter된 주문의 유저들의 주소를 비교해서 같은 주소만 거른다.
        if (filterdUserAddress.get().addressDetail === checkAddressByDetail) {
          available = fo.get();
        }
        resolve(available);
      })
    );
  });
  return Promise.all(allOrder);
}

function formatPendingOrder({
  userId,
  addressIdx,
  serviceType,
  deliveryType,
  orderType,
  timeSlotIdx,
  menuIdx,
  amount,
  totalPrice,
  deliveryFee,
  mobile,
  payMethod,
  deliveryMemo,
  recipientName,
  entrancePassword,
  includeCutlery,
  deliveryAt,
  orderIdx,
}) {
  return {
    userIdx: userId,
    addressIdx,
    serviceType,
    deliveryType,
    orderType,
    timeSlotIdx,
    userCouponIdx: null,
    menuInfos: [{ idx: menuIdx, amount }],
    price: totalPrice,
    deliveryPrice: deliveryFee,
    totalPrice,
    mobile,
    payMethod,
    deliveryMemo,
    recipientName,
    entrancePassword,
    includeCutlery: includeCutlery ? true : false,
    deliveryAt,
    orderIdx,
  };
}

module.exports = {
  postOrder,
  getAmount,
};
