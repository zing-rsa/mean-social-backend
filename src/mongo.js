const { MongoClient } = require('mongodb');
const config = require('./config');

const url = config.mongoUrl
const db_name = config.db_name
const client = new MongoClient(url);

let _db;

const connect = async () => {
        try {
            await client.connect();
            console.log('Connected to MongoDB');

            _db = client.db(db_name);
            return _db;
    
        } catch (error) {
            console.log("Failed to connect to MongoDB")
            return Promise.reject(error)
        }
    }

const db = () => _db;

module.exports = {
    connect,
    db
}