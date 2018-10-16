const { isString } = require('lodash');
const { Op } = require('sequelize');
const { menu: menuModel } = require('src/models');
const { formatResponse } = require('src/api/formats');
var AWS = require('aws-sdk');
/**
 * getAll Menus 
 * limit, offset을 쓰지 않는다. 
 * 현재는 search 역할도 겸하지만, 분리해도 좋다.
 * search는 간단하게 like 형태 그대로를 쿼리할 수 있도록 한다.
 */
async function getAll(req, res) {
  const { menuType, keyword } = req.query || {};

  const where = {};

  if (isString(menuType)) where.menuType = menuType.toUpperCase();

  // keyword를 engName, korName, shortName에 각각 like로 쿼리하여 걸리는 메뉴를 리턴한다.
  if (isString(keyword)) {
    where[Op.or] = [
      {
        shortName: {
          [Op.like]: keyword,
        },
      },
      {
        nameMenuKor: {
          [Op.like]: keyword,
        },
      },
      {
        nameMenuEng: {
          [Op.like]: keyword,
        },
      },
    ];
  }
  const options = {
    where,
  };

  const menus = await menuModel.findAll(options);
  res.send(formatResponse(menus));
}

/**
 * 
 * @param {object} req
 * @param {number} req.params.menuId
 */
async function getOne(req, res) {
  const { menuId } = req.params || {};

  const where = { id: menuId };
  const options = {
    where,
  };

  const menu = await menuModel.findOne(options);
  res.send(formatResponse(menu));
}

async function postMenu(req, res) {
  //아래의 정보를 body에서 받아옴.
  const {
    backban,
    calorie,
    coupon,
    ingredients,
    menuExplanation,
    menuName,
    menuPicture,
    menuType,
    microwave,
    point,
    price,
    selectedChef,
  } = req.body;

  let lastMenu = '';

  // 메뉴 타입을 체크해서, 마지막 메뉴등록정보 가져오기: idx를
  // type에 따라 다르게 해서 마지막id+1로 넣어줘야 하기떄문

  lastMenu = await menuModel.findOne({
    where: {
      menuType,
    },
    order: [['idx', 'DESC']],
  });

  //create 해준다.
  const menu = await menuModel.create({
    id: lastMenu.get().id + 1,
    menuType,
    isBackban: backban,
    nameMenu: `${menuName.kor}.${menuName.eng}`,
    nameMenuKor: menuName.kor,
    nameMenuEng: menuName.eng,
    foodflyName: menuName.kor,
    shortName: menuName.bill,
    price: price.b2c,
    altPrice: price.b2c,
    b2BPrice: price.b2b,
    rating: 0,
    reviewCount: 0,
    imageUrlMenu: menuPicture,
    idxChef: selectedChef.id,
    priority: 0,
    ready: 1,
    story: menuExplanation,
    ingredients,
    calories: calorie,
    microwave,
    isRequireAdult: 0,
    isAvailablePoint: point,
    isAvailableCoupon: coupon,
  });
  res.status(200).send('잘 만들어졌음');
}

async function updateMenu(req, res) {
  //아래의 정보를 body에서 받아옴.
  const {
    idx,
    backban,
    calories,
    ingredients,
    name,
    type,
    story,
    isRequireMicrowave,
    price,
  } = req.body;
  //create 해준다.
  try {
    await menuModel.update(
      {
        menuType: type,
        isBackban: backban,
        nameMenu: name.korean + '.' + name.english,
        nameMenuKor: name.korean,
        nameMenuEng: name.english,
        foodflyName: name.korean,
        shortName: name.short,
        price: price.default,
        altPrice: price.default,
        b2BPrice: price.b2b,
        priority: 0,
        ready: 1,
        story,
        ingredients,
        calories,
        microwave: isRequireMicrowave ? '1' : '0',
        isRequireAdult: 0,
      },
      {
        where: {
          idx,
        },
      }
    );
    res.status(200).send('메뉴가 업데이트 되었습니다!');
  } catch (err) {
    res.status(500).send('메뉴가 업데이트 되지 않았습니다!');
  }
}

async function uploadImage(req, res) {
  const file = req.files.file;
  //아마존 S3에 저장하려면 먼저 설정을 업데이트합니다.
  AWS.config.region = 'ap-northeast-2'; //Seoul
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });

  var s3_params = {
    Bucket: 'cloud.plating.co.kr',
    Key: `images/menu/${file.name}`,
    ACL: 'public-read',
    ContentType: file.mimetype,
    Body: file.data,
  };
  var s3obj = new AWS.S3({ params: s3_params });
  s3obj
    .upload()
    .on('httpUploadProgress', function(evt) {})
    .send(function(err, data) {
      //S3 File URL
      res.status(200).send(data.key);
      //어디에서나 브라우저를 통해 접근할 수 있는 파일 URL을 얻었습니다.
    });
}

module.exports = {
  getAll,
  getOne,
  postMenu,
  updateMenu,
  uploadImage,
};
