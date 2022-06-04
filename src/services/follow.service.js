const { NotFoundError, ConflictError } = require('../models/errors');
const { ObjectId } = require('mongodb');
const db = require('../mongo').db();

let follows = db.collection('follows');
let users = db.collection('users');


const follow = async (details, current_user) => {

    let follow = {
        followee: ObjectId(details.user_id),
        owner: current_user._id
    }

    if (follow.followee.equals(follow.owner)) throw new ConflictError('Cannot follow self');

    const followee = await users.findOne({ _id: follow.followee });
    if (!followee) throw new NotFoundError('User not found');

    const existing_follow = await follows.findOne(follow);
    if (existing_follow) throw new ConflictError('User already followed');

    await follows.insertOne(follow);
    return follow;

}

const unfollow = async (details, current_user) => {

    let unfollow = {
        followee: ObjectId(details.user_id),
        owner: current_user._id
    }

    const follow = await follows.findOne(unfollow);
    if (!follow) throw new NotFoundError('User is not followed');

    await follows.deleteOne(unfollow);

}

module.exports = {
    follow, 
    unfollow
}