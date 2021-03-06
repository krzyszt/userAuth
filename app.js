//==================REQUIRE MODULES====================================

var express = require('express'),
    session = require('express-session'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    expresshbs = require('express-handlebars'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter'),
    FacebookStrategy = require('passport-facebook'),
    GoogleStartegy = require('passport-google'),
    LocalStrategy = require('passport-local');

//====================LOCAL MODULES=============================
var routes = require('./routes/index'),
    users = require('./routes/users');

//=====================CONFIGURATION============================
var config = require('./config/config')('development'),
    auth = require('./config/authenticate.js');

//====================EXPRESS APP===============================
var app = express();

//=======================MIDDLEWARE================================
app.use(favicon()); // finding of a URL of a web site's favicon
app.use(logger('dev')); // HTTP request logger middleware  ? why format "common" & "combined" do not work ?
app.use(cookieParser()); // parsing Cookie header and populate req.cookies with an object keyed by the cookie names
app.use(bodyParser.urlencoded({ extended: false})); // return middleware that only parses urlencoded bodies
app.use(bodyParser.json()); // return middleware that only parses JSON
app.use(methodOverride('X-HTTP-Method-Override')); // lets use HTTP verbs such as PUT & DELETE in places where a client doesn't support it
app.use(session({ secret: 'userauth', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());

// Session persisted message middleware
app.use(function(req,res,next){
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.notice;
    delete req.session.success;

    if (err) {
        res.locals.error = err;
    }

    if (msg) {
        res.locals.notice = msg;
    }

    if (success) {
        res.locals.success = success;
    }

    next();
});

//===========================VIEWS,LAYOUTS,ENGINE==================
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
// app.use(express.static(path.join(__dirname, 'public')));


// Configure express to use handlebars templates
var hbs = expresshbs.create({
    defaultLayout: 'main'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//===================PASSPORT=========================

passport.use('local-signup', new LocalStrategy(
    { 
        passReqToCallback: true,
        usernameField:  "email",
        passwordField: "password"
    },
    function(req, username, password, done){
        auth.localRegister(req, username, password);
            
    }
));

// passport.use('local-signin', new LocalStrategy(
//     { passReqToCallback: true},
//     function(req, username, password, done){
//         pass.localAuth(username, password);
//     }
// ));


//===================ROUTES======================================

//displays homepage
app.get('/', function(req, res){
  res.render('home', {user: req.user});
});

//displays signup page
app.get('/signin', function(req, res){
  res.render('signin');
});

// Requests with passport authentification
app.post('/local-reg', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signin'
}));

// app.post('/login', passport.authenticate('local-signin'),{
//     successRedirect: '/',
//     failureRedirect: '/signin'
// } );

app.get('/logout', function(req,res){
    var name = req.user.username;
    console.log('LOGIN OUT ' + req.user.username);
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully been loged out " + name + "!";
});


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