const { NotFoundError, AuthorizationError } = require('../models/errors');
const { ObjectId } = require('mongodb');
const db = require('../mongo').db();

let posts = db.collection('posts');

const createPost = async (post, current_user) => {

    post = {
        ...post,
        timestamp: new Date(),
        owner: current_user._id
    }

    let inserted_post = await posts.insertOne(post);

    return {
        ...post,
        _id: inserted_post.insertedId.toHexString()
    }
}

const getPosts = async () => {
    return await posts.find({}).toArray();
}

const getUserPosts = async (user_id) => {
    const query = { owner: ObjectId(user_id) }

    let user_posts = await posts.find(query).toArray();
    return user_posts;
}

const delPost = async (post, current_user) => {
    const query = { _id: ObjectId(post._id)};

    let existing_post = await posts.findOne(query);
    if (!existing_post) throw new NotFoundError('Post does not exist');

    if (!existing_post.owner.equals(current_user._id) && !current_user.roles.includes('admin')) {
        throw new AuthorizationError("Action not permitted");
    }

    await posts.deleteOne(query);
    return;
}

module.exports = {
    createPost,
    getUserPosts,
    getPosts,
    delPost
}