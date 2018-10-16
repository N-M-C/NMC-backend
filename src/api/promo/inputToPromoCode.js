const { promo } = require('src/models');
const logger = require('src/utils/logger');
async function createPromoCode(req, res) {

  this.state({
    data:null

  })



  console.log("req.body: ",req)
  try {
    const promotion = await promo
      .create({
        idx: req.body.id,
        promoCode: req.body.promoCode,
        eventMoney: req.body.event,
        available: req.body.available,
        type: req.body.type,
        expireAt: new Date(),
        isOneOff: req.body.isOneOff,
        dailyMaximumUsingCount: req.body.dailyMaximumUsingCount
      })
    res.status(200).json({data:promotion, message:"insert complete"});
  }
  catch(err){
      logger.error(err);
      res.status(500).send(err);

      console.log("error: ",err);
  }
}


module.exports = {
  createPromoCode
};
