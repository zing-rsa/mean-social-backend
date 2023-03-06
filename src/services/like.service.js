const { createNotification } = require('./notification.service');
const { NotFoundError, ConflictError } = require('../models/errors');
const { ObjectId } = require('mongodb');
const db = require('../mongo').db();

let posts = db.collection('posts');
let likes = db.collection('likes');


const like = async (details, current_user) => {

    let like = {
        post: ObjectId(details.post_id),
        owner: current_user._id
    }

    const post = await posts.findOne({ _id: like.post });
    if (!post) throw new NotFoundError('Post not found');

    const existing_like = await likes.findOne(like);
    if (existing_like) throw new ConflictError('Post already liked');

    await likes.insertOne(like);

    if (!post.owner.equals(current_user._id)){
        let notification = {
            owner: post.owner,
            action: 'like',
            action_item: like.post,
            action_owner: current_user._id
        }
    
        createNotification(notification);
    }

    let postLikes = await getPostLikes(details.post_id, current_user);
    
    return postLikes;
}

const unlike = async (details, current_user) => {

    let unlike = {
        post: ObjectId(details.post_id),
        owner: current_user._id
    }

    const like = await likes.findOne(unlike);
    if (!like) throw new NotFoundError('Post is not liked');

    await likes.deleteOne(unlike);

    let postLikes = await getPostLikes(details.post_id, current_user);
    
    return postLikes;
}

const getPostLikes = async (post_id, current_user) => {

    const postLikes = await likes.find({ post: ObjectId(post_id) }).toArray();
    let isLiked = false;

    for (let i = 0; i < postLikes.length; i++) {
        if (postLikes[i].owner.equals(current_user._id)) {
            isLiked = true;
        }
    }

    return {
        likeCount: postLikes.length,
        isLiked
    }
}

module.exports = {
    like, unlike, getPostLikes
}