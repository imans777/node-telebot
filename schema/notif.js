var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    message: String
});

module.exports = mongoose.model('Notif', schema);