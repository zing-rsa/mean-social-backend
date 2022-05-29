const express = require('express');
const router = express.Router();
const unless = require('../util').unless

router.use(express.json())
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

router.use('/users', require('./controllers/users.controller'));
router.use('/posts', require('./controllers/posts.controller'));
router.use('/comments', require('./controllers/comments.controller'));
router.use('/follows', require('./controllers/follows.controller'));
router.use('/auth', require('./controllers/auth.controller'));

module.exports = router