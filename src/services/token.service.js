const jwt = require('jsonwebtoken');
const config = require('../config');

const getAccessToken = (user) => {
    return jwt.sign(
        { _id: user },
        config.jwt_access_secret,
        {
            expiresIn: 30 * 60,
        }
    );
}

const getRefreshToken = (user) => {
    return jwt.sign(
        { _id: user },
        config.jwt_refresh_secret,
        {
            expiresIn: 24 * 60 * 60,
        }
    );
}

const validateAccessToken = (token) => {
    return jwt.verify(token, config.jwt_access_secret);
}

const validateRefreshToken = (token) => {
    return jwt.verify(token, config.jwt_refresh_secret);
}

module.exports = {
    getAccessToken,
    getRefreshToken,
    validateRefreshToken,
    validateAccessToken
}