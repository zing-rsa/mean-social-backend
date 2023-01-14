const { ConflictError, NotFoundError, AuthError } = require('../models/errors')
const { User, UserMapper } = require('../models/user')
const db = require('../mongo').db()
const bcrypt = require('bcrypt')

const {
    getAccessToken,
    getRefreshToken,
    validateRefreshToken,
    validateAccessToken
} = require('./token.service')

let users = db.collection('users');


const refresh = async (token) => {

    const previous_token_user = validateAccessToken(token);





}

const createUser = async (user_creds) => {
    let new_user = new UserMapper(user_creds);

    let existing_user = await users.findOne({ email: new_user.email })
    if (existing_user) throw new ConflictError('Email already used')

    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(new_user.pass, salt);

    new_user = {
        ...new_user,
        pass: pass,
        followers: 0,
        following: 0,
        roles: ['user']
    }

    let inserted_user = await users.insertOne(new_user)

    const access_token = getAccessToken(inserted_user.insertedId.toHexString());
    const refresh_token = getAccessToken(inserted_user.insertedId.toHexString());

    output_user = new User(new_user)

    // add tokens to headers
    output_user.token = token;

    return output_user;
}

const login = async (user_creds) => {
    const query = { email: user_creds.email };

    let existing_user = await users.findOne(query);
    if (!existing_user) throw new AuthError('Incorrect credentials');

    const validPassword = await bcrypt.compare(user_creds.pass, existing_user.pass);
    if (!validPassword) throw new AuthError('Incorrect credentials');

    const access_token = getAccessToken(existing_user._id);
    const refresh_token = getAccessToken(existing_user._id);

    existing_user.token = token

    //send tokens in headers

    const { pass, ...withoutPass } = existing_user;

    return withoutPass;

}

module.exports = {
    createUser,
    login
}