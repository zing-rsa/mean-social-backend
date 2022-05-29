const { ValidationError, NotFoundError } = require('../../models/errors');
const UserService = require('../../services/user.service');
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
    console.log('users/:_id');

    const user_id = req.params._id
    const schema = Joi.string().alphanum();

    try {
        const { error, value } = schema.validate(user_id, {escapeHtml: true});
        if (error) throw new ValidationError(error.details[0].message)

        let user = await UserService.getUser(value);
        res.status(200).json(user).send();
    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message })
        }
        if (e instanceof NotFoundError){
            return res.status(404).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' })
    }
}

async function edit(req, res) {
    console.log('users/edit');

    const user_creds = req.body;
    const schema = Joi.object().keys({
        _id: Joi.string().alphanum().required(),
        name: Joi.string().pattern(/^[a-zA-Z]+$/),
        surname: Joi.string().pattern(/^[a-zA-Z]+$/),
        email: Joi.string().email(),
        pass: Joi.string().min(5).max(16).alphanum(),
        bio: Joi.string().max(200).default('')
    });

    try {

        const { error, value } = schema.validate(user_creds, {escapeHtml: true});
        if (error) throw new ValidationError(error.details[0].message);

        let user = await UserService.editUser(value);
        return res.status(200).json(user).send();

    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message }).send();
        }
        if (e instanceof NotFoundError){
            return res.status(404).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }
}

async function del(req, res) {
    console.log('users/delete');

    const user_id = req.body._id;
    const schema = Joi.string().alphanum();

    try {
        const { error, value } = schema.validate(user_id, {escapeHtml: true});
        if (error) throw new ValidationError(error.details[0].message);

        await UserService.delUser(value);
        return res.status(200).send();

    } catch (e) {
        if (e instanceof NotFoundError){
            return res.status(404).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }
}


router.get('/', all);
router.get('/:_id', user);
router.put('/edit', edit);
router.delete('/delete', del);

module.exports = router