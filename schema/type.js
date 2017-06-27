var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    gender: String,
    type_name: String
});

module.exports = mongoose.model('Type', schema);