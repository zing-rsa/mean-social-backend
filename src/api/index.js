var router = require('express').Router()

router.use('/users', require('./controllers/users'))
router.use('/posts', require('./controllers/posts'))
router.use('/comments', require('./controllers/comments'))
router.use('/follows', require('./controllers/follows'))
router.use('/auth', require('./controllers/auth'))

module.exports = router