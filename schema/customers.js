var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    date: { type: Date, 'default': Date.now },
    user_id: { type: Number, unique: true },
    first_name: String,
    last_name: String,
    username: String,
    is_joined: Boolean,
    previous: String,
    next: String,
    return_back: String
});

module.exports = mongoose.model('Customer', schema);