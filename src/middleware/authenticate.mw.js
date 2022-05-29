const { NotFoundError } = require('../models/errors');
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require('../mongo').db();

let users = db.collection('users');

const authenticate = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(403).json({ message: 'Token not included' }).send();
  }

  try {
    const decoded_id = (jwt.verify(token, config.jwt_secret))._id;

    const user = await users.findOne({ _id: ObjectId(decoded_id) });
    if (!user) throw new NotFoundError('Invalid User');

    req.user = user;
    
    next();
  } catch (e) {
    if (e instanceof NotFoundError) {
      return res.status(401).json({ message: e.message }).send();
    }
    return res.status(401).json({ message: 'Invalid Token' }).send();
  }
};

module.exports = authenticate;