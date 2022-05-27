const { UpdateError, DeletionError } = require('../models/errors');
const { User, UserMapper } = require('../models/user');
const ObjectId = require('mongodb').ObjectId
const db = require('../mongo').db();

let users = db.collection('users');

const getUsers = async () => {
    const schema = { pass: 0 };
    return await users.find({}).project(schema).toArray();
}

const getUser = async (user_id) => {
    const query = { _id: ObjectId(user_id) };
    const schema = { pass: 0 };
    return await users.find(query).project(schema).toArray(); // use findone
}

const editUser = async (user_creds) => {
    const query = { _id: ObjectId(user_creds._id) };
    
    let existing_user = await users.findOne(query);
    if (!existing_user) throw new UpdateError('User does not exist');
    
    let updated_user = new UserMapper(user_creds);
    await users.update(query, { $set: updated_user });

    let output_user = new User(await users.findOne(query));
    return output_user;
}

const delUser = async (user_id) => {
    const query = { _id: user_id };

    let existing_user = await users.findOne(query);
    if (!existing_user) throw new DeletionError('User does not exist');

    await users.deleteOne(query);
    
    return;
}

module.exports = {
    getUsers,
    getUser,
    editUser,
    delUser
}