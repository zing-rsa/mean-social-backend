const { validateRefreshToken } = require('../services/token.service')

const refreshOnly = (req, res, next) => {

    const { headers: { cookie } } = req;

    let items = cookie.split('; ') || [];

    req.cookies = {}

    items.forEach((item) => {
        split = item.split('=');
        req.cookies[split[0]] = split[1];
    });

    console.log('cookies: ', req.cookies);

    next();
}

module.exports = {
    refreshOnly
}