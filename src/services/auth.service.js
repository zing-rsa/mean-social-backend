const User = require('../models/user')
const config = require('../config')
const jwt = require('jsonwebtoken')
const db = require('../mongo').db()
const bcrypt = require('bcrypt')

let users = db.collection('users');

const createUser = async (user) => {
    var new_user = new User(user);

    // TODO: check user doesn't exist

    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(user.pass, salt);

    await users.insertOne({ ...new_user, pass: pass })

    const token = jwt.sign(
        { email: new_user.email },
        config.jwt_secret,
        {
            expiresIn: "2h",
        }
    );

    new_user.token = token;

    return new_user
}

const login = async (username) => {
    query = { username: username }
    return await users.find(query).toArray(); // use projection
}


module.exports = {
    createUser,
    login
}