const { ConflictError, NotFoundError, AuthError } = require('../models/errors')
const { User, UserMapper } = require('../models/user')
const config = require('../config')
const jwt = require('jsonwebtoken')
const db = require('../mongo').db()
const bcrypt = require('bcrypt')

let users = db.collection('users');

const createUser = async (user_creds) => {
    let new_user = new UserMapper(user_creds);

    let existing_user = await users.findOne({ email: new_user.email })
    if (existing_user) throw new ConflictError('Email already used')

    const salt = await bcrypt.genSalt(10);
    new_user.pass = await bcrypt.hash(new_user.pass, salt);
    new_user.roles = ['user'];

    let inserted_user = await users.insertOne(new_user)

    const token = jwt.sign(
        { _id: inserted_user.insertedId.toHexString() },
        config.jwt_secret,
        {
            expiresIn: '30m',
        }
    );

    output_user = new User(new_user)
    output_user.token = token;

    return output_user;
}

const login = async (user_creds) => {
    const query = { email: user_creds.email };

    let existing_user = await users.findOne(query);
    if (!existing_user) throw new NotFoundError('User not found');

    const validPassword = await bcrypt.compare(user_creds.pass, existing_user.pass);
    if (!validPassword) throw new AuthError('Incorrect password');

    const token = jwt.sign(
        { _id: existing_user._id },
        config.jwt_secret,
        {
            expiresIn: '30m',
        }
    );

    existing_user = new User(existing_user)
    existing_user.token = token

    return existing_user

}

module.exports = {
    createUser,
    login
}