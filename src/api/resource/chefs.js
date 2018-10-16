const { chef } = require('src/models');
const { formatResponse } = require('src/api/formats');

async function getAll(req, res) {
  const chefs = await chef.findAll();
  res.send(formatResponse(chefs));
}

module.exports = { getAll };
