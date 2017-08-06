var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    date: { type: Date, 'default': Date.now },
    user_id: Number,
    first_name: String,
    last_name: String,
    username: String
});

module.exports = mongoose.model('Customer', schema);