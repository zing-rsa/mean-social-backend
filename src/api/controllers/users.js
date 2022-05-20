const UserService = require('../../services/user.service')
const Joi = require('joi')
const router = require('express').Router();


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

async function signup(req, res) {
    console.log('users/signup');

    const schema = Joi.object().keys({
        name: Joi.string().pattern(/^[a-zA-Z]+$/).required(),
        surname: Joi.string().pattern(/^[a-zA-Z]+$/).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(16).alphanum().required()
    });

    const { error, value } = schema.validate(req.body)

    if (error) {
        message = { 'message': error.details[0].message }
        res.status(400).json(message).send();
    } else {
        user = await UserService.createUser(value)
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
router.post('/signup', signup);
router.put('/edit', edit);
router.delete('/delete', del);

module.exports = router