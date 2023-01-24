require('dotenv').config()

config = module.exports

config.express = {
  port: process.env.EXPRESS_PORT || 3080,
}

config.env = process.env.EXPRESS_ENV || 'dev';

config.mongoUrl = process.env.MONGO_URL;

config.jwt_access_secret = process.env.JWT_ACCESS_SECRET;

config.jwt_refresh_secret = process.env.JWT_REFRESH_SECRET;

config.db_name = 'mean-social' // needs to change to mern