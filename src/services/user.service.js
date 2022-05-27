const { UpdateError, DeletionError } = require('../models/errors')
const User = require('../models/user');
const db = require('../mongo').db();

let users = db.collection('users');

const getUsers = async () => {
    const schema = { _id: 0, pass: 0 };
    return await users.find({}).project(schema).toArray();
}

const getUser = async (username) => {
    const query = { username: username };
    const schema = { _id: 0, pass: 0 };
    return await users.find(query).project(schema).toArray();
}

const editUser = async (user) => {
    // needs some work
    const query = { email: user.email };

    let existing_user = await users.findOne(query); // what if user is trying to update email
    if (!existing_user) throw new UpdateError('User does not exist');

    let setter = new User(user); // if user doesn't send all fields this will overwrite missing fields to null
    await users.update(query, { $set: { ...setter } });

    let updated_user = new User(await users.findOne(query));
    return updated_user;
}

const delUser = async (user_email) => {
    const query = { email: user_email };

    let existing_user = await users.findOne(query);
    if (!existing_user) throw new DeletionError('User does not exist');

    await users.deleteOne(query);
    
    return
}

module.exports = {
    getUsers,
    getUser,
    editUser,
    delUser
}