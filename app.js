var express = require('express'),
    session = require('express-session'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter'),
    FacebookStrategy = require('passport-facebook'),
    GoogleStartegy = require('passport-google'),
    LocalStrategy = require('passport-local');




var routes = require('./routes/index');
var users = require('./routes/users');

// CONFIGURATION
//var config = require('./config/config');
//var pass = require('./config/pass.js')

var app = express();

//=======================PASPORT================================


//=======================EXPRESS================================
// CONFIGURE EXPRESS

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(favicon()); // finding of a URL of a web site's favicon
app.use(logger('dev')); // why format common & combined do not work?
app.use(cookieParser()); // parsing Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(bodyParser.urlencoded({ extended: false})); // return middleware that only parses urlencoded bodies
app.use(bodyParser.json()); // return middleware that only parses JSON
app.use(methodOverride('X-HTTP-Method-Override')); // lets use HTTP verbs such as PUT & DELETE in places where a client doesn't support it
app.use(session({ secret: 'userauth', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

//===================Routes======================================

app.use('/', routes);
app.use('/users', users);


//==================ERROR HANDLERS===============================
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//=================MODULE EXPORTS=================================

module.exports = app;