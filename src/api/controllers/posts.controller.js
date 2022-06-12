const { ValidationError, NotFoundError, AuthorizationError } = require('../../models/errors');
const { authenticate } = require('../../middleware');
const PostService = require('../../services/posts.service')
const router = require('express').Router();
const Joi = require('joi');



router.get('/', [authenticate], all);

async function all(req, res) {
    console.log('posts/');
    
    try {
        let posts = await PostService.getPosts();
        return res.status(200).json(posts);
    } catch (e) {
        return res.status(500).json({ message: 'Unknown error' });
    }
}


router.get('/:_id', [authenticate], user_posts);

async function user_posts(req, res) {
    console.log('posts/');
    const schema = Joi.string().length(24);

    try {
        const user_id = req.params._id;

        const { error, value } = schema.validate(user_id, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let posts = await PostService.getUserPosts(value);
        return res.status(200).json(posts);
    } catch (e) {
        if (e instanceof ValidationError){
            return res.status(400).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }
}


router.post('/create', [authenticate], create);

async function create(req, res) {
    console.log('posts/create');

    const schema = Joi.object().keys({
        text: Joi.string().required()
    });

    try {
        const current_user = req.user;
        const post_details = req.body;

        const { error, value } = schema.validate(post_details, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let post = await PostService.createPost(value, current_user);
        return res.status(201).json(post);

    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }
}



router.delete('/delete', [authenticate], del);

async function del(req, res) {
    console.log('posts/delete');

    const schema = Joi.object().keys({
        _id: Joi.string().alphanum().length(24).required()
    });
    
    try {
        const post = req.body;
        const current_user = req.user;

        const { error, value } = schema.validate(post, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        await PostService.delPost(value, current_user);
        return res.status(200);
    } catch(e) {
        if (e instanceof NotFoundError) {
            return res.status(404).json({message: e.message });
        }
        if (e instanceof AuthorizationError) {
            return res.status(403).json({message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }
}

module.exports = router