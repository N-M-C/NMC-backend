const { pick } = require('lodash/fp');

function pickUserParamsForUser(data) {
  const picked = pick([
    'id',
    'companyId',
    'userCode',
    'refUserId',
    'mobile',
    'point',
    'loginType',
    'email',
    'profileImage',
  ])(data);

  return {
    ...picked,
    name:
      data.nickname ||
      data.realName ||
      data.userName ||
      data.lastName + data.firstName,
  };
}

module.exports = {
  pickUserParamsForUser,
};
