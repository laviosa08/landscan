const jwt = require('jsonwebtoken');

const jwtUtil = {};

jwtUtil.getAuthToken = (data) => {
  return jwt.sign(data, process.env.JwtSecret);
};

jwtUtil.decodeAuthToken = (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JwtSecret);
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  return false;
};

module.exports = jwtUtil;