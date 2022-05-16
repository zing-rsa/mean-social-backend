var router = require('express').Router();

async function follow(req, res) {
    console.log('/follows/follow');
    res.status(200).send();
}

async function unfollow(req, res) {
    console.log('/follows/unfollow');
    res.status(200).send();
}

router.post('/follow', follow);
router.delete('/unfollow', unfollow);

module.exports = router