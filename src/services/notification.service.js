const { NotFoundError } = require('../models/errors');
const { ObjectId } = require('mongodb');
const db = require('../mongo').db();

let notis = db.collection('notifications');
let comments = db.collection('comments');
let posts = db.collection('posts');

const createNotification = async (details) => {

    let { owner, action, action_item, action_owner } = details;

    await notis.insertOne({
        owner,
        action, 
        action_item, 
        action_owner, 
        timestamp: new Date(),
        unread: true 
    })
}

const getUserNotifications = async (user_id) => {

    const pipeline = [
        {
            '$match': {
                owner: ObjectId(user_id)
            }
        },
        {
            '$lookup': {
                'from': 'users',
                'localField': 'action_owner',
                'foreignField': '_id',
                'as': 'action_owner'
            }
        },
        {
            "$unwind": "$action_owner"
        },
        {
            "$project": {
                "action_owner._id": 1,
                "action_owner.username": 1,
                "action_owner.avatar": 1,
                "action_item": 1,
                "owner": 1,
                "action": 1,
                "unread": 1,
                "timestamp": 1
            }
        },
        {
            '$sort': {
                'timestamp': -1
            }
        }
    ]

    const data = await notis.aggregate(pipeline).toArray();

    for (let n of data) {
        if(['like', 'mention'].includes(n.action)){
            n.action_item = await posts.findOne({_id : n.action_item})
        } else if (n.action === 'comment'){
            n.action_item = await comments.findOne({_id : n.action_item})
        }
    }

    var notifications = {
        unread: data.some(n => n.unread === true),
        notifications: data
    }

    return notifications;
}

const clearNotification = async (id) => {

    notis.updateOne(
        { _id: ObjectId(id) },
        {
            $set: {
                unread: false
            }
        }
    );
}

const deleteNotifications = async (query) => {
    await notis.deleteMany(query);
}


module.exports = {
    getUserNotifications,
    deleteNotifications,
    createNotification,
    clearNotification
}