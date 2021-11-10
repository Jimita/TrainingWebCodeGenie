var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    category_name: {
        type: String,
        required: true,
        trim: true 
    },  
},{
    timestamps: true
});

module.exports = mongoose.model('category', myschema);