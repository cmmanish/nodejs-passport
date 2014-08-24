var mongoose= require('mongoose');
//var Cricketer = require('./models/models_index.js')

mongoose.connect('mongodb://localhost/Cricketer');

var CricketerSchema = new mongoose.Schema({
	_id : String,
	country : String, // Country
	age : Number
});

module.exports = mongoose.model('Cricketer', CricketerSchema);