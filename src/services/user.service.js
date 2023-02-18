const { NotFoundError, AuthorizationError, ConflictError } = require('../models/errors');
const { User, UserMapper } = require('../models/user');
const { ObjectId } = require('mongodb');
const db = require('../mongo').db();

let users = db.collection('users');
let posts = db.collection('posts');
let comments = db.collection('comments');
let follows = db.collection('follows');

const getUsers = async () => {
    const schema = {
        pass: 0
    }
    
    return await users.find({}).project(schema).toArray();
}

const getUser = async (user_id) => {

    const pipeline = [
        {
            '$match': {
                _id: ObjectId(user_id)
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
        },
        {
            '$project': {
                pass: 0,
            }
        }
    ]

    let user = (await users.aggregate(pipeline).toArray())[0] || null;
    if (!user) throw new NotFoundError('User does not exist');

    user = {
        ...user,
        followers: user.followers.length,
        following: user.following.length,
        isAdmin: user.roles.includes('admin')
    }

    return user;
}

const editUser = async (user_creds, current_user) => {

    const id_query = { _id: ObjectId(user_creds._id) };
    let email_query;

    if(user_creds.email)
        email_query = { email: user_creds.email };

    let existing_user = await users.findOne(id_query);
    if (!existing_user) throw new NotFoundError('User does not exist');

    if(email_query) {
        let existing_email = await users.findOne(email_query);
        if (existing_email) throw new ConflictError('Email already used');
    }

    if (!existing_user._id.equals(current_user._id) && !current_user.roles.includes('admin')) {
        throw new AuthorizationError("Action not permitted");
    }

    let updated_user = new UserMapper(user_creds);
    await users.updateOne(id_query, { $set: updated_user });

    const { pass, roles, ...output_user } = await users.findOne(id_query)
    return output_user;
}

const delUser = async (user, current_user) => {
    const query = { _id: ObjectId(user._id) };
    const owner_query = { owner: ObjectId(user._id) };

    let existing_user = await users.findOne(query);
    if (!existing_user) throw new NotFoundError('User does not exist');

    if (existing_user._id.equals(current_user._id)) {
        throw new ConflictError('Cannot delete self');
    }

    await follows.deleteMany({ followee: ObjectId(user._id) });
    await comments.deleteMany(owner_query);
    await follows.deleteMany(owner_query);
    await posts.deleteMany(owner_query);

    await users.deleteOne(query);

    return;
}

module.exports = {
    getUsers,
    getUser,
    editUser,
    delUser
}