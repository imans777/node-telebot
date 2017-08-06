var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;
var info = require('../dict/info');

var schema = new Schema({
    date: Date,
    user_id: Number,
    name: String,
    phone: String,
    form_completed: { type: Boolean, 'default': false },      //by_admin -> (not sure if it's needed whilst we have 'accepted')
    rejected: { type: Boolean, 'default': false },     //by_admin -> so he can't come!
    accepted: { type: Boolean, 'default': false },     //by_admin -> so he can come! (and when pressed on time reservation again, he is said to be done!)
});

// schema.virtual('year').get(function() {
//     return moment(this.date).year();
// });

schema.virtual('hour').get(function() {
    var hour = Number(moment(this.date).format('k'));
    return (hour + String(":30 - ") + (hour + 1));
});

schema.virtual('day').get(function() {
    var day = moment(this.date).format('ddd');
    return info.days[day].label;
});

schema.virtual('short_date').get(function() {
    var date = moment(this.date).format('YYYY/M/D');
    return date;
});

module.exports = mongoose.model('Reservation', schema);