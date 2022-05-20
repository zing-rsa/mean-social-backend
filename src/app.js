const config = require('./config');
const express = require('express');
const app = module.exports = express();
const db_conn = require('./db');

async function start() {

    await db_conn.init();
    
    // app.use(express.json())
    app.use('/api', require('./api'));

    app.listen(config.express.port, function () {
        console.log(`App listening on port ${config.express.port}!`);
    });
}

start();