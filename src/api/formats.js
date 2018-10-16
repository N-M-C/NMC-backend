function formatResponse(result, { ...additionalKeys } = {}) {
  const res = { result, ...additionalKeys };
  return res;
}

function formatError(error) {
  const res = { error };
  return res;
}

module.exports = {
  formatResponse,
  formatError,
};
