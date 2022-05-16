const { MongoClient } = require('mongodb');
const config = require('./config');

class DBConnection {

    db = null;

    constructor() {
        const url = config.mongoUrl
        this.client = new MongoClient(url);
    }

    async init() {
        await this.client.connect();
        console.log('Connected to MongoDB');

        this.db = this.client.db('mean-social');
    }
}

module.exports = new DBConnection();