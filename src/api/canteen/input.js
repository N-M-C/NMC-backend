const { company } = require('src/models');
const { formatResponse } = require('src/api/formats');

// query string의 회사이름을 리턴하고 area를 'backban'으로 설정해 주는 api
async function getCompanyName(req, res) {
  const name = await company.findOne({
    where: {
      engName: req.params.companyName,
    },
  });

  if (!name) {
    return res.status(404).end();
  }

  let data = formatResponse(name.get());
  data.result.area = 'backban';
  res.send(data); //get()을 안붙여도 되나..?
}

module.exports = {
  getCompanyName,
};
