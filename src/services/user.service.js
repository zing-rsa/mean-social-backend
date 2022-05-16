const db = require('../db').db

class UserService {

    users = null;

    constructor() {
        this.users = db.collection('users');
    }

    async getUsers() {
        return await this.users.find({}).toArray();
    }
}

module.exports = new UserService();



