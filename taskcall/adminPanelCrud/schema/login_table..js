var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true 
    },  
    password: {
        type: String,
        required: true,
        trim: true 
    },  
},{
    timestamps: true
});

module.exports = mongoose.model('login', myschema);