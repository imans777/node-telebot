var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    number: Number,
    gender: String,
    type: String,
    picture: String,
    description: String
});

module.exports = mongoose.model('Product', schema);