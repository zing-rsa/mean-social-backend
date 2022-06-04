const { ConflictError, NotFoundError, ValidationError, AuthError } = require('../../models/errors');
const FollowService = require('../../services/follow.service')
const { authenticate } = require('../../middleware')
const Joi = require('joi');

router = require('express').Router();


router.post('/follow', [authenticate], follow);

async function follow(req, res) {
    console.log('/follows/follow');

    const schema = Joi.object().keys({
        user_id: Joi.string().length(24).required()
    })

    try {
        const details = req.body;
        const current_user = req.user;

        const { error, value } = schema.validate(details, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let result = await FollowService.follow(value, current_user);
        return res.status(200).json(result).send();

    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message }).send();
        }
        if (e instanceof NotFoundError) {
            return res.status(404).json({ message: e.message }).send();
        }
        if (e instanceof ConflictError) {
            return res.status(409).json({ message: e.message }).send();
        }
        return res.status(500).json({ message: 'Unknown error' }).send();
    }
}


router.post('/unfollow', [authenticate], unfollow);

async function unfollow(req, res) {
    const schema = Joi.object().keys({
        user_id: Joi.string().length(24).required()
    })

    try {
        const details = req.body;
        const current_user = req.user;

        const { error, value } = schema.validate(details, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        await FollowService.unfollow(value, current_user);
        return res.status(200).send();

    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message }).send();
        }
        if (e instanceof NotFoundError) {
            return res.status(404).json({ message: e.message }).send();
        }
        if (e instanceof ConflictError) {
            return res.status(409).json({ message: e.message }).send();
        }
        return res.status(500).json({ message: 'Unknown error' }).send();
    }
}


module.exports = router