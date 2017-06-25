

module.exports = function(B) {
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
        ]
    };

    return r;
};