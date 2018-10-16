const db = require('src/db/sequelize');

const couponTxn = require('./couponTxn')(db);
const orderDetail = require('./orderDetail')(db);
const orderMeta = require('./orderMeta')(db);
const deliveryMeta = require('./deliveryMeta')(db);
const pendingOrderMeta = require('./pendingOrderMeta')(db);
const user = require('./user')(db);
const userAddress = require('./userAddress')(db);
const menu = require('./menu')(db);
const meta = require('./meta')(db);
const menuDaily = require('./menuDaily')(db);
const company = require('./company')(db);
const chef = require('./chef')(db);
const card = require('./card')(db);
const promo = require('./promoCode')(db);
const b2bUser = require('./b2bUser')(db);
const b2bOrderMeta = require('./b2bOrderMeta')(db);

/**
 * schema 관계 작성
 */
orderDetail.belongsTo(menu, { foreignKey: 'menuId' });

module.exports = {
  db,
  couponTxn,
  orderDetail,
  orderMeta,
  deliveryMeta,
  pendingOrderMeta,
  user,
  userAddress,
  menu,
  menuDaily,
  company,
  meta,
  chef,
  card,
  promo,
  b2bUser,
  b2bOrderMeta,
};
