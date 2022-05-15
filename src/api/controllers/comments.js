var router = require('express').Router()

async function create(req, res) {
    console.log('comments/create')
    res.status(200).send()
}

async function del(req, res) {
    console.log('comments/delete')
    res.status(200).send()
}

router.post('/create', create)
router.delete('/delete', del)

module.exports = router