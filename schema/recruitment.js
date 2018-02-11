var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    user_id: Number,
    phone: String,
    city: String,
    is_married: Boolean,
    wanting_salary: String,
    is_fulltime: Boolean,
    cv_pointer: String, //file_id saved in here, and is accessible through bot.getFile(cv_pointer)
    cv_extension: String, //file ext -> zip/rar
    form_completed: {
        type: Boolean,
        'default': false
    },
});

module.exports = mongoose.model('Recruitment', schema);