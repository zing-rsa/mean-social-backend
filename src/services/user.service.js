const User = require('../models/user');

const db = require('../mongo').db()

let users = db.collection('users');

const getUsers = async () => {
    const schema = { _id: 0, pass: 0 }
    return await users.find({}).project(schema).toArray();
}

const getUser = async (username) => {
    const query = { username: username }
    const schema = { _id: 0, pass: 0 }
    return await users.find(query).project(schema).toArray();
}

const editUser = async (user) => {
    const query = { email: user.email }

    let existing_user = await users.findOne(query)
    if (!existing_user) throw new UpdateError('User does not exist')

    let setter = new User(user)
    await users.update(query, { $set: { ...setter } })

    let updated_user = new User(await users.findOne(query))
    return updated_user
}

module.exports = {
    getUsers,
    getUser
}