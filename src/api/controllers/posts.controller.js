const { ValidationError, NotFoundError } = require('../../models/errors');
const PostService = require('../../services/posts.service')
const { authorizeAny, authenticate } = require('../../middleware');
const router = require('express').Router();
const Joi = require('joi');


router.get('/', [authenticate], all);
router.get('/:_id', [authenticate], user_posts);
router.post('/create', [authenticate], create);
router.delete('/delete', [authenticate, authorizeAny('owner', 'admin')], del);

module.exports = router


async function all(req, res) {
    console.log('posts/');

    try {
        let posts = await PostService.getPosts();
        return res.status(200).json(posts).send();
    } catch (e) {
        return res.status(500).json({ message: 'Unknown error' })
    }
}

async function user_posts(req, res) {
    console.log('posts/');
    const schema = Joi.string();

    try {
        let user_id = req.params._id

        const { error, value } = schema.validate(user_id, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let posts = await PostService.getUserPosts(value);
        return res.status(200).json(posts).send();
    } catch (e) {
        if (e instanceof ValidationError){
            return res.status(400).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' })
    }
}

async function create(req, res) {
    console.log('posts/create');

    const schema = Joi.object().keys({
        text: Joi.string().required(),
        owner: Joi.object()
    });

    try {

        let post_details = req.body;
        post_details.owner = req.user._id;

        const { error, value } = schema.validate(post_details, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        let post = await PostService.createPost(value);
        return res.status(201).json(post).send();

    } catch (e) {
        if (e instanceof ValidationError) {
            return res.status(400).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Unknown error' });
    }
}

async function del(req, res) {
    console.log('posts/delete');

    const schema = Joi.object().keys({
        _id: Joi.string().alphanum().required()
    });
    
    try {
        const post = req.body;

        const { error, value } = schema.validate(post, { escapeHtml: true });
        if (error) throw new ValidationError(error.details[0].message);

        await PostService.delUser(value);
        return res.status(200).send();
    } catch(e) {
        if (e instanceof NotFoundError) {
            return res.status(404).json({message: e.message }).send();
        }
        return res.status(500).json({ message: 'Unknown error' });
    }
}

