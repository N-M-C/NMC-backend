const sequelize = require('src/db/sequelize');
const { b2bOrderMeta: b2bOrderMetaModel } = require('src/models');
const { menuDaily: menuDailyModel } = require('src/models');
const { menu: menuModel } = require('src/models');
const { formatResponse } = require('src/api/formats');

/**
 * 완료하지 않고 req 에 order transaction을 담아보낸다.
 */
async function postB2BOrder(req, res, next) {
  const { profile, cart, serviceType } = req.body;
  // console.log(req.body);

  const {
    status,
    reserveDate,
    orderMenuName,
    orderItemBarcode,
    itemName,
    sellPrice,
    itemAmount,
    employeeId,
    userIdx,
    email,
    recipientName,
    department,
    location,
    companyId,
  } = {};
  // let menuName;

  /* const orderTransaction = sequelize.transaction().then(async t => {
    // const menuName = await menuModel.find(cart.map({}));
    await menuDailyModel.findAll({}, { transaction: t });
    await menuDailyModel.update({}, { transaction: t });
    await b2bOrderMetaModel.create(
      {
        status,
        reserveDate,
        orderMenuName,
        orderItemBarcode,
        itemName,
        sellPrice,
        itemAmount,
        employeeId,
        userId,
        email,
        recipientName,
        department,
        location,
        serviceType,
        companyId,
      },
      { transaction: t }
    );

    // 재고 확인
    // 메뉴 데일리 재고 조정
    // 오더 메타 생성
    // 오더 디테일 생성 및 저장
  }); */

  // 오더 메타 생성 및 DB 저장
  try {
    if (cart && profile) {
      cart.forEach(async data => {
        const menuItem = await menuModel.findOne({
          // cart에 담긴 idx값으로 메뉴테이블에서 메뉴명을 가져옴.
          where: {
            idx: data.idx,
          },
        });
        const menuShortName = menuItem.get('shortName');
        const menuLongName = menuItem.get('nameMenu');
        // console.log('menuName: ', menuItem, menuShortName);

        const createB2BOrderParamter = {
          status,
          reserveDate: data.deliveryAt, // req.body.cart 에 담긴 배달받을 일자값
          orderMenuName: menuLongName,
          orderItemBarcode: data.idx, // req.body.cart 에 담긴 idx
          itemName: menuShortName,
          sellPrice,
          itemAmount: data.amount, // req.body.cart 에 담긴 해당 메뉴의 주문 수량
          employeeId,
          userIdx: req.userId, // 클라이언트가 보낸 토큰값(reqeust header 상의 pt)을 b2b_user 테이블의 idx로 반환 받은 값임. (middlewares/userAuth를 통해 반환 됨)
          email,
          recipientName: profile.recipientName,
          department: profile.department,
          location: profile.location,
          serviceType,
          companyId: profile.companyId,
        };
        // console.log('createB2BOrderParamter: ', createB2BOrderParamter);
        const order = await b2bOrderMetaModel
          .create(createB2BOrderParamter)
          .then(() => {
            res.status(200).json({ code: 200, message: 'ok' });
          })
          .catch(e => {
            res.status(403).json({
              error: { code: 'FORBIDDEN', status: 403, message: e },
            });
          });
      });
    } else {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          status: 403,
          message: 'profile && cart parameter 없음.',
        },
      });
    }
  } catch (e) {
    res.status(403).json({
      error: { code: 'FORBIDDEN Bad Request', status: 403, message: e },
    });
    throw new Error(e);
  }

  /*
  const result = {};
  try {^
    // 메뉴 데일리 재고 조정
    result.adjustOrdereds = await Service.MenuDaily.adjustOrdereds(
      menuDailys,
      menuInfos
    );

    // 오더 디테일 생성 및 저장
    menuInfos.push({
      idx: serviceType === 'BREAKFAST' ? 808081 : 808080,
      amount: 1,
    }); // 배송 리뷰용 더미 데이터 생성
    result.createOrderDetails = await Service.Order.createOrderDetails(
      order,
      menuInfos
    ); // return orderDetails

    // 사용자 쿠폰 사용 시 쿠폰 txn 조정
    if (userCouponIdx && couponIdx && couponIdx > 0) {
      // TODO: idx 대신 뭔가 칼럼을 추가하던지 카테고리로 분류해서 무제한 쿠폰을 정의해야한다.
      if (couponIdx === 138) {
        result.updateInUsedTrue = true;
      } else {
        result.updateInUsedTrue = await Service.Coupon.updateInUsedTrue(
          couponRelation
        );
      }
    }
  } catch (error) {
    await Repository.Order.deleteOrder(order);
    throw error;
  } */
}

module.exports = {
  postB2BOrder,
};
