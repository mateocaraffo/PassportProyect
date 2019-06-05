var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

/* LocalStrategy configuration*/
module.exports = function setUpAuthStrategy () {
    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({ username: username})
            .then(function (err, user) {
                let pass = User.hashPassword(password)
                if (err) { return done(err); }
                if (user.email !== username) {
                    return done(null, false, { message: 'Incorrect email.' });
                }
                if (pass !== user.password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));
    return passport.initialize()
}