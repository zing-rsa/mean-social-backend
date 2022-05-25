const UserService = require('../../services/user.service');
const { ValidationError } = require('../../models/errors');
const router = require('express').Router();
const Joi = require('joi');

async function all(req, res) {
    console.log('users/');
    
    try {
        let users = await UserService.getUsers();
        res.status(200).json(users).send();
    } catch (e) {
        return res.status(500).json({ message: 'Unknown error' })
    }
}

async function user(req, res) {
    console.log('users/:username');

    const schema = Joi.string();

    try {
        const { error, value } = schema.validate(req.params.username);
        if (error) throw new ValidationError(error.details[0].message)

        let user = await UserService.getUser(value);
        res.status(200).json(user).send();
    } catch (error) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message })
        }
        return res.status(500).json({ message: 'Unknown error' })
    }

}

async function edit(req, res) {
    console.log('users/edit');

    const schema = Joi.object().keys({
        name: Joi.string().pattern(/^[a-zA-Z]+$/),
        surname: Joi.string().pattern(/^[a-zA-Z]+$/),
        email: Joi.string().email(),
        pass: Joi.string().min(5).max(16).alphanum(),
        bio: Joi.string().max(200).default('')
    });

    try {

        const { error, value } = schema.validate(req.body);
        if (error) throw new ValidationError(error.details[0].message);

        let user = await UserService.edit(value);
        return res.status(200).json(user).send();

    } catch (e) {
        return res.status(500).json({ message: 'Unknown error' })
    }
}

async function del(req, res) {
    console.log('users/delete');

    try {
        
    } catch (e) {
        return res.status(500).json({ message: 'Unknown error' })
    }
}


router.get('/', all);
router.get('/:username', user);
router.put('/edit', edit);
router.delete('/delete', del);

module.exports = router