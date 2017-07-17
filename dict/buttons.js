var Type = require('../schema/type');
var info = require('./info');

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
    //------------------------------------ THIS IS THE MAIN MENU PART
    male_collection: {
        label: 'کالکشن آقایان',
        command: '/male_collection'
    },
    femele_collection: {
        label: 'کالکشن بانوان',
        command: '/femele_collection'
    },
    spouse_collection: {
        label: 'کالکشن همسران',
        command: '/spouse_collection'
    },
    baby_collection: {
        label: 'کالکشن کودکان',
        command: '/baby_collection'
    },
    narriage_collection: {
        label: 'کالکشن عروسی',
        command: '/narriage_collection'
    },
    jewelry_collection: {
        label: 'کالکشن جواهرات',
        command: '/jewelry_collection'
    },
    kafsh_collection: {
        label: 'کالکشن کفش',
        command: '/kafsh_collection'
    },
    accessory_collection: {
        label: 'کالکشن اکسسوری',
        command: 'accessory_collection'
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
        label: 'تعیین وقت شوروم',
        command: '/time_reservation'
    },

    //------------------------------------ THIS IS FOR INSTAGRAM PAGES
    instagram_1: {
        label: 'پیج اصلی کمرون زیگزال (محصولات جدید)',
        command: '/instagram_1'
    },
    instagram_2: {
        label: 'پیج دوم مجموعه (محصولات گذشته)',
        command: '/instagram_2'
    },
    instagram_3: {
        label: 'پیج فروش آنلاین (قیمت محصولات)',
        command: '/instagram_3'
    },
    instagram_4: {
        label: 'پیج بانوان',
        command: '/instagram_4'
    },
    instagram_5: {
        label: 'پیج کودکان',
        command: '/instagram_5'
    },
    instagram_6: {
        label: 'پیج جواهرات',
        command: '/instagram_6'
    },
    instagram_7: {
        label: 'پیج اکسسوری',
        command: '/instagram_7'
    },
    instagram_8: {
        label: 'پیج کفشها',
        command: '/instagram_8'
    },
    instagram_9: {
        label: 'پیج ویدیوها',
        command: '/instagram_9'
    },
    instagram_10: {
        label: 'پیج مدیریت',
        command: '/instagram_10'
    },

    //------------------------------------ THIS IS FOR PREVIOUS AND NEXTs
    previous: {
        label: 'm_قبلی',
        command: '/main_menu'
    },
    next: {
        label: 'm_بعدی',
        command: '/main_menu'
    },
    return_back: {
        label: 'بازگشت',
        command: '/main_menu'
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

    //------------------------------------ THIS IS FOR ACCESSORY
    admin: {
        add_type: {
            label: 'افزودن دسته',
            command: '/add_type'
        },
        add_product: {
            label: 'افزودن محصول',
            command: '/add_product'
        },
        // add_hat: {
        //     label: 'افزودن کلاه',
        //     command: '/add_hat'
        // },
        add_ring: {
            label: 'افزودن انگشتر',
            command: '/add_ring'
        },
        check_answers: {
            label: 'بررسی پاسخها',
            command: '/check_answers'
        },
        male: {
            label: 'کالکشن آقایان',
            command: '/male'
        },
        femele: {
            label: 'کالکشن زنانه',
            command: '/femele'
        },
        spouse: {
            label: 'کالکشن همسران',
            command: '/spouse'
        },
        baby: {
            label: 'کالکشن کودکان',
            command: '/baby'
        },
        narriage: {
            label: 'کالکشن عروسی',
            command: '/narriage'
        },
        jewelry: {
            label: 'کالکشن جواهرات',
            command: '/jewelry'
        },
        kafsh: {
            label: 'کالکشن کفش',
            command: '/kafsh'
        },
        accessory: {
            label: 'کالکشن اکسسوری',
            command: '/accessory'
        },
        return_to_main_menu: {
            label: 'بازگشت به منوی اصلی',
            command: '/main_menu'
        },
    }
};

BUTTONS[info.male_collection_buttons_prefix + 'back'] = BUTTONS[info.femele_collection_buttons_prefix + 'back'] =
    BUTTONS[info.spouse_collection_buttons_prefix + 'back'] = BUTTONS[info.baby_collection_buttons_prefix + 'back'] =
    BUTTONS[info.narriage_collection_buttons_prefix + 'back'] = BUTTONS[info.jewelry_collection_buttons_prefix + 'back'] =
    BUTTONS[info.kafsh_collection_buttons_prefix + 'back'] = BUTTONS[info.accessory_collection_buttons_prefix + 'back'] =
    {
    label: info.return_to_main_menu,
    command: '/main_menu'
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