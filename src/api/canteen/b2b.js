const { company } = require('src/models');
const axios = require('axios');

const getNomalizedAddressUrl = 'https://address.plating.co.kr';

async function createCompany(req, res) {
  const initialData = req.body;
  const { address, name, url, detail } = initialData;
  const nomalizedAddress = await callAddressNomaliser(address);
  const {
    roadNameAddress,
    jibunAddress,
    available,
    lunchAvailable,
    latitude,
    longitude,
    area,
  } = nomalizedAddress;

  await company
    .create({
      name,
      engName: url,
      address: jibunAddress,
      roadNameAddress,
      addressDetail: detail,
      inUse: 1,
      area,
      lunchDeliveryAvailable: lunchAvailable,
      deliveryAvailable: available,
      lat: latitude,
      lon: longitude,
    })
    .then(res => res.status(200).send('create company'))
    .catch(() =>
      res
        .status(500)
        .json({ error: { code: 'FORBIDDEN', status: 403, message: 'no' } })
    ); //에러처리 해주어야함(status500으로 노티스 되어야함)

  res.status(200).json({ newUrl: url });
}

function callAddressNomaliser(address) {
  return axios
    .get(getNomalizedAddressUrl, {
      params: {
        query: address,
      },
    })
    .then(res => {
      return res.data[0];
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = {
  createCompany,
};
