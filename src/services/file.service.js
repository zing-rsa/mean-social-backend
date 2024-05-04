const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client } = require("@aws-sdk/client-s3");
const ObjectId = require('mongodb').ObjectId;
const { v4: uuid } = require('uuid');
const stream = require('stream');

const db = require('../mongo').db();
let users = db.collection('users');
let posts = db.collection('posts');

const client = new S3Client({ 
    region: config.aws_region,
    credentials: { accessKeyId: config.aws_access_key_id, secretAccessKey: config.aws_secret_key}
});

const mimeDict = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png':'.png',
    'image/gif':'.gif'
}

const uploadFile = async (fileObject, folder) => {
    const image_key = `${config.env}/${folder}/` + uuid() + mimeDict[fileObject.mimetype];
    console.log(`uploading file: ${image_key}`);
    
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);

    const upload = new Upload({
        client,
        params: {
            Bucket: config.aws_media_bucket_name,
            Key: image_key,
            Body: bufferStream
        }
    });

    await upload.done();

    console.log(`file uploaded to S3: ${image_key}`);

    return config.s3_url(config.aws_media_bucket_name,image_key);
};


const SaveUserProfileImage = async (user, file) => {

    const url = await uploadFile(file, config.avatar_folder)

    user.avatar = url;

    await users.updateOne({ _id: ObjectId(user._id) },
        {
            $set: { avatar: url }
        }
    );

    return user;
}


const SaveUserBannerImage = async (user, file) => {

    const url = await uploadFile(file, config.banner_folder)

    user.banner = url;

    await users.updateOne({ _id: ObjectId(user._id) },
        {
            $set: { banner: url }
        }
    );

    return user;
}

const SavePostImage = async (post, file) => {

    const url = await uploadFile(file, config.posts_folder)

    post.image = url;

    await posts.updateOne({ _id: ObjectId(post._id) },
        {
            $set: { image: url }
        }
    )

    return post;
}


module.exports = {
    SaveUserProfileImage,
    SaveUserBannerImage,
    SavePostImage
}