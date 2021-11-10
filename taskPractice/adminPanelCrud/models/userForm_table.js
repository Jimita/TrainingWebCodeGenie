var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    fname: String,
    lname: String,
    address: String,
    gender: String,
    hobby: String,
    interestarea : String,
    image: String,
});

module.exports = mongoose.model('userForm', myschema);