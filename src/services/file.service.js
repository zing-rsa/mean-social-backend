const ObjectId = require('mongodb').ObjectId;
const db = require('../mongo').db();


let users = db.collection('users');
let posts = db.collection('posts');

const SaveUserProfileImage = async (user, file) => {

    user.avatar = file.filename;

    await users.updateOne({ _id: ObjectId(user._id) },
        {
            $set: { avatar: file.filename }
        }
    );

    return user;
}

const SaveUserBannerImage = async (user, file) => {

    user.banner = file.filename;

    await users.updateOne({ _id: ObjectId(user._id) },
        {
            $set: { banner: file.filename }
        }
    );

    return user;
}

const SavePostImage = async (post, file) => {

    post.image = file.filename;

    await posts.updateOne({ _id: ObjectId(post._id) },
        {
            $set: { image: file.filename }
        }
    )

    return post;
}


module.exports = {
    SaveUserProfileImage,
    SaveUserBannerImage,
    SavePostImage
}