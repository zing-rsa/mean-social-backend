const config = require('./config');
const express = require('express');
const mongo = require('./mongo');
const app = module.exports = express();

async function start() {

    try {
        await mongo.connect();
    } catch (error) {
        process.exit() //for now
    }
    
    app.use('/api', require('./api'));

    app.listen(config.express.port, function () {
        console.log(`App listening on port ${config.express.port}!`);
    });
}

start();