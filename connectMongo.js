var express = require('express');
app = express();
var MongoClient = require('mongodb').MongoClient;
var mongoose= require('mongoose');
var myCollection;

var connURL = "mongodb://localhost/Cricketer"; 
var db =    MongoClient.connect(connURL,
        	function(err,db){

            if(err)
                console.log("Error creating new connection "+err);
            else
            {
                console.log("created new connection");
                myCollection = db.collection('test_collection');

            }
        });

app.get('/users', function(req, res){
	Cricketer.find({}, function(err, all) {
        if (err) {
            res.json({'Error': 'Something went wrong'})
        } else {
            res.json({'users': all});
        }
    })
});



var port = process.env.PORT || 2222 ;
app.listen(port, function(req,res){
	console.log('http://127.0.0.1:'+ port + '/');
});

var UserSchema = new mongoose.Schema({
	_id : String,
	username: String,
	password : String
});

var Cricketer = mongoose.model('Cricketer', UserSchema);

