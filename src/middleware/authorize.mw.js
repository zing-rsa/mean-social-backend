const db = require('../mongo').db();

const authorize = (roles = []) => {

  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const user = req.user;

    for (let role of roles) {
      if (!user.roles.includes(role)) {
        return res.status(403).json({ message: 'Unauthorized to perform this action' }).send();
      }
    }

    next();
  };
}

//const authorizeAny = (roles) => {// DRY ?
//
//  if (typeof roles === 'string') {
//    roles = [roles];
//  }
//
//  return (req, res, next) => {
//    const user = req.user;
//
//    for (let role of roles) {
//      if (user.roles.includes(role)) {
//        return next();
//      }
//    }
//
//    return res.status(403).json({ message: 'Unauthorized to perform this action' }).send();
//  };
//}

module.exports = authorize