var express = require('express');
var mongoose = require('mongoose');
//var Cricketer = mongoose.model('Cricketer');
var User = mongoose.model('User');

exports.ensureAuthenticated = function(req, res, next){
	if (req.isAuthenticated()){
		next();
	}else {
		res.send(403)
	}

}

// route middleware to make sure a user is logged in
exports.isLoggedIn = function (req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}


exports.authenticateViaFacebook = function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {
        	
            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.facebook.token) {
                            user.facebook.token = token;
                            user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                            user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                            user.save(function(err) {
                                if (err)
                                    return done(err);
                                    
                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser            = new User();

                        newUser.facebook.id    = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

                        newUser.save(function(err) {
                            if (err)
                                return done(err);
                                
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session

                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                user.save(function(err) {
                    if (err)
                        return done(err);
                        
                    return done(null, user);
                });

            }
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

// exports.getAll = function(req, res){
// 	Cricketer.find({}, function(err, all) {
//         if (err) {
//             res.json({'Error': 'Something went wrong'})
//         } else {
//             res.json({'Cricketers': all});
//         }
//     })
// }

// exports.addCricketer = function(req,res){
// 	new Cricketer ({
// 		_id: req.body.name,
// 		country: req.body.country,
// 		age: req.body.age
	
// 	}).save(function(error, doc){
// 		if (error) { res.json(error); 
// 			 res.send('/addCricketer'); 
// 		}
// 		else res.send('Succesfull inserted');
// 	});

//}