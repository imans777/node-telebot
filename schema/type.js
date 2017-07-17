var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    gender: String,
    type_name: String,
    priority: {type: Number, 'default': 1}
});

module.exports = mongoose.model('Type', schema);