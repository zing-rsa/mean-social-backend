const { ValidationError, NotFoundError, AuthorizationError, ConflictError } = require('../../models/errors');
const NotificationService = require('../../services/notification.service');
const { authenticate, authorize } = require('../../middleware');
const FollowService = require('../../services/follow.service');
const PostService = require('../../services/posts.service');
const UserService = require('../../services/user.service');
const FileService = require('../../services/file.service');
const router = require('express').Router();
const upload = require('../../multer')
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

router.get('/:_id/posts', [authenticate], user_posts);

async function user_posts(req, res) {

    console.log('users/:_id/posts');
    const schema = Joi.string().length(24);

    try {
        const user_id = req.params._id;

        const { error, value } = schema.validate(user_id, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let posts = await PostService.getUserPosts(value, req.user);
        return res.status(200).json(posts);
    } catch (e) {
        if (e instanceof ValidationError){
            return res.status(400).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }

}

router.get('/:_id/follows', [authenticate], userFollows);

async function userFollows(req, res) {

    console.log('users/:_id/follows');
    const schema = Joi.string().length(24);

    try {
        const user_id = req.params._id;
        const current_user = req.user;

        const { error, value } = schema.validate(user_id, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let followInfo = await FollowService.followInfo(value, current_user);
        return res.status(200).json(followInfo);
    } catch (e) {
        if (e instanceof ValidationError){
            return res.status(400).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }

}

router.put('/edit', [authenticate, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }])], edit);

async function edit(req, res) {
    console.log('users/edit');

    const schema = Joi.object().keys({
        _id: Joi.string().alphanum().length(24).required(),
        name: Joi.string().pattern(/^[a-zA-Z]+$/),
        surname: Joi.string().pattern(/^[a-zA-Z]+$/),
        email: Joi.string().email(),
        pass: Joi.string().min(5).max(16).alphanum(),
        bio: Joi.string().max(200)
    });

    try {
        const user_creds = req.body;
        const current_user = req.user;

        const { error, value } = schema.validate(user_creds, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let user = await UserService.editUser(value, current_user);

        if (req.files['avatar'] && req.files['avatar'][0])
            user = await FileService.SaveUserProfileImage(user, req.files['avatar'][0]);
        if (req.files['banner'] && req.files['banner'][0])
            user = await FileService.SaveUserBannerImage(user, req.files['banner'][0]);

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
        const current_user = req.user;

        const { error, value } = schema.validate(user, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        await UserService.delUser(value, current_user);
        return res.status(200).send();

    } catch (e) {
        if (e instanceof NotFoundError) {
            return res.status(404).json({ message: e.message });
        }
        if (e instanceof ConflictError) {
            return res.status(409).json({ message: e.message });
        }  
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message });
        } 
        return res.status(500).json({ message: 'Unknown error' });
    }
}

router.get('/:_id/notifications', [authenticate], notifications);

async function notifications(req, res) {
    console.log('users/:_id/notifications');

    const schema = Joi.string().length(24);

    try {
        const { error, value } = schema.validate(req.params._id, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let user_notifications = await NotificationService.getUserNotifications(value);
        res.status(200).json(user_notifications);
    } catch (e) {
        return res.status(500).json({ message: 'Unknown error' });
    }
}


module.exports = router