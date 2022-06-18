const { NotFoundError, AuthorizationError } = require('../models/errors');
const { ObjectId } = require('mongodb');
const db = require('../mongo').db();

let comments = db.collection('comments');
let posts = db.collection('posts');

const createComment = async (comment, current_user) => {

    let {_id, name, surname, username } = current_user;

    comment = {
        ...comment,
        parent: ObjectId(comment.parent),
        timestamp: new Date(),
        owner: _id
    }

    let parent = await posts.findOne({ _id: comment.parent});
    if (!parent) throw new NotFoundError('Parent not found');

    let inserted_comment = await comments.insertOne(comment);

    return {
        ...comment,
        _id: inserted_comment.insertedId.toHexString()
    }
}

const postComments = async (parent) => {

    // check for parent
    
    const pipeline = [
        {
            '$match': {
                parent: ObjectId(parent)
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

    let post_comments = await comments.aggregate(pipeline).toArray();

    return post_comments;

}

const delComment = async (comment, current_user) => {

    const query = { _id: ObjectId(comment._id)};

    let existing_comment = await comments.findOne(query);
    if (!existing_comment) throw new NotFoundError('Comment does not exist');

    if (!existing_comment.owner.equals(current_user._id) && !current_user.roles.includes('admin')) {
        throw new AuthorizationError("Action not permitted");
    }

    await comments.deleteOne(query);
    return;

}

module.exports = {
    createComment,
    postComments,
    delComment
}