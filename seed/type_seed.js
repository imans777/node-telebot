var Type = require('../schema/type');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/telegramdb');


var types = [
    new Type({
        gender: 'male',
        type_name: 'فشن'
    }),
    new Type({
        gender: 'male',
        type_name: 'کلاسیک'
    }),
    new Type({
        gender: 'male',
        type_name: 'مدل دار'
    }),
    new Type({
        gender: 'female',
        type_name: 'تابستانه'
    })
];


var done = 0;
for (var i = 0; i < types.length; i++) {
    types[i].save(function(err, res) {
        done++;
        if(done == types.length) {
            exit();
        }
    });
}

function exit()
{
    mongoose.disconnect();
}