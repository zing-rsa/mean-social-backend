const { NotFoundError } = require('../models/errors');
const ObjectId = require('mongodb').ObjectId;
const db = require('../mongo').db();

const { validateAccessToken } = require('../services/token.service')

let users = db.collection('users');

const authenticate = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token not included' });
  }

  try {
    const decoded_id = (validateAccessToken(token))._id;

    const user = await users.findOne({ _id: ObjectId(decoded_id) });
    if (!user) throw new NotFoundError('Invalid User');

    req.user = user;
    
    next();
  } catch (e) {
    if (e instanceof NotFoundError) {
      return res.status(401).json({ message: e.message });
    }
    return res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = authenticate;