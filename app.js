var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-Session');

var passport = require('passport');
var passportLocal = require('passport-local');
var passportHttp = require('passport-http');

// by default, brings in routes/index.js

var routes = require('./routes/index')

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

app.post('/login', passport.authenticate('local'), function(req,res){
	res.redirect('/')
});

app.get('/api/data', routes.ensureAuthenticated, function(req,res){
	res.json([
		{value: 'Sachin'},
		{value: 'Rahul'},
		{value: 'Laxman'}
	]);
});



//setting port and listening
var port = process.env.PORT || 8888 ;
app.listen(port, function(req,res){
	console.log('http://127.0.0.1:'+ port + '/');
});






