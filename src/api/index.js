const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const unless = require('../util').unless

router.use(express.json())
// router.use(unless(auth, '/auth/login', '/auth/signup'))
router.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

router.use('/users', require('./controllers/users'));
router.use('/posts', require('./controllers/posts'));
router.use('/comments', require('./controllers/comments'));
router.use('/follows', require('./controllers/follows'));
router.use('/auth', require('./controllers/auth'));

module.exports = router