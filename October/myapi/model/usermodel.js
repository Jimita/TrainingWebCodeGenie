//3.call mongoose  & add schema
var mongoose =require('mongoose');

var Schema =mongoose.Schema;
var myschema =new Schema({
    user_name:String,
    user_email:String,
});

module.exports=mongoose.model('user',myschema);