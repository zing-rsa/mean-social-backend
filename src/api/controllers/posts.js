router = require('express').Router();

async function all(req, res) {
    console.log('posts/');
    res.status(200).send();
}

async function create(req, res) {
    console.log('posts/create');
    res.status(200).send();
}

async function del(req, res) {
    console.log('posts/delete');
    res.status(200).send();
}

async function user_posts(req, res) {
    console.log('posts/:username');
    res.status(200).send();
}

router.get('/', all);
router.post('/create', create);
router.delete('/delete', del);
router.get('/:username', user_posts);

module.exports = router