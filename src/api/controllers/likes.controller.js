const { ConflictError, NotFoundError, ValidationError } = require('../../models/errors');
const LikeService = require('../../services/like.service')
const { authenticate } = require('../../middleware')
const Joi = require('joi');

router = require('express').Router();


router.post('/like', [authenticate], like);

async function like(req, res) {
    console.log('/likes/like');

    const schema = Joi.object().keys({
        post_id: Joi.string().length(24).required()
    })

    try {
        const details = req.body;
        const current_user = req.user;

        const { error, value } = schema.validate(details, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        const data = await LikeService.like(value, current_user);

        return res.status(201).send(data);

    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message });
        }
        if (e instanceof NotFoundError) {
            return res.status(404).json({ message: e.message });
        }
        if (e instanceof ConflictError) {
            return res.status(409).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }
}


router.post('/unlike', [authenticate], unlike);

async function unlike(req, res) {
    const schema = Joi.object().keys({
        post_id: Joi.string().length(24).required()
    })

    try {
        const details = req.body;
        const current_user = req.user;

        const { error, value } = schema.validate(details, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        const data = await LikeService.unlike(value, current_user);
        return res.status(200).send(data);

    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message });
        }
        if (e instanceof NotFoundError) {
            return res.status(404).json({ message: e.message });
        }
        if (e instanceof ConflictError) {
            return res.status(409).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }
}

module.exports = router