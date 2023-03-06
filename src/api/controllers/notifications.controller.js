const { ValidationError, NotFoundError, AuthorizationError, ConflictError } = require('../../models/errors');
const NotificationService = require('../../services/notification.service');
const { authenticate, authorize } = require('../../middleware');
const router = require('express').Router();
const Joi = require('joi');

router.post('/:_id/clear', [authenticate], clear);

async function clear(req, res) {
    console.log('notifications/:_id/clear');

    const schema = Joi.string().length(24);

    try {
        const { error, value } = schema.validate(req.params._id, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        NotificationService.clearNotification(value);

        res.status(200).send();
    } catch (e) {
        return res.status(500).json({ message: 'Unknown error' });
    }
}

module.exports = router