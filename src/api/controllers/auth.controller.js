const { ConflictError, ValidationError, NotFoundError, AuthError } = require('../../models/errors');
const AuthService = require('../../services/auth.service')
const router = require('express').Router();
const Joi = require('joi');


router.post('/login',  login);
router.post('/signup', signup);

module.exports = router


async function signup(req, res) {
    console.log('auth/signup');
    
    const schema = Joi.object().keys({
        name: Joi.string().min(1).pattern(/^[a-zA-Z]+$/).required(),
        surname: Joi.string().min(1).pattern(/^[a-zA-Z]+$/).required(),
        email: Joi.string().email().required(),
        pass: Joi.string().min(5).max(16).alphanum().required(),
        bio: Joi.string().max(200).default('')
    });
    
    try {

        const { error, value } = schema.validate(req.body, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let user = await AuthService.createUser(value);
        return res.status(201).json(user).send();

    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message }).send();
        }
        if (e instanceof ConflictError) {
            return res.status(409).json({ message: e.message }).send(); // right code?
        }

        return res.status(500).json({ message: 'Unknown error' }).send();
    }
}

async function login(req, res) {
    console.log('/auth/login');

    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        pass: Joi.string().alphanum().required()
    });

    try {

        const { error, value } = schema.validate(req.body, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let user = await AuthService.login(value);
        return res.status(200).json(user).send();

    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message }).send();
        }
        if (e instanceof AuthError) {
            return res.status(401).json({ message: e.message }).send();
        }
        if (e instanceof NotFoundError) {
            return res.status(404).json({ message: e.message }).send();
        }
        return res.status(500).json({ message: 'Unknown error' }).send();
    }
}
