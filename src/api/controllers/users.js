const UserService = require('../../services/user.service')
var router = require('express').Router();


async function all(req, res) {
    console.log('users/');
    //res.status(200).send();

    users = UserService.getUsers()
    res.status(200).json(users).send();
}

async function signup(req, res) {
    console.log('users/signup');
    res.status(200).send();
}

async function edit(req, res) {
    console.log('users/edit');
    res.status(200).send();
}

async function del(req, res) {
    console.log('users/delete');
    res.status(200).send();
}

async function user(req, res) {
    console.log('users/:username');
    res.status(200).send();
}

router.get('/', all);
router.post('/signup', signup);
router.put('/edit', edit);
router.delete('/delete', del);
router.get('/:username', user);

module.exports = router