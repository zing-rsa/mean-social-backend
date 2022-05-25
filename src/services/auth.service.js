const { SignupError, LoginError } = require('../models/errors')
const User = require('../models/user')
const config = require('../config')
const jwt = require('jsonwebtoken')
const db = require('../mongo').db()
const bcrypt = require('bcrypt')

let users = db.collection('users');

const createUser = async (user) => {
    let new_user = new User(user);

    let existing_user = await users.findOne({ email: user.email })
    if (existing_user) throw new SignupError('Email already used')

    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(user.pass, salt);

    let inserted_user = await users.insertOne({ ...new_user, pass: pass })

    const token = jwt.sign(
        { id: inserted_user.insertedId.toHexString() },
        config.jwt_secret,
        {
            expiresIn: "1m",
        }
    );

    new_user.token = token;

    return new_user;
}

const login = async (user_creds) => {
    const query = { email: user_creds.email };

    let existing_user = await users.findOne(query);
    if (!existing_user) throw new LoginError('User does not exist');

    const validPassword = await bcrypt.compare(user_creds.pass, existing_user.pass);
    if (!validPassword) throw new LoginError('Incorrect password');

    const token = jwt.sign(
        { id: existing_user._id },
        config.jwt_secret,
        {
            expiresIn: "1m",
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