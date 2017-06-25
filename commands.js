var BUTTONS = require('./dict/buttons');
var info = require('./dict/info');
var replies = require('./dict/replies')(BUTTONS);
var messages = require('./dict/messages');

module.exports = function(bot) {

    bot.on('/start', function(msg) {
        bot.sendMessage(msg.from.id,
            messages.normal.greetings).then(function() {
            bot.sendMessage(msg.from.id,
                decodeURI(messages.encoded.be_member_of_channel), {replyMarkup:
                bot.keyboard(replies.entrance, {resize: true})});
        });
    });

    bot.on(BUTTONS.became_member.command, function(msg) {
        // msg.reply.text(msg.text);
        // console.log("HE SENT: " + msg.text);
        bot.getChatMember(info.my_channel_id, msg.from.id).then(function(member) {
            if(member.result.status == 'left') { //on not being a member of channel
                console.log("Not Member");
                bot.sendMessage(msg.from.id,
                    decodeURI(messages.encoded.not_member_of_channel), {replyMarkup:
                    bot.keyboard(replies.entrance, {resize: true})});
            } else {
                console.log("Success");
                bot.sendMessage(msg.from.id,
                    messages.normal.normal_use, {replyMarkup:
                    bot.keyboard(replies.main_menu, {resize: true})});

            }
            // console.log(q);
        }).catch(function(member) {
            console.log("Failure");
            error_occurred(msg.from.id);
        })
    });

    bot.on(BUTTONS.male_collection.command, function(msg) {

    });

    bot.on(BUTTONS.female_collection.command, function(msg) {

    });

    bot.on(BUTTONS.accessory.command, function(msg) {

    });

    bot.on(BUTTONS.telegram_channel.command, function(msg) {
        bot.sendMessage(msg.from.id,
            decodeURI(messages.encoded.telegram_channel_item));
    });

    bot.on(BUTTONS.instagram_page.command, function(msg) {
        bot.sendMessage(msg.from.id,
            decodeURI(messages.encoded.instagram_page_item));
    });

    bot.on(BUTTONS.contact_us.command, function(msg) {

    });

    bot.on(BUTTONS.time_reservation.command, function(msg) {

    });

    bot.on('/hide', function(msg) {
        bot.sendMessage(msg.from.id, "OK", {replyMarkup: 'hide'});
    });

    function error_occurred(id) {
        bot.sendMessage(id, messages.normal.error_occurred, {replyMarkup: 'hide'});
    }
};
