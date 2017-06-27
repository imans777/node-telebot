// var mongoose = require('mongoose');
var Type = require('../schema/type');

module.exports = function(B) {
    var male_types = [], female_types = [];
    // Type.find({'gender' : 'male'}).exec(function(err, types) {
    //
    // });
    // B.forEach(function(element, index) {
    //
    //     male_types.push([element.label]);
    // });
    for(key in B) {
        if(B.hasOwnProperty(key) && key.indexOf("male_type") != -1) {
            male_types.push([B[key].label]);
        }
    }

    console.log("HERE IS THE LIST OF TYPES:");
    console.log(male_types);

    var r = {
        test_reply: [
            [B.hello.label, B.world.label],
            [B.hide.label]
        ],
        entrance: [
            [B.became_member.label]
        ],
        main_menu: [
            [B.male_collection.label, B.female_collection.label],
            [B.accessory.label],
            [B.telegram_channel.label, B.instagram_page.label],
            [B.contact_us.label, B.time_reservation.label]
        ],
        male_collection: male_types,
        female_collection: [

        ]
    };

    return r;
};