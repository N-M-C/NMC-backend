const { menuDaily, menu } = require('src/models');

async function createBackbanMenuDaily(req, res) {
  const { date, menu, amount } = req.body || {};

  await menuDaily
    .create({
      serveDate: date,
      menuId: menu,
      stock: amount,
      ordered: 0,
      area: 'backban',
      serviceType: 'LUNCH',
    })
    .then(res => res.status(200).send('make backban menu complete'))
    .catch(() =>
      res
        .status(500)
        .json({ error: { code: 'FORBIDDEN', status: 403, message: 'no' } })
    );

  res.status(200).send('create backban menudaily success !!');
}

async function getBackbanMenuDaily(req, res) {
  let result = [];
  const backbanMenuDailys = await menuDaily.findAll({
    where: {
      area: 'backban',
    },
    order: [['id', 'DESC']],
  });
  const backbanMenuList = await menu.findAll({
    where: {
      isBackban: 1,
    },
    attributes: ['id', 'shortName'],
  });

  backbanMenuDailys.forEach(backban => {
    backbanMenuList.forEach(menu => {
      if (backban.get().menuId === menu.id) {
        result.push({
          id: backban.get().id,
          serveDate: backban.serveDate,
          menuId: backban.menuId,
          name: menu.shortName,
          stock: backban.stock,
          ordered: backban.ordered,
        });
      }
    });
  });

  res.status(200).json(result);
}

async function getBackbanMenuName(req, res) {
  const backbanMenuNames = await menu.findAll({
    where: {
      isBackban: 1,
    },
    attributes: ['id', 'shortName'],
  });

  res.status(200).json(backbanMenuNames);
}

module.exports = {
  createBackbanMenuDaily,
  getBackbanMenuDaily,
  getBackbanMenuName,
};
