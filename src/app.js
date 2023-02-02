const express = require('express');
const app = module.exports = express();
const config = require('./config');
const mongo = require('./mongo');

async function start() {

    try {
        await mongo.connect();
    } catch (error) {
        process.exit() //for now
    }

    app.use('/api', require('./api'));

    app.use('/media', express.static('uploads'));

    app.listen(config.express.port, function () {
        console.log(`App listening on port ${config.express.port}!`);
    });
}

start();