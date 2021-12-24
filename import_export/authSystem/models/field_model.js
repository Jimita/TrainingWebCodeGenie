var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    field:[]
});

module.exports = mongoose.model('fields', myschema);