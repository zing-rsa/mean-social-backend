const express = require('express');
const router = express.Router();

const config = require('../config')

router.use(express.json());

router.use(function(req, res, next) {
    origin = config.cors.origins.includes(req.header('origin').toLowerCase()) ? req.headers.origin : config.cors.default;

    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.header("Access-Control-Allow-Credentials", "true")
    next();
});

router.use('/users', require('./controllers/users.controller'));
router.use('/posts', require('./controllers/posts.controller'));
router.use('/comments', require('./controllers/comments.controller'));
router.use('/follows', require('./controllers/follows.controller'));
router.use('/auth', require('./controllers/auth.controller'));
router.use('/likes', require('./controllers/likes.controller'));

module.exports = router