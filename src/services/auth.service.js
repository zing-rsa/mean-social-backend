const { ConflictError, NotFoundError, AuthError } = require('../models/errors')
const { User, UserMapper } = require('../models/user')
const ObjectId = require('mongodb').ObjectId;
const db = require('../mongo').db()
const bcrypt = require('bcrypt')

const {
    getAccessToken,
    getRefreshToken,
    validateRefreshToken
} = require('./token.service')

let users = db.collection('users');


const refresh = async (req) => {

    let decoded_id;
    req.cookies = {};

    const { headers: { cookie } } = req;

    if (!cookie) throw new AuthError('Refresh cookie not found');

    let items = cookie.split('; ') || [];

    items.forEach((item) => {
        split = item.split('=');
        req.cookies[split[0]] = split[1];
    });

    let token = req.cookies['refresh_token'];

    if (!token) throw new AuthError('Refresh token not found');

    token = token.replace('Bearer ', '');

    try {
        decoded_id = (validateRefreshToken(token))._id;
    } catch (e) {
        throw new AuthError('Invalid refresh token');
    }

    const user = await users.findOne({ _id: ObjectId(decoded_id) });
    if (!user) throw new NotFoundError('Invalid User');

    const refreshed_token = getAccessToken(decoded_id);

    return refreshed_token;
}

const createUser = async (user_creds) => {
    let new_user = new UserMapper(user_creds);

    let existing_user = await users.findOne({ email: new_user.email })
    if (existing_user) throw new ConflictError('Email already used')

    const salt = await bcrypt.genSalt(10);
    const user_pass = await bcrypt.hash(new_user.pass, salt);

    new_user = {
        ...new_user,
        pass: user_pass,
        followers: 0,
        following: 0,
        roles: ['user']
    }

    await users.insertOne(new_user)

    const { pass, ...withoutPass} = new_user;

    return withoutPass;
}

const login = async (user_creds) => {
    const query = { email: user_creds.email };

    let existing_user = await users.findOne(query);
    if (!existing_user) throw new AuthError('Incorrect credentials');

    const validPassword = await bcrypt.compare(user_creds.pass, existing_user.pass);
    if (!validPassword) throw new AuthError('Incorrect credentials');

    return {
        access_token: getAccessToken(existing_user._id),
        refresh_token: getRefreshToken(existing_user._id)
    };
}

module.exports = {
    createUser,
    refresh,
    login
}