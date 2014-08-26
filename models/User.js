var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/Cricketer');

// define the schema for our user model
var UserSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

module.exports = mongoose.model('User', UserSchema);

