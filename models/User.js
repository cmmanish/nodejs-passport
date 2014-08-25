var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/User');

var UserSchema = new mongoose.Schema({
	_id : String,
	username: String,
	password : String
});

module.exports = mongoose.model('User', UserSchema);