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
        return res.status(200).json(posts).send();
    } catch (e) {
        return res.status(500).json({ message: 'Unknown error' }).send();
    }
}


router.get('/:_id', [authenticate], user_posts);

async function user_posts(req, res) {
    console.log('posts/');
    const schema = Joi.string();

    try {
        const user_id = req.params._id;

        const { error, value } = schema.validate(user_id, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let posts = await PostService.getUserPosts(value);
        return res.status(200).json(posts).send();
    } catch (e) {
        if (e instanceof ValidationError){
            return res.status(400).json({ message: e.message }).send();
        }
        return res.status(500).json({ message: 'Unknown error' }).send();
    }
}


router.post('/create', [authenticate], create);

async function create(req, res) {
    console.log('posts/create');

    const schema = Joi.object().keys({
        text: Joi.string().required(),
        owner: Joi.object()
    });

    try {

        const post_details = { ...req.body, owner: req.user._id };

        const { error, value } = schema.validate(post_details, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let post = await PostService.createPost(value);
        return res.status(201).json(post).send();

    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message }).send();
        }
        return res.status(500).json({ message: 'Unknown error' }).send();
    }
}



router.delete('/delete', [authenticate], del);

async function del(req, res) {
    console.log('posts/delete');

    const schema = Joi.object().keys({
        _id: Joi.string().alphanum().required()
    });
    
    try {
        const post = req.body;
        const current_user = req.user;

        const { error, value } = schema.validate(post, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        await PostService.delPost(value, current_user);
        return res.status(200).send();
    } catch(e) {
        if (e instanceof NotFoundError) {
            return res.status(404).json({message: e.message }).send();
        }
        if (e instanceof AuthorizationError) {
            return res.status(403).json({message: e.message }).send();
        }
        return res.status(500).json({ message: 'Unknown error' }).send();
    }
}

module.exports = router