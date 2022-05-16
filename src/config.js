var config = module.exports

config.express = {
  port: process.env.EXPRESS_PORT || 3000,
}

config.env = process.env.EXPRESS_ENV || 'dev';

config.mongoUrl = process.env.MONGO_URL;