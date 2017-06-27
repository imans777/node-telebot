var Product = require('../schema/product');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/telegramdb');


var products = [
    new Product({
        gender: 'male',
        type: 'فشن',
        picture: '.',
        description: 'توضیحات مربوط به عکس'
    }),
    new Product({
        gender: 'male',
        type: 'فشن',
        picture: '..',
        description: 'توضیحات مربوط به عکس'
    }),
    new Product({
        gender: 'male',
        type: 'کلاسیک',
        picture: '...',
        description: 'توضیحات مربوط به عکس'
    })
];


var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, res) {
        done++;
        if(done == products.length) {
            exit();
        }
    });
}

function exit()
{
    mongoose.disconnect();
}