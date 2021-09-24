const _ = require('lodash');
const constants = require('../config/constants');
const jwt = require('../utility/jwt');
const User = require('../models/user');

const userAuthMiddleware = {};

userAuthMiddleware.loadUser = (req, res, next) => {
  const { headers } = req;

  if (_.isEmpty(headers.authorization)) {
    res.status(constants.code.error.unauthorized).json({ error: 'ERR_UNAUTH' });
  } else {
    const decoded = jwt.decodeAuthToken(headers.authorization.replace('Bearer ', ''));
    if (decoded) {
      User.findOne({ _id: decoded.id })
        .then((user) => {
          if (user) {
            req.user = user;
            next();
          } else {
            res.status(constants.code.error.unauthorized).json({ error:'ERR_TOKEN_EXP'});
          }
        })
        .catch((err) => {
          logger.error(err);
          res.status(constants.code.error.unauthorized).json({ error: 'ERR_TOKEN_EXP' });
        });
      req.user = decoded;
    } else {
      res.status(constants.code.error.unauthorized).json({ error: 'ERR_TOKEN_EXP' });
    }
  }
};


module.exports = userAuthMiddleware;