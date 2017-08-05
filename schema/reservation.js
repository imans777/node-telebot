var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var schema = new Schema({
    date: Date,
    user_id: Number,
    name: String,
    phone: String,
    is_seen: { type: Boolean, 'default': false },      //by_admin -> (not sure if it's needed whilst we have 'accepted')
    rejected: { type: Boolean, 'default': false },     //by_admin -> so he can't come!
    accepted: { type: Boolean, 'default': false },     //by_admin -> so he can come! (and when pressed on time reservation again, he is said to be done!)
});

// schema.virtual('year').get(function() {
//     return moment(this.date).year();
// });

module.exports = mongoose.model('Reservation', schema);