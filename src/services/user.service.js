const db = require('../mongo').db()

class UserService {

    users = null;

    constructor() {
        this.users = db.collection('users');
    }

    async getUsers() {
        return await this.users.find().toArray(); // use projection
    }

    async getUser(username){
        query = { username: username }
        return await this.users.find(query).toArray(); // user projection
    }

    async createUser(data){
        return { "name": data.name }
    }
}

module.exports = new UserService();