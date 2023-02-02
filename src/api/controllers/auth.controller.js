const { ConflictError, ValidationError, NotFoundError, AuthError } = require('../../models/errors');
const FileService = require('../../services/file.service')
const AuthService = require('../../services/auth.service')
const upload = require('../../multer')
const router = require('express').Router();
const Joi = require('joi');

module.exports = router


router.post('/signup', upload.fields([{name: 'avatar', maxCount:1 }, {name: 'banner', maxCount:1}]), signup);

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

        user = await FileService.SaveUserProfileImage(user, req.files['avatar'][0]);
        user = await FileService.SaveUserBannerImage(user, req.files['banner'][0]);

        return res.status(201).json(user);

    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message });
        }
        if (e instanceof ConflictError) {
            return res.status(409).json({ message: e.message }); // right code?
        }

        return res.status(500).json({ message: 'Unknown error' });
    }
}


router.post('/login', login);

async function login(req, res) {
    console.log('/auth/login');

    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        pass: Joi.string().alphanum().required()
    });

    try {

        const { error, value } = schema.validate(req.body, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let details = await AuthService.login(value);

        res.cookie('refresh_token', details.refresh_token, {
            sameSite: 'none',
            secure: true,
            httpOnly: true,
            path: 'auth/refresh'
        });

        return res.status(200).json({ access_token: details.access_token });

    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message });
        }
        if (e instanceof AuthError) {
            return res.status(401).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }
}

router.get('/refresh', refresh)

async function refresh(req, res) {
    console.log("/refresh");

    try {
        let token = await AuthService.refresh(req);

        return res.status(200).json({ refreshed_token: token });
    } catch (e) {
        if (e instanceof AuthError) {
            return res.status(401).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }
}