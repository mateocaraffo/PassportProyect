var express = require('express');
var router = express.Router();
var User = require('../models/User');


router.get('/', function (req, res) {
    res.render('register');
})

router.post('/', function (req, res) {
    User.create(req.body)
    .then((user) => {
        res.redirect('login')
    })
})
module.exports = router;