// const sequelize = require('src/db/sequelize');
// const { orderMeta: orderMetaModel } = require('src/models');
//
// /**
//  * 완료하지 않고 req 에 order transaction을 담아보낸다.
//  */
// async function postOrder(req, res, next) {
//   const {
//     userId,
//     point,
//     addressId,
//   } = req.body;
//
//   const {
//     mobile,
//     totalPrice,
//     timeSlotId,
//     couponId,
//     pointUsed,
//     payMethod,
//     purchased,
//     includeCutlery,
//     serviceType,
//     deliveryFee,
//     recipientName,
//     entrancePassword,
//     deliveryMemo,
//     deliveryType,
//     orderType,
//     serveAt,
//     deliveryAt,
//   } = {};
//   const orderTransaction = sequelize.transaction().then(async t => {
//     await menuDailyModel.findAll({
//
//     }, { transaction: t })
//     await menuDailyModel.update({
//
//     }, { transaction: t })
//     await orderMetaModel.create(
//       {
//         userId,
//         addressId,
//         mobile,
//         totalPrice,
//         timeSlotId,
//         couponId,
//         pointUsed,
//         payMethod,
//         purchased,
//         includeCutlery,
//         serviceType,
//         deliveryFee,
//         recipientName,
//         entrancePassword,
//         deliveryMemo,
//         deliveryType,
//         orderType,
//         serveAt,
//         deliveryAt,
//       },
//       { transaction: t }
//     );
//
//     // 재고 확인
//
//     // 메뉴 데일리 재고 조정
//     // 오더 메타 생성
//     // 오더 디테일 생성 및 저장
//     // 사용자 포인트 사용 시 포인트 조정
//     // 사용자 쿠폰 사용 시 쿠폰 txn 조정
//     // 카드 결제
//
//     // 커틀러리 정보 저장
//
//     // 첫 구매 시 유저 정보 수정 및 업데이트
//     // 친구 추천 프로세스
//   });
//
//   // 내부자 직원 배송비 무료 로직은 이제 priceCalculator에서 한다.
//
//   // 오더 메타 생성 및 DB 저장
//   const createOrderParamter = {
//     userIdx,
//     addressIdx,
//     mobile,
//     totalPrice,
//     timeSlotIdx,
//     couponIdx,
//     pointUsed: point,
//     deliveryPrice,
//     payMethod,
//     purchased: user.purchased,
//     includeCutlery,
//     serviceType,
//     recipientName,
//     entrancePassword,
//     deliveryMemo,
//     deliveryType,
//     orderType,
//     deliveryAt,
//     serveAt: serveDate,
//   };
//   const order = await Service.Order.createOrder(createOrderParamter, address);
//
//   const result = {};
//   try {
//     // 카드 결제
//     if (totalPrice > 0 && payMethod === PAYMENT_TYPE.ONLINE_CARD) {
//       // result.iamportManger = await Utils.iamportManager.payment(user, order); // old iamport deprecated
//       const card = await Repository.Card.findByUserIdx(+user.idx);
//       if (card.length < 1) {
//         throw new HttpError(
//           500,
//           'CARD_INFO_NOT_EXIST',
//           '카드 정보가 없이 카드 결제는 불가능 합니다'
//         );
//       }
//       if (card.length > 1) {
//         throw new HttpError(
//           500,
//           'CARD_INFO_VERY_MANY',
//           '등록된 카드 정보가 여러개 입니다. 플레이팅 고객지원팀(카카오톡 @플레이팅 혹은 1577-4676)으로 연락바랍니다'
//         );
//       }
//       result.iamportManager = await Service.Iamport.paymentByBillingKey({
//         orderIdx: order.idx,
//         userIdx: user.idx,
//         customerUid: card[0].billkey,
//         merchantUid: `${user.idx}-${order.idx}`,
//         amount: order.totalPrice,
//         orderName: `(${SERVICE_TYPE[serviceType]}) ${menus[0].name
//           .korean} 등 ${menus.length} 건`,
//         buyerTel: user.mobile,
//         buyerName: user.name || user.idx,
//         buyerEmail: receiveReceipt
//           ? receiveReceiptEmail || undefined
//           : undefined,
//         buyerAddr: `(유저번호: ${user.idx}) ${address.address} ${address.addressDetail} ${timeSlot.start}`,
//       });
//     }
//
//     // 메뉴 데일리 재고 조정
//     result.adjustOrdereds = await Service.MenuDaily.adjustOrdereds(
//       menuDailys,
//       menuInfos
//     );
//
//     // 오더 디테일 생성 및 저장
//     menuInfos.push({
//       idx: serviceType === 'BREAKFAST' ? 808081 : 808080,
//       amount: 1,
//     }); // 배송 리뷰용 더미 데이터 생성
//     result.createOrderDetails = await Service.Order.createOrderDetails(
//       order,
//       menuInfos
//     ); // return orderDetails
//
//     // 커틀러리 정보 저장
//     if (includeCutlery) {
//       const menuIdxs = menuInfos.map(menuInfo => menuInfo.idx);
//       const menuCutlerys = await Repository.MenuCutlery.findByMenuIdxs(
//         menuIdxs
//       );
//       if (menuCutlerys.length > 0) {
//         const orderCutleryParameter = menuCutlerys.map(menuCutlery => {
//           const orderDetail = _.find(result.createOrderDetails, {
//             menuIdx: menuCutlery.menuIdx,
//           });
//           return {
//             orderIdx: order.idx,
//             orderDetailIdx: orderDetail.idx,
//             cutleryIdx: menuCutlery.cutleryIdx,
//             count: menuCutlery.count * orderDetail.amount,
//           };
//         });
//         // console.log(orderCutleryParameter);
//         result.createOrderCutlerys = await Service.OrderCutlery.create(
//           orderCutleryParameter
//         );
//       }
//     }
//
//     // 사용자 포인트 사용 시 포인트 조정
//     if (point && point > 0) {
//       // result.adjustPoint = await Service.User.adjustPointByOrder(user, order); // deprecated soon.
//       result.adjustPoint = await Service.User2.decreasePoint({
//         // userId: userIdx,
//         user,
//         point,
//         note: `주문번호: ${order.idx} ((${SERVICE_TYPE[serviceType]}) ${menus[0]
//           .name.korean} 등 ${menus.length} 개 메뉴)`,
//       });
//     }
//
//     // 사용자 쿠폰 사용 시 쿠폰 txn 조정
//     if (userCouponIdx && couponIdx && couponIdx > 0) {
//       // TODO: idx 대신 뭔가 칼럼을 추가하던지 카테고리로 분류해서 무제한 쿠폰을 정의해야한다.
//       if (couponIdx === 138) {
//         result.updateInUsedTrue = true;
//       } else {
//         result.updateInUsedTrue = await Service.Coupon.updateInUsedTrue(
//           couponRelation
//         );
//       }
//     }
//
//     // 첫 구매 시 유저 정보 수정 및 업데이트
//     if (!user.purchased) {
//       result.setPurchasedTrue = await Service.User.setPurchasedTrue(user);
//     }
//
//     // 친구 추천 프로세스
//     if (user.refUserIdx) {
//       if (!await Repository.Refer.isAlreadyDoesRefer(user.idx)) {
//         result.referCreate = await Service.Refer.create(user, order);
//       }
//     }
//   } catch (error) {
//     await Repository.Order.deleteOrder(order);
//     throw error;
//   }
// }
//
// module.exports = {
//   postOrder,
// };
