const db = require('../mongo').db()

let users = db.collection('users');

const getUsers = async () => {
    return await users.find().toArray(); // use projection
}

const getUser = async (username) => {
    query = { username: username }
    return await users.find(query).toArray(); // use projection
}

module.exports = {
    getUsers,
    getUser
}