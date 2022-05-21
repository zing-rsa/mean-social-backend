const { SignupError, ValidationError } = require('../../models/errors');
const AuthService = require('../../services/auth.service')
const router = require('express').Router();

const Joi = require('joi');

async function signup(req, res) {
    console.log('auth/signup');

    const schema = Joi.object().keys({
        name: Joi.string().pattern(/^[a-zA-Z]+$/).required(),
        surname: Joi.string().pattern(/^[a-zA-Z]+$/).required(),
        email: Joi.string().email().required(),
        pass: Joi.string().min(5).max(16).alphanum().required(),
        bio: Joi.string().max(200).default('')
    });

    try {
        const { error, value } = schema.validate(req.body)
        if (error) throw new ValidationError(error.details[0].message)

        user = await AuthService.createUser(value)
        res.status(200).json(user).send();

    } catch (e) {
        if (e instanceof ValidationError){
            res.status(400).json({message: e.message}).send();
        } else if (e instanceof SignupError){
            res.status(400).json({message: e.message}).send();
        } else {
            res.status(500).json({message: "Unknown error"}).send()
        }
    }
}

async function login(req, res) {
    console.log('/auth/login');
    res.status(200).send();
}

router.post('/login', login);
router.post('/signup', signup);

module.exports = router