const express = require('express');
const router = express.Router();
const cors = require('cors');

router.use(express.json());
router.use(cors({
    exposedHeaders: ['authorization']
}));

router.use('/users', require('./controllers/users.controller'));
router.use('/posts', require('./controllers/posts.controller'));
router.use('/comments', require('./controllers/comments.controller'));
router.use('/follows', require('./controllers/follows.controller'));
router.use('/auth', require('./controllers/auth.controller'));

module.exports = router