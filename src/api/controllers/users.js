const UserService = require('../../services/user.service')
const router = require('express').Router();
const Joi = require('joi')

async function all(req, res) {
    console.log('users/');

    users = await UserService.getUsers();
    res.status(200).json(users).send();
}

async function user(req, res) {
    console.log('users/:username');

    const schema = Joi.string()
    const { error, value } = schema.validate(req.query.username)

    if (error) {
        res.status(400).send();
    } else {
        user = await UserService.getUser(value);
        res.status(200).json(user).send();
    }
}

async function edit(req, res) {
    console.log('users/edit');
    res.status(200).send();
}

async function del(req, res) {
    console.log('users/delete');
    res.status(200).send();
}


router.get('/', all);
router.get('/:username', user);
router.put('/edit', edit);
router.delete('/delete', del);

module.exports = router