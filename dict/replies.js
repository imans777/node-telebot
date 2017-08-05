// var mongoose = require('mongoose');
var Type = require('../schema/type');
var info = require('./info');

module.exports = function(B) {
    var male_types = [], femele_types = [];
    // Type.find({'gender' : 'male'}).exec(function(err, types) {
    //
    // });
    // B.forEach(function(element, index) {
    //
    //     male_types.push([element.label]);
    // });
    // for(key in B) {
    //     if(B.hasOwnProperty(key) && key.indexOf("male_type") != -1) {
    //         male_types.push([B[key].label]);
    //     }
    // }

    // console.log("HERE IS THE LIST OF TYPES:");
    // console.log(male_types);

    var r = {
        test_reply: [
            [B.hello.label, B.world.label],
            [B.hide.label]
        ],
        empty: [

        ],
        entrance: [
            [B.became_member.label]
        ],
        main_menu: [
            [B.contact_us.label],
            [/*B.time_reservation.label*/info.time_reservation],
            [B.femele_collection.label, B.male_collection.label],
            [B.baby_collection.label, B.spouse_collection.label],
            [B.jewelry_collection.label, B.narriage_collection.label],
            [B.accessory_collection.label, B.kafsh_collection.label],
            [B.telegram_channel.label, B.instagram_page.label]
        ],
        instagram_page: [
            [B.instagram_2.label, B.instagram_1.label],
            [B.instagram_4.label, B.instagram_3.label],
            [B.instagram_6.label, B.instagram_5.label],
            [B.instagram_8.label, B.instagram_7.label],
            [B.instagram_10.label, B.instagram_9.label],
            [B.main_menu.label]
        ],
        male_collection: male_types,
        femele_collection: [

        ],
        current_type: [],

        accessory: [
            [B.accessory_ring.label, B.accessory_hat.label],
            [B.main_menu.label]
        ],

        admin: {
            main_menu: [
                [B.admin.add_type.label, B.admin.add_product.label],
                // [B.admin.add_hat.label, B.admin.add_ring.label],
                [B.admin.check_answers.label]
            ]
        }
    };

    return r;
};