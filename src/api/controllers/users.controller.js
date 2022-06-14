const { ValidationError, NotFoundError, AuthorizationError, ConflictError } = require('../../models/errors');
const { authenticate, authorize } = require('../../middleware');
const UserService = require('../../services/user.service');
const router = require('express').Router();
const Joi = require('joi');


router.get('/', [authenticate], all);

async function all(req, res) {
    console.log('users/');

    try {
        let users = await UserService.getUsers();
        res.status(200).json(users);
    } catch (e) {
        return res.status(500).json({ message: 'Unknown error' });
    }
}

router.get('/self', [authenticate], self);

async function self(req, res) {
    console.log('users/self');

    try {
        const user_id = req.user._id

        let user = await UserService.getUser(user_id);
        res.status(200).json(user);
    } catch (e) {
        if (e instanceof NotFoundError) {
            return res.status(404).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }
}


router.get('/:_id', [authenticate], user);

async function user(req, res) {
    console.log('users/:_id');

    const schema = Joi.string().alphanum().length(24);

    try {
        const user_id = req.params._id

        const { error, value } = schema.validate(user_id, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message)

        let user = await UserService.getUser(value);
        res.status(200).json(user);
    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message });
        }
        if (e instanceof NotFoundError) {
            return res.status(404).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }
}


router.put('/edit', [authenticate], edit);

async function edit(req, res) {
    console.log('users/edit');

    const schema = Joi.object().keys({
        _id: Joi.string().alphanum().length(24).required(),
        name: Joi.string().pattern(/^[a-zA-Z]+$/),
        surname: Joi.string().pattern(/^[a-zA-Z]+$/),
        email: Joi.string().email(),
        pass: Joi.string().min(5).max(16).alphanum(),
        bio: Joi.string().max(200).default('')
    });

    try {
        const user_creds = req.body;
        const current_user = req.user;

        const { error, value } = schema.validate(user_creds, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let user = await UserService.editUser(value, current_user);
        return res.status(200).json(user);

    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message });
        }
        if (e instanceof NotFoundError) {
            return res.status(404).json({ message: e.message });
        }
        if (e instanceof AuthorizationError) {
            return res.status(403).json({ message: e.message });
        }
        if (e instanceof ConflictError) {
            return res.status(409).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }
}


router.delete('/delete', [authenticate, authorize('admin')], del);

async function del(req, res) {
    console.log('users/delete');

    const schema = Joi.object().keys({
        _id: Joi.string().alphanum().length(24).required()
    });

    try {
        const user = req.body;

        const { error, value } = schema.validate(user, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        await UserService.delUser(value);
        return res.status(200);

    } catch (e) {
        if (e instanceof NotFoundError) {
            return res.status(404).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }
}

module.exports = router