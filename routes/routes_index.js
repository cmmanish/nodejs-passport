var express = require('express');
var mongoose = require('mongoose');
var Cricketer = mongoose.model('Cricketer');

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

exports.getAll = function(req, res){
	Cricketer.find({}, function(err, all) {
        if (err) {
            res.json({'Error': 'Something went wrong'})
        } else {
            res.json({'cricketers': all});
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