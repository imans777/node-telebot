var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    gender: String,
    type: String,
    picture: String,
    description: String
});

module.exports = mongoose.model('Product', schema);