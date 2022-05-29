const { NotFoundError } = require('../models/errors');
const ObjectId = require('mongodb').ObjectId;
const db = require('../mongo').db();

let posts = db.collection('posts');

const createPost = async (post) => {

    post = {
        ...post,
        timestamp: new Date()
    }

    let inserted_post = await posts.insertOne(post);

    return {
        ...post,
        _id: inserted_post.insertedId.toHexString()
    }
}

const getPosts = async () => {
    let posts = await posts.find({}).toArray();
    return posts;
}

const getUserPosts = async (user_id) => {
    const query = { owner: ObjectId(user_id) }

    let user_posts = await posts.find(query).toArray();
    return user_posts;
}

const delPost = async (post) => {
    const query = { _id: ObjectId(post._id)};

    let existing_post = await users.findOne(query);
    if (!existing_post) throw new NotFoundError('Post does not exist');

    await posts.deleteOne(query);
    return;
}

module.exports = {
    createPost,
    getUserPosts,
    getPosts,
    delPost
}