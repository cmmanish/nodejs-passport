var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-Session');
// load up the user model
var User   = require('./models/User');
var port = process.env.PORT || 9999 ;
var findOrCreate = require('mongoose-findorcreate')

var passport = require('passport');
var passportLocal = require('passport-local');
var passportHttp = require('passport-http');
var FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = '1456175224657908';
var FACEBOOK_APP_SECRET = '5a70300410e9662122413ae52a30c488';

// by default, brings in routes/index.js
//var models = require('./models/Cricketer.js');
var routes = require('./routes/routes_index.js');

var app = new express();
app.set('view engine', 'ejs'); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({ 
	secret: process.env.SESSION_SECRET || 'secret',
	resave: false,
	saveUninitialized: false
})); 

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(routes.verifyUser));

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:9999/auth/facebook/callback',
    passReqToCallback : true
  },routes.authenticateViaFacebook));

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	done(null, { id:id, name:id });
});

//routes
app.get('/', function(req, res){
	res.render('index', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

app.get('/login', function(req, res){
		res.render('login')
});

app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
});

//facebook routes

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: 'read_stream' })
);

// app.get('/get/allCricketers', routes.getAll);

// app.get('/addCricketer', function(req, res){
// 	res.render('addCricketer');
// });

// route for showing the profile page
	app.get('/profile', routes.isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

app.get('/api/data', routes.ensureAuthenticated, function(req,res){
	res.json([
		{name: 'Sachin'},
		{name: 'Rahul'},
		{name: 'Laxman'}
	]);
});

//// all the posts are here
app.post('/login', passport.authenticate('local'), function(req,res){
	res.redirect('/');
});

// app.post('/addCricketer', routes.addCricketer); // add a new Cricketer

//setting port and listening
app.listen(port, function(req,res){
	console.log('http://127.0.0.1:'+ port + '/');
});