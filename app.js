var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var logger = require('morgan');
var indexRouter = require('./routes/public');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var privateRouter = require('./routes/private');
var passport = require('passport');
var setUpAuthStrategy = require('./config/auth');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findByPk(id)
    .then(function(user) {
    done(null,user);
  });
});

passport.use(new LocalStrategy({usernameField: "email", passwordField: "password"},
  function (email, password, done) {
    console.log("hola", email);
    User.findOne({where: { email : email }})
      .then(function (user) {
        console.log(user)
        let pass = user.hashPassword(password)
        if (user.email !== email) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        if (pass !== user.password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      })
      .catch(done)
    
  }
));
// Rutas //
app.use('/', indexRouter);
app.use('/public', indexRouter);
app.use('/users', usersRouter);
app.use('/private', privateRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
