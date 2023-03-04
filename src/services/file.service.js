const ObjectId = require('mongodb').ObjectId;
const { google } = require('googleapis');
const { v4: uuid } = require('uuid');
const stream = require('stream');
const path = require('path');

const db = require('../mongo').db();

let users = db.collection('users');
let posts = db.collection('posts');

const mimeDict = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png':'.png',
    'image/gif':'.gif'
}

const getDriveService = () => {
    const KEYFILEPATH = path.join(__dirname, '../../filekey.json');
    const SCOPES = ['https://www.googleapis.com/auth/drive'];

    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPES,
    });

    return google.drive({ version: 'v3', auth });
};

const uploadFile = async (fileObject, parent) => {

    const bufferStream = new stream.PassThrough();

    bufferStream.end(fileObject.buffer);

    const { data } = await getDriveService().files.create({
        media: {
            mimeType: fileObject.mimetype,
            body: bufferStream
        },
        requestBody: {
            name: uuid() + mimeDict[fileObject.mimetype],
            parents: [parent],
        },
        fields: 'id,name',
    });

    console.log(`Uploaded file ${data.id}`);

    return data.id;
};


const SaveUserProfileImage = async (user, file) => {

    const id = await uploadFile(file, config.avatar_folder)

    user.avatar = id;

    await users.updateOne({ _id: ObjectId(user._id) },
        {
            $set: { avatar: id }
        }
    );

    return user;
}


const SaveUserBannerImage = async (user, file) => {

    const id = await uploadFile(file, config.banner_folder)

    user.banner = id;

    await users.updateOne({ _id: ObjectId(user._id) },
        {
            $set: { banner: id }
        }
    );

    return user;
}

const SavePostImage = async (post, file) => {

    const id = await uploadFile(file, config.posts_folder)

    post.image = id;

    await posts.updateOne({ _id: ObjectId(post._id) },
        {
            $set: { image: id }
        }
    )

    return post;
}


module.exports = {
    SaveUserProfileImage,
    SaveUserBannerImage,
    SavePostImage
}