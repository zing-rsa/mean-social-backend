require('dotenv').config()

config = module.exports

config.env = process.env.EXPRESS_ENV || 'dev';

config.express = {
  port: process.env.EXPRESS_PORT || 3080,
}

config.jwt_access_secret = process.env.JWT_ACCESS_SECRET;
config.jwt_refresh_secret = process.env.JWT_REFRESH_SECRET;

config.db_name = 'mean-social' // needs to change to mern
config.mongoUrl = process.env.MONGO_URL;

config.posts_folder = process.env.POSTS_FOLDER
config.avatar_folder = process.env.AVATAR_FOLDER
config.banner_folder = process.env.BANNER_FOLDER

config.maxFileSize = 2000000
config.allowedUploadTypes = [
  '.png',
  '.jpeg',
  '.jpg',
  '.gif'
]

config.cors = {
  origins: ["https://mern-social-frontend-mxim.onrender.com","http://localhost:3000"],
  default: "https://mern-social-frontend-mxim.onrender.com"
}