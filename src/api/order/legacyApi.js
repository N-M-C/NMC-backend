// import _ from 'lodash';
// // import console from 'winston';
// import DateTimeOffset from 'datetime-offset';
// import HttpError from '../../HttpError';
// // import {
// //   User as UserRepository,
// //   Meta as MetaRepository,
// //   MenuDaily as MenuDailyRepository,
// //   Order as OrderRepository,
// //   TimeSlot as TimeSlotRepository,
// //   Address as AddressRepository,
// //   Card as CardRepository,
// //   Coupon as CouponRepository,
// //   CouponRelation as CouponRelationRepository,
// //   Refer as ReferRepository,
// //   Menu as MenuRepository,
// // } from '../../repositorys';
// import Repository from '../Repository';
// // import {
// //   User as UserService,
// //   Coupon as CouponService,
// //   Order as OrderService,
// //   Refer as ReferService,
// //   MenuDaily as MenuDailyService,
// //   Address as AddressService,
// // } from '../../services';
// import Service from '../Service';
// import * as Utils from '../../utils';

// /* Const Section */
// const PAYMENT_TYPE = {
//   ONLINE_CARD: 1,
//   OFFLINE_CARD: 2,
//   OFFLINE_CASH: 3,
//   BANK_TRANSFER: 4,
// };
// const SERVICE_TYPE = {
//   BREAKFAST: '새벽 배송',
//   LUNCH: '점심 배송',
//   DINNER: '저녁 배송',
// };
// /* Const Section */
// // const Repository = {
// //   User: new UserRepository('mysql'),
// //   Meta: new MetaRepository('mysql'),
// //   MenuDaily: new MenuDailyRepository('mysql'),
// //   Order: new OrderRepository('mysql'),
// //   TimeSlot: new TimeSlotRepository('mysql'),
// //   Address: new AddressRepository('mysql'),
// //   Card: new CardRepository('mysql'),
// //   Coupon: new CouponRepository('mysql'),
// //   CouponRelation: new CouponRelationRepository('mysql'),
// //   Refer: new ReferRepository('mysql'),
// //   Menu: new MenuRepository('mysql'),
// // };

// // const Service = {
// //   User: new UserService('mysql'),
// //   Coupon: new CouponService('mysql'),
// //   Order: new OrderService('mysql'),
// //   Refer: new ReferService('mysql'),
// //   MenuDaily: new MenuDailyService('mysql'),
// //   Address: new AddressService('mysql'),
// // };

// export default async function postOrder(parameters) {
//   // const Repository = generateRepositorys();
//   // const Service = generateServices();
//   const Meta = Object.assign(
//     await Repository.Meta.findByCategory('default'),
//     await Repository.Meta.findByCategory('server'),
//   );
//   const {
//     userIdx,
//     addressIdx,
//     recipientName,
//     deliveryMemo,
//     entrancePassword,
//     orderType,
//     serviceType,
//     deliveryType,
//     timeSlotIdx,
//     couponIdx,
//     userCouponIdx,
//     menuInfos,
//     price,
//     point,
//     mobile,
//     payMethod,
//     includeCutlery,
//     deliveryAt,
//     currentDateTimeForDevelopment,
//     deliveryPrice,
//     totalPrice,
//     receiveReceipt,
//     receiveReceiptEmail,
//   } = parameters;
//   await Utils.requireParameterChecker({
//     userIdx,
//     addressIdx,
//     orderType,
//     serviceType,
//     deliveryType,
//     menuInfos,
//     price,
//     deliveryPrice,
//     totalPrice,
//     mobile,
//     payMethod,
//     includeCutlery,
//     deliveryAt,
//   });

//   // User , Address, Timeslot 객체를 각각 id로 찾아오고
//   const user = await Repository.User.find(parseInt(userIdx, 10));
//   const address = await Repository.Address.find(parseInt(addressIdx, 10));
//   const timeSlot = await Repository.TimeSlot.find(parseInt(timeSlotIdx, 10));

//   // 주소의 area가 null일 경우 한번 더 체크
//   if (!address.area || !address.roadNameAddress) { await Service.Address.reAttachAdressInfo(address); }

//   // 현재시간
//   // 왜필요하지?
//   const now = currentDateTimeForDevelopment ? new DateTimeOffset(currentDateTimeForDevelopment, {
//     format: 'YYYY-MM-DD HH:mm:ss',
//     timezone: 'KST',
//   }) : new DateTimeOffset(new Date());

//   // utc가 어디서 나오지?
//   const timeSlotDateTime = new DateTimeOffset(timeSlot.utc, { format: 'HHmm' });

//   // 한국시간?
//   const KSTMinutes = {
//     timeSlot: Utils.timeToMinutes(timeSlotDateTime.toString('KST', 'HH:mm')),
//     now: Utils.timeToMinutes(now.toString('KST', 'HH:mm')),
//   };

//   // Area가 배송 가능시간인지 찾자.
//   const thisAreaOrderStartTimeString = now.toString('KST', 'YYYY-MM-DD') + Meta[`ORDER_AVAILABLE_AREA_${address.area.toUpperCase()}_START_TIME`];
//   const thisAreaOrderEndTimeString = now.toString('KST', 'YYYY-MM-DD') + Meta[`ORDER_AVAILABLE_AREA_${address.area.toUpperCase()}_END_TIME`];
//   const thisAreaOrderStartTime = new DateTimeOffset(thisAreaOrderStartTimeString, {
//     format: 'YYYY-MM-DDHH:mm:ss',
//     timezone: 'KST',
//   });
//   const thisAreaOrderEndTime = new DateTimeOffset(thisAreaOrderEndTimeString, {
//     format: 'YYYY-MM-DDHH:mm:ss',
//     timezone: 'KST',
//   });

//   // 플레이팅이 언제 준비해야되나?
//   const serveDate = (serviceType === 'BREAKFAST') ?
//       new DateTimeOffset(deliveryAt, {
//         format: 'YYYY-MM-DD',
//         timezone: 'KST',
//       }).addDays(-1).toString('KST', 'YYYY-MM-DD') : deliveryAt;

//   // 그날의 MenuDaily를 찾자.
//   const menuDailys = await Repository.MenuDaily.findByOptions({
//     area: address.area,
//     serveDate,
//     serviceType,
//   });

//   // 쿠폰찾고, 프칼 돌린다.
//   const couponRelation = userCouponIdx ? await Repository.CouponRelation.find(parseInt(userCouponIdx, 10)) : undefined;
//   const coupon = couponIdx ? await Repository.Coupon.find(couponIdx) : undefined;
//   if (coupon && couponRelation) {
//     if (couponRelation.couponIdx !== coupon.idx) throw HttpError(403, null, '요청한 쿠폰 정보가 올바르지 않습니다');
//   }

//   const calculatedPrice = await Utils.priceCalculator(menuInfos, {
//     orderType, couponIdx, point, serviceType, userIdx, payMethod,
//   });
//   const menuTypeCount = {
//     MAIN: calculatedPrice.cart.detail.mainCount,
//     SIDE: calculatedPrice.cart.detail.sideCount,
//     DRINK: calculatedPrice.cart.detail.drinkCount,
//     SET: calculatedPrice.cart.detail.setCount,
//   };

//   // 메뉴들을 찾는데...  왜?
//   const menus = await Repository.Menu.findByIdxs(menuInfos.map(mi => mi.idx));

//   // 으악.

//   /* Common Exception Start */
//   if (timeSlot.serviceType !== serviceType) {
//     throw new HttpError(null, 'PERMISSION_EXCEPTION', `${timeSlot.text} 주문 시간은 ${SERVICE_TYPE[serviceType]} 주문이 불가능한 시간대 입니다. 다른 주문 시간을 선택해주세요`);
//   }

//   // 필요없음
//   // if (menus.filter(m => m.idx >= 30005 && m.idx <= 30007).length > 0) {
//   //   // 핸드앤드몰트 주문 가능 지역 '서울 강남구' 임시 예외처리
//   //   if (!/^서울 강남구/g.test(address.address)) {
//   //     const targetMenus = menus.filter(m => m.idx >= 30005 && m.idx <= 30007).map(m => m.name.korean).join(',');
//   //     throw new HttpError(400, 'PERMISSION_EXCEPTION', `${targetMenus}은 이벤트 메뉴로서 배송지가 '서울 강남구'인 주소로만 주문 가능합니다. 현재 설정된 주소지는 '${address.address}' 입니다`);
//   //   }
//   //   if (point > 0 || couponIdx > 0) {
//   //     const targetMenus = menus.filter(m => m.idx >= 30005 && m.idx <= 30007).map(m => m.name.korean).join(',');
//   //     throw new HttpError(400, 'PERMISSION_EXCEPTION', `${targetMenus}은 이벤트 메뉴로서 해당 메뉴가 포함된 주문은 쿠폰과 포인트를 사용할 수 없습니다. 쿠폰과 포인트를 초기화 후 다시 주문해주세요`);
//   //   }
//   // }

//   // 성인인증
//   // if (menus.filter(m => m.isRequireAdultVerify).length > 0) {
//   //   // 성인 인증 필요한 메뉴의 나이 계산 및 주문 가능 여부 확인
//   //   if (!user.identityVerify) throw new HttpError(403, 'PERMISSION_EXCEPTION', '성인 인증이 필요한 메뉴가 있습니다. 본인 인증을 진행해주세요');
//   //   const birthday = user.birthday;
//   //   const minus = parseInt(birthday.toString('KST', 'YYYY'), 10);
//   //   let age = parseInt(new DateTimeOffset(new Date()).addYears(minus - (minus * 2)).toString('KST', 'YYYY'), 10) - 1;
//   //   if (parseInt(now.toString('KST', 'MMDD'), 10) >= parseInt(birthday.toString('KST', 'MMDD'), 10)) age += 1;
//   //   if (age < 19) {
//   //     const adultMenuNames = menus.filter(m => m.isRequireAdultVerify).map(m => m.name.korean);
//   //     throw new HttpError(403, 'PERMISSION_EXCEPTION', `만 19세 미만은 ${adultMenuNames.join(',')}를 구매할 수 없습니다. ${user.realName} 고객님은 현재 만 ${age}세 입니다`);
//   //   }
//   // }

//   // 영수증
//   if (receiveReceipt && (!receiveReceiptEmail || receiveReceiptEmail === '')) {
//     throw new HttpError(400, 'PARAMETER_VALUE_EXCEPTION', '즉시 결제 영수증 발급을 위한 이메일을 입력해주세요.');
//   }
//   if (receiveReceipt && !Utils.regExp.email(receiveReceiptEmail)) {
//     throw new HttpError(400, 'PARAMETER_VALUE_EXCEPTION', '즉시 결제 영수증 발급을 위한 이메일 형식이 잘못되었습니다.');
//   }

//   // 이게 필요한가.
//   if (payMethod !== PAYMENT_TYPE.ONLINE_CARD && receiveReceipt) {
//     throw new HttpError(500, null, '이메일 영수증 발급은 즉시 결제만 지원됩니다.');
//   }

//   //
//   if (calculatedPrice.price !== totalPrice
//   || calculatedPrice.after.price !== price
//   || calculatedPrice.after.deliveryPrice !== deliveryPrice) {
//     throw new HttpError(400, null, `서버에서 계산한 가격과 요청받은 가격이 다릅니다. 가격 할인 이벤트가 시작되었거나 종료되었을 수 있습니다\n\n서버 계산 가격: ${Utils.regExp.comma(calculatedPrice.price)}원\n요청 받은 가격: ${Utils.regExp.comma(totalPrice)}원`);
//   }
//   if (!parseInt(Meta[`ORDER_AVAILABLE_${serviceType}`], 10)) {
//     throw new HttpError(403, 'PERMISSION_EXCEPTION', `현재 ${SERVICE_TYPE[serviceType] || '해당'} 서비스는 제공하지 않습니다`);
//   }
//   if (!_.find(menuInfos, { idx: 74 })) {
//     if (serviceType !== 'BREAKFAST' && KSTMinutes.timeSlot - KSTMinutes.now < +(Meta.TIME_SLOT_AVAILABLE_UNTIL_MINUTES || 20)) {
//       throw new HttpError(400, 'PERMISSION_EXCEPTION', `선택하신 배달 시간(${timeSlot.text})이 마감되었습니다. 다른 배달 시간을 선택해주세요.\n배달 시간은 배달 시작 ${Meta.TIME_SLOT_AVAILABLE_UNTIL_MINUTES || 20}분 전에 마감됩니다`);
//     }
//     if (thisAreaOrderStartTime.compareTo(now) > 0 || thisAreaOrderEndTime.compareTo(now) < 0) {
//       throw new HttpError(400, 'PERMISSION_EXCEPTION', `현재 주문 가능한 시간이 아닙니다. 해당 지역의 주문 가능한 시간은 ${thisAreaOrderStartTime.toString('KST', 'HH:mm')} ~ ${thisAreaOrderEndTime.toString('KST', 'HH:mm')} 입니다 (현재 시간 : ${now.toString('KST', 'HH:mm')})`);
//     }
//   }
//   // if (Utils.seoulMoment(`${deliveryAt} 23:59:59`, 'YYYY-MM-DD HH:mm:ss') <= now) {
//   if (new DateTimeOffset(`${deliveryAt} 23:59:59`, { timezone: 'KST' }).compareTo(now) < 0) {
//     throw new HttpError(400, 'PERMISSION_EXCEPTION', '과거로 배송을 보낼 수 없습니다');
//   }
//   if (serviceType === 'BREAKFAST' && payMethod !== PAYMENT_TYPE.ONLINE_CARD) {
//     throw new HttpError(500, 'PERMISSION_EXCEPTION', '새벽 배송은 온라인 카드 주문만 가능합니다. 만약 온라인 카드 결제를 시도했는데 이 메시지가 출력되었다면 앱을 종료하고 다시 주문해주세요');
//   }
//   if (serviceType === 'BREAKFAST' && new DateTimeOffset(`${deliveryAt} ${Meta.BREAKFAST_ORDER_LIMIT_TIME}`, { timezone: 'KST' }).addDays(-1).compareTo(now) < 0) {
//     throw new HttpError(400, 'PERMISSION_EXCEPTION', `해당 날짜의 새벽 배송 주문은 ${Meta.BREAKFAST_ORDER_LIMIT_TIME} 까지만 가능합니다. 날짜를 변경해주세요`);
//   }
//   if (!/^\d{3}-\d{3,4}-\d{4}$/.test(mobile)) {
//     throw new HttpError(400, 'PERMISSION_EXCEPTION', '휴대전화 양식을 확인해주세요');
//   }

//   // 프칼에서 할 수 있을거같은데?
//   if (!point && user.point < point) {
//     throw new HttpError(403, 'PERMISSION_EXCEPTION', '보유한 포인트보다 더 많은 포인트를 사용할 수 없습니다');
//   }

//   if (!address.deliveryAvailable[serviceType]) {
//     throw new HttpError(403, 'PERMISSION_EXCEPTION', `해당 지역은 ${SERVICE_TYPE[serviceType]} 서비스를 이용할 수 없습니다`);
//   }

//   // 메뉴 구입 제한 로직
//   if (menuTypeCount.DRINK > (((menuTypeCount.MAIN + menuTypeCount.SET) * 2) + (menuTypeCount.SIDE * 1))) {
//     throw new HttpError(403, 'PERMISSION_EXCEPTION', '메인 혹은 세트 메뉴 1개당 음료 2개, 사이드 메뉴 1개당 음료 1개 까지만 추가 주문이 가능합니다');
//   }
//   if ((menuTypeCount.MAIN === 0 && menuTypeCount.SET === 0) && (menuTypeCount.SIDE > 0 || menuTypeCount.DRINK)) {
//     throw new HttpError(403, 'PERMISSION_EXCEPTION', '사이드 메뉴와 음료는 메인 메뉴 혹은 세트 메뉴와 함께 주문 할 수 있습니다');
//   }
//   if (price < Meta.ORDER_MINIMUM_PRICE && calculatedPrice.cart.price < Meta.ORDER_MINIMUM_PRICE) {
//     throw new HttpError(403, 'PERMISSION_EXCEPTION', `합계가 ${Meta.ORDER_MINIMUM_PRICE} 미만인 장바구니는 주문이 불가합니다. 다른 요리를 추가해주세요`);
//   }
//   if (menuDailys.length === 0 || !Service.MenuDaily.isAvailableAdjustOrdereds(menuDailys, menuInfos)) {
//     throw new HttpError(403, 'PERMISSION_EXCEPTION', '해당 메뉴의 재고가 부족합니다');
//   }

//   /* Common Exception End */

//   // 내부자 직원 배송비 무료 로직은 이제 priceCalculator에서 한다.

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

//   const result = {};
//   try {
//     // 카드 결제
//     if (totalPrice > 0 && payMethod === PAYMENT_TYPE.ONLINE_CARD) {
//       // result.iamportManger = await Utils.iamportManager.payment(user, order); // old iamport deprecated
//       const card = await Repository.Card.findByUserIdx(+user.idx);
//       if (card.length < 1) {
//         throw new HttpError(500, 'CARD_INFO_NOT_EXIST', '카드 정보가 없이 카드 결제는 불가능 합니다');
//       }
//       if (card.length > 1) {
//         throw new HttpError(500, 'CARD_INFO_VERY_MANY', '등록된 카드 정보가 여러개 입니다. 플레이팅 고객지원팀(카카오톡 @플레이팅 혹은 1577-4676)으로 연락바랍니다');
//       }
//       result.iamportManager = await Service.Iamport.paymentByBillingKey({
//         orderIdx: order.idx,
//         userIdx: user.idx,
//         customerUid: card[0].billkey,
//         merchantUid: `${user.idx}-${order.idx}`,
//         amount: order.totalPrice,
//         orderName: `(${SERVICE_TYPE[serviceType]}) ${menus[0].name.korean} 등 ${menus.length} 건`,
//         buyerTel: user.mobile,
//         buyerName: user.name || user.idx,
//         buyerEmail: receiveReceipt ? (receiveReceiptEmail || undefined) : undefined,
//         buyerAddr: `(유저번호: ${user.idx}) ${address.address} ${address.addressDetail} ${timeSlot.start}`,
//       });
//     }

//     // 메뉴 데일리 재고 조정
//     result.adjustOrdereds = await Service.MenuDaily.adjustOrdereds(menuDailys, menuInfos);

//     // 오더 디테일 생성 및 저장
//     menuInfos.push({ idx: (serviceType === 'BREAKFAST' ? 808081 : 808080), amount: 1 }); // 배송 리뷰용 더미 데이터 생성
//     result.createOrderDetails = await Service.Order.createOrderDetails(order, menuInfos); // return orderDetails

//     // 커틀러리 정보 저장
//     if (includeCutlery) {
//       const menuIdxs = menuInfos.map(menuInfo => menuInfo.idx);
//       const menuCutlerys = await Repository.MenuCutlery.findByMenuIdxs(menuIdxs);
//       if (menuCutlerys.length > 0) {
//         const orderCutleryParameter = menuCutlerys.map((menuCutlery) => {
//           const orderDetail = _.find(result.createOrderDetails, { menuIdx: menuCutlery.menuIdx });
//           return {
//             orderIdx: order.idx,
//             orderDetailIdx: orderDetail.idx,
//             cutleryIdx: menuCutlery.cutleryIdx,
//             count: menuCutlery.count * orderDetail.amount,
//           };
//         });
//         // console.log(orderCutleryParameter);
//         result.createOrderCutlerys = await Service.OrderCutlery.create(orderCutleryParameter);
//       }
//     }

//     // 사용자 포인트 사용 시 포인트 조정
//     if (point && point > 0) {
//       // result.adjustPoint = await Service.User.adjustPointByOrder(user, order); // deprecated soon.
//       result.adjustPoint = await Service.User2.decreasePoint({
//         // userId: userIdx,
//         user,
//         point,
//         note: `주문번호: ${order.idx} ((${SERVICE_TYPE[serviceType]}) ${menus[0].name.korean} 등 ${menus.length} 개 메뉴)`,
//       });
//     }

//     // 사용자 쿠폰 사용 시 쿠폰 txn 조정
//     if (userCouponIdx && couponIdx && couponIdx > 0) {
//       // TODO: idx 대신 뭔가 칼럼을 추가하던지 카테고리로 분류해서 무제한 쿠폰을 정의해야한다.
//       if (couponIdx === 138) {
//         result.updateInUsedTrue = true;
//       } else {
//         result.updateInUsedTrue = await Service.Coupon.updateInUsedTrue(couponRelation);
//       }
//     }

//     // 첫 구매 시 유저 정보 수정 및 업데이트
//     if (!user.purchased) {
//       result.setPurchasedTrue = await Service.User.setPurchasedTrue(user);
//     }

//     // 친구 추천 프로세스
//     if (user.refUserIdx) {
//       if (!(await Repository.Refer.isAlreadyDoesRefer(user.idx))) {
//         result.referCreate = await Service.Refer.create(user, order);
//       }
//     }
//   } catch (error) {
//     await Repository.Order.deleteOrder(order);
//     throw error;
//   }

//   // 리턴
//   return {
//     code: 'SUCCESS',
//     message: '주문이 성공적으로 접수되었습니다',
//     // order,
//     // menuDailys,
//     // address,
//     // result,
//   };
// }
