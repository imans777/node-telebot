var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    number: Number,
    gender: String,
    type: String,
    picture: String,
    description: String
});

schema.virtual('botdir').get(function() {
    return './public' + this.picture.substr(1, this.picture.length - 1);
});

module.exports = mongoose.model('Product', schema);