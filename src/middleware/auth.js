const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(403).json({ message: 'Token not included'}).send();
  }

  try {
    const decoded = jwt.verify(token, config.jwt_secret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' }).send();
  }
  return next();
};

module.exports = verifyToken;