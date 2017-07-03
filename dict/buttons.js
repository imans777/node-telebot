var Type = require('../schema/type');

var BUTTONS = {
    //------------------------------------ THIS IS JUST FOR TEST
    hello: {
        label: '👋 Hello',
        command: '/hello'
    },
    world: {
        label: '🌍 World Wide',
        command: '/world'
    },
    hide: {
        label: '⌨️ Hide keyboard',
        command: '/hide'
    },
    //------------------------------------ THIS IS THE INTRODUCTION
    became_member: {
        label: 'عضو شدم',
        command: '/became_member'
    },
    main_menu: {
        label: 'بازگشت به منو',
        command: '/main_menu'
    },
    //------------------------------------ THIS IS THE MAIN PART
    male_collection: {
        label: 'کلکسیون آقایان',
        command: '/male_collection'
    },
    femele_collection: {
        label: 'کلکسیون بانوان',
        command: '/femele_collection'
    },
    accessory: {
        label: 'Accessory',
        command: '/accessory'
    },
    telegram_channel: {
        label: 'کانال تلگرام',
        command: '/telegram_channel'
    },
    instagram_page: {
        label: 'صفحه اینستاگرام',
        command: '/instagram_page'
    },
    contact_us: {
        label: 'ارتباط با ما',
        command: '/contact_us'
    },
    time_reservation: {
        label: 'تعیین وقت',
        command: '/time_reservation'
    },


    //------------------------------------ THIS IS FOR PREVIOUS AND NEXTS
    previous: {
        label: 'm_قبلی',
        command: ''
    },
    next: {
        label: 'm_بعدی',
        command: ''
    },
    return_back: {
        label: 'بازگشت',
        command: ''
    },

    //------------------------------------ THIS IS FOR ACCESSORY
    accessory_ring: {
        label: 'انگشتر',
        command: '/accessory_ring'
    },

    accessory_hat: {
        label: 'کلاه',
        command: '/accessory_hat'
    },

};





// var foo, callback;
// async.function(function(response) {
//     foo = "bar"
//     if (exists){
//         foo = "foobar";
//     }
//
//     if( typeof callback == 'function' ){
//         callback(foo);
//     }
// });
//
// module.exports = function(cb){
//     if(typeof foo != 'undefined'){
//         cb(foo); // If foo is already define, I don't wait.
//     } else {
//         callback = cb;
//     }
// };
//
//
// // In main
// var fooMod = require('./foo.js');
// fooMod(function(foo){
//     //Here code using foo;
// });




module.exports = BUTTONS;





// const reply_default = bot.keyboard([])
// const reply_on_not_channel_member = bot.inlineKeyboard([
//     [
//         // First row with command callback button
//         bot.inlineButton('Command button', {callback: '/hello'})
//     ],
//     [
//         // Second row with regular command button
//         bot.inlineButton('Regular data button', {callback: 'hello'})
//     ]
// ]);