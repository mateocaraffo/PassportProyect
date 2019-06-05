var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function (req, res) {
    res.render('register');
})

router.post('/', passport.authenticate('local'), function (req, res) {
    console.log("hola");
    res.redirect('index')
})

module.exports = router;