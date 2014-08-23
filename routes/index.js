var express = require('express');

exports.ensureAuthenticated = function(req, res, next){
	if (req.isAuthenticated()){
		next();
	}else {
		//res.redirect('/login')
		res.send(403)
		//res.status(403).end()
	}

}

exports.verifyUser = function(username, password, done){
	//pretend this is read database! 
	if (username == password){
		done(null,{id:username, name:username});
	} else {
		done(null, null);
	}
}

