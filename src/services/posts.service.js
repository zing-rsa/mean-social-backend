const { NotFoundError, AuthorizationError } = require('../models/errors');
const { ObjectId } = require('mongodb');
const db = require('../mongo').db();

let posts = db.collection('posts');
let comments = db.collection('comments');

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

const getPosts = async (current_user) => {

    const pipeline = [
        {
            '$lookup': {
                'from': 'comments',
                'let': { "postId": "$_id" },
                'pipeline': [
                    { '$match': { '$expr': { '$eq': ['$parent', '$$postId'] } } },
                    {
                        '$lookup': {
                            'from': 'users',
                            'let': { 'commentOwner': '$owner' },
                            'pipeline': [
                                { '$match': { '$expr': { '$eq': ["$_id", '$$commentOwner'] } } }
                            ],
                            'as': 'owner'
                        }
                        
                    },
                    {
                        "$unwind": "$owner"
                    }
                ],
                'as': 'comments'
            }
        },
        {
            '$lookup': {
                'from': 'users',
                'localField': 'owner',
                'foreignField': '_id',
                'as': 'owner'
            }
        },
        {
            "$unwind": "$owner"
        },
        {
            '$lookup': {
                'from': 'likes',
                'localField': '_id',
                'foreignField': 'post',
                'as': 'likes'
            }
        },
        {
            "$project": {
                "owner.email": 0,
                "owner.bio": 0,
                "owner.pass": 0,
                "owner.roles": 0,
                "comments.owner.email": 0,
                "comments.owner.bio": 0,
                "comments.owner.pass": 0,
                "comments.owner.roles": 0
            }
        },
        {
            '$sort': {
                'timestamp': -1
            }
        }
    ]

    const data = await posts.aggregate(pipeline).toArray();

    for (let i = 0; i < data.length; i++) {
        if (data[i].likes.map(l => l.owner.equals(current_user._id)).length){
            data[i].likes = {
                'likeCount': data[i].likes.length,
                'isLiked': true
            }
        } else {
            data[i].likes = {
                'likeCount': data[i].likes.length,
                'isLiked': false
            }
        }
    }

    return data;
}

const getUserPosts = async (user_id, current_user) => {

    const pipeline = [
        {
            '$match': {
                owner: ObjectId(user_id)
            }
        },
        {
            '$lookup': {
                'from': 'comments',
                'localField': '_id',
                'foreignField': 'parent',
                'as': 'comments'
            }
        },
        {
            '$lookup': {
                'from': 'users',
                'localField': 'owner',
                'foreignField': '_id',
                'as': 'owner'
            }
        },
        {
            "$unwind": "$owner"
        },
        {
            '$lookup': {
                'from': 'likes',
                'localField': '_id',
                'foreignField': 'post',
                'as': 'likes'
            }
        },
        {
            "$project": {
                "owner.email": 0,
                "owner.bio": 0,
                "owner.pass": 0,
                "owner.roles": 0
            }
        },
        {
            '$sort': {
                'timestamp': -1
            }
        }
    ]

    let data = await posts.aggregate(pipeline).toArray();

    for (let i = 0; i < data.length; i++) {
        if (data[i].likes.map(l => l.owner.equals(current_user._id)).length){
            data[i].likes = {
                'likeCount': data[i].likes.length,
                'isLiked': true
            }
        } else {
            data[i].likes = {
                'likeCount': data[i].likes.length,
                'isLiked': false
            }
        }
    }

    return data;
}

const delPost = async (post, current_user) => {

    const post_query = { _id: ObjectId(post._id) }
    const comment_query = { parent: ObjectId(post._id) }

    let existing_post = await posts.findOne(post_query);
    if (!existing_post) throw new NotFoundError('Post does not exist');

    if (!existing_post.owner.equals(current_user._id) && !current_user.roles.includes('admin')) {
        throw new AuthorizationError("Action not permitted");
    }

    await comments.deleteMany(comment_query);
    await posts.deleteOne(post_query);

    return;
}

module.exports = {
    createPost,
    getUserPosts,
    getPosts,
    delPost
}