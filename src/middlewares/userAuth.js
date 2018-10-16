const { verify } = require('src/utils/token');

const tokenKey = 'pt';

function userAuth(req, res, next) {
  const token = req.headers[tokenKey];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'not logged in',
    });
  }

  verify(token)
    .then(decoded => {
      req.userId = decoded.userId;
      if (!decoded.userId) {
        req.userId = decoded.userIdx;
      }
      next();
    })
    .catch(error =>
      res.status(403).json({
        success: false,
        message: 'not valid',
        error,
      })
    );
}

module.exports = userAuth;
