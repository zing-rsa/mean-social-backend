const { ConflictError, NotFoundError, AuthError } = require('../models/errors')
const { UserMapper } = require('../models/user')
const ObjectId = require('mongodb').ObjectId;
const db = require('../mongo').db()
const bcrypt = require('bcrypt')

const {
    getAccessToken,
    getRefreshToken,
    validateRefreshToken
} = require('./token.service');

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

const login = async (user_creds) => {

    const pipeline = [
        {
            '$match': {
                email: user_creds.email
            }
        },
        {
            '$lookup': {
                'from': 'follows',
                'localField': '_id',
                'foreignField': 'owner',
                'as': 'following'
            }
        },
        {
            '$lookup': {
                'from': 'follows',
                'localField': '_id',
                'foreignField': 'followee',
                'as': 'followers'
            }
        }
    ]

    let existing_user = (await users.aggregate(pipeline).toArray())[0] || null;
    if (!existing_user) throw new AuthError('Incorrect credentials');

    const validPassword = await bcrypt.compare(user_creds.pass, existing_user.pass);
    if (!validPassword) throw new AuthError('Incorrect credentials');

    const { pass, following, followers, roles, ...stripped } = existing_user;

    return {
        ...stripped,
        followers: existing_user.followers.length,
        following: existing_user.following.length,
        access_token: getAccessToken(existing_user._id),
        refresh_token: getRefreshToken(existing_user._id),
        isAdmin: roles.includes('admin')
    };
}

const signUp = async (user_creds) => {
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

    let insert_detail = await users.insertOne(new_user)

    const { pass, ...stripped } = new_user;

    return {
        ...stripped,
        access_token: getAccessToken(insert_detail.insertedId),
        refresh_token: getRefreshToken(insert_detail.insertedId)
    };
}

module.exports = {
    signUp,
    refresh,
    login
}