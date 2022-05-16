var router = require('express').Router();

async function login(req, res) {
    console.log('/auth/login');
    res.status(200).send();
}

router.post('/login', login);

module.exports = router