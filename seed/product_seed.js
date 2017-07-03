var Product = require('../schema/product');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/telegramdb');


var products = [
    // new Product({
    //     number: 1,
    //     gender: 'male',
    //     type: 'فشن',
    //     picture: './image/1.png',
    //     description: 'توضیحات مربوط به عکس'
    // }),
    // new Product({
    //     number: 2,
    //     gender: 'male',
    //     type: 'فشن',
    //     picture: './image/2.png',
    //     description: 'توضیحات مربوط به عکس'
    // }),
    // new Product({
    //     number: 3,
    //     gender: 'male',
    //     type: 'فشن',
    //     picture: './image/2.png',
    //     description: 'توضیحات مربوط به عکس'
    // }),
    // new Product({
    //     number: 4,
    //     gender: 'male',
    //     type: 'فشن',
    //     picture: './image/1.png',
    //     description: 'توضیحات مربوط به عکس'
    // }),
    // new Product({
    //     number: 5,
    //     gender: 'male',
    //     type: 'فشن',
    //     picture: './image/2.png',
    //     description: 'توضیحات مربوط به عکس'
    // }),
    // //////////////////////////////////////////////////////////////////////
    // new Product({
    //     number: 1,
    //     gender: 'male',
    //     type: 'کلاسیک',
    //     picture: './image/1.png',
    //     description: 'توضیحات مربوط به عکس'
    // }),
    // new Product({
    //     number: 2,
    //     gender: 'male',
    //     type: 'کلاسیک',
    //     picture: './image/2.png',
    //     description: 'توضیحات مربوط به عکس'
    // }),
    // //////////////////////////////////////////////////////////////////////
    // new Product({
    //     number: 1,
    //     gender: 'male',
    //     type: 'مدل دار',
    //     picture: './image/1.png',
    //     description: 'توضیحات مربوط به عکس'
    // }),
    // //////////////////////////////////////////////////////////////////////
    // new Product({
    //     number: 1,
    //     gender: 'femele',
    //     type: 'زمستانه',
    //     picture: './image/1.png',
    //     description: 'توضیحات مربوط به عکس'
    // }),
    // new Product({
    //     number: 2,
    //     gender: 'femele',
    //     type: 'زمستانه',
    //     picture: './image/2.png',
    //     description: 'توضیحات مربوط به عکس'
    // })
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