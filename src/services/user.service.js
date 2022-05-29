const { NotFoundError } = require('../models/errors');
const { User, UserMapper } = require('../models/user');
const ObjectId = require('mongodb').ObjectId;
const db = require('../mongo').db();

let users = db.collection('users');

const getUsers = async () => {
    const schema = { pass: 0 };
    return await users.find({}).project(schema).toArray();
}

const getUser = async (user_id) => {
    const query = { _id: ObjectId(user_id) };

    let user = await users.findOne(query);
    if (!user) throw new NotFoundError('User does not exist');

    let output_user = new User(user);
    return output_user;
}

const editUser = async (user_creds) => {
    const query = { _id: ObjectId(user_creds._id) };

    let existing_user = await users.findOne(query);
    if (!existing_user) throw new NotFoundError('User does not exist');

    let updated_user = new UserMapper(user_creds);
    await users.updateOne(query, { $set: updated_user });

    let output_user = new User(await users.findOne(query));
    return output_user;
}

const delUser = async (user) => {
    const query = { _id: user._id };

    let existing_user = await users.findOne(query);
    if (!existing_user) throw new NotFoundError('User does not exist');

    await users.deleteOne(query);

    return;
}

module.exports = {
    getUsers,
    getUser,
    editUser,
    delUser
}