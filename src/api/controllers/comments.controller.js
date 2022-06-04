const { ValidationError, NotFoundError, AuthorizationError } = require('../../models/errors');
const { authenticate, authorize } = require('../../middleware');
const CommentService = require('../../services/comment.service');
const router = require('express').Router();
const Joi = require('joi');

router.post('/create', [authenticate], create);

async function create(req, res) {
    const schema = Joi.object().keys({
        parent: Joi.string().alphanum().length(24).required(),
        text: Joi.string().required()
    });

    try {

        const comment_details = req.body;
        const current_user = req.user;

        const { error, value } = schema.validate(comment_details, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let comment = await CommentService.createComment(value, current_user);
        return res.status(200).json(comment).send();
    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message }).send();
        }
        if (e instanceof NotFoundError) {
            return res.status(404).json({ message: e.message }).send();
        }
        return res.status(500).json({ message: 'Unknown error' }).send();
    }
}


router.delete('/delete', [authenticate], del);

async function del(req, res) {

    const schema = Joi.object().keys({
        _id: Joi.string().length(24).required()
    });

    try {

        const comment_details = req.body;
        const current_user = req.user;

        const { error, value } = schema.validate(comment_details, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        await CommentService.delComment(value, current_user);

        return res.status(200).send();

    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message }).send();
        }
        if (e instanceof AuthorizationError) {
            return res.status(403).json({ message: e.message }).send();
        }
        if (e instanceof NotFoundError) {
            return res.status(404).json({ message: e.message }).send();
        }
        return res.status(500).json({ message: "Unknown error" }).send();
    }



    console.log('comments/delete');
    res.status(200).send();
}


module.exports = router