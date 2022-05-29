
function authorizeAll(roles) {

  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const user = req.user;

    if (['POST', 'PUT', 'DELETE'].includes(req.method)){
      if (req.body._id && req.body._id == user._id){
        user.roles.push('owner');
      }
    }

    for (let role of roles) {
      if (!user.roles.includes(role)){
        return res.status(403).json({ message: 'Unauthorized to perform this action' }).send();
      }
    }
    
    next();
  };
}

function authorizeAny(roles) {

  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const user = req.user;

    if (['POST', 'PUT', 'DELETE'].includes(req.method)){
      if (req.body._id && req.body._id == user._id){
        user.roles.push('owner');
      }
    }

    for (let role of roles) {
      if (user.roles.includes(role)){
        return next();
      }
    }
    
    return res.status(403).json({ message: 'Unauthorized to perform this action' }).send();
  };
}

module.exports = {
  authorizeAll,
  authorizeAny
};