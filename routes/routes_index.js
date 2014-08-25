var express = require('express');
var mongoose = require('mongoose');
var Cricketer = mongoose.model('Cricketer');

exports.ensureAuthenticated = function(req, res, next){
	if (req.isAuthenticated()){
		next();
	}else {
		res.send(403)
	}

}

exports.authenticateViaFacebook  = function(accessToken, refreshToken, profile, done) {
    // asynchronous
		process.nextTick(function() {

			// find the user in the database based on their facebook id
	        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

	        	// if there is an error, stop everything and return that
	        	// ie an error connecting to the database
	            if (err)
	                return done(err);

				// if the user is found, then log them in
	            if (user) {
	                return done(null, user); // user found, return that user
	            } else {
	                // if there is no user found with that facebook id, create them
	                var newUser            = new User();

					// set all of the facebook information in our user model
	                newUser.facebook.id    = profile.id; // set the users facebook id	                
	                newUser.facebook.token = token; // we will save the token that facebook provides to the user	                
	                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
	                newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

					// save our user to the database
	                newUser.save(function(err) {
	                    if (err)
	                        throw err;

	                    // if successful, return the new user
	                    return done(null, newUser);
	                });
	            }

	        });
        });
 }
exports.verifyUser = function(username, password, done){
	//pretend this is read database! 
	if (username == password){
		done(null,{id:username, name:username});
	} else {
		done(null, null);
	}
}

exports.getAll = function(req, res){
	Cricketer.find({}, function(err, all) {
        if (err) {
            res.json({'Error': 'Something went wrong'})
        } else {
            res.json({'Cricketers': all});
        }
    })
}

exports.addCricketer = function(req,res){
	new Cricketer ({
		_id: req.body.name,
		country: req.body.country,
		age: req.body.age
	
	}).save(function(error, doc){
		if (error) { res.json(error); 
			 res.send('/addCricketer'); 
		}
		else res.send('Succesfull inserted');
	});

}