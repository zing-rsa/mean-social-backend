const express = require('express');
const router = express.Router();

router.use(express.json())

router.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
    next();
});

router.use('/users', require('./controllers/users'));
router.use('/posts', require('./controllers/posts'));
router.use('/comments', require('./controllers/comments'));
router.use('/follows', require('./controllers/follows'));
router.use('/auth', require('./controllers/auth'));

module.exports = router