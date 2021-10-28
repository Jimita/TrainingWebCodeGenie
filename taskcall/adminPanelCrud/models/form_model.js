var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    name: String,
    email: String,
    mobile: String,
    password : String,
    pancard : String,
    aadharcard :String,
    passportcard : String,
    gstnumber : String
});

module.exports = mongoose.model('form', myschema);