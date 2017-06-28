var BUTTONS = require('./dict/buttons');
var info = require('./dict/info');
var replies = require('./dict/replies')(BUTTONS);
var messages = require('./dict/messages');
var request = require('request');
var fs = require('fs');
var Type = require('./schema/type');

module.exports = function(bot) {

    var set_buttons = function(msg, gender) {
        return new Promise(function(resolve, reject) {
            Type.find({'gender': gender}).exec(function(err, types) {
                var prefix = (gender == info.male? info.male_collection_buttons_prefix: info.female_collection_buttons_prefix);
                for(var i = 0; i < types.length; i++) {
                    BUTTONS[prefix + i] = {
                        label: types[i].type_name,
                        command: "/" + gender + "_" + types[i].type_name
                    };
                    if(i == types.length - 1) {
                        console.log("THIS IS PART ONE:");
                        console.log("BUTTONS:");
                        console.log(BUTTONS);
                        resolve(msg, gender);
                    }
                }
                // resolve();
            });
        }).catch(function(e) {
            console.log("Something happened in set_buttons");
            console.log(e);
        });
    };

    var set_replies = function(msg, gender) {
        return new Promise(function(resolve, reject) {
            var male_types = [];
            var my_type = (gender == info.male? info.male_collection_buttons_prefix: info.female_collection_buttons_prefix);
            for(var key in BUTTONS) {
                if(BUTTONS.hasOwnProperty(key) && key.indexOf(my_type) != -1) {
                    male_types.push([BUTTONS[key].label]);
                }
            }
            console.log("THIS IS PART TWO");
            console.log("HERE IS THE LIST OF TYPES:");
            console.log(male_types);
            replies.male_collection = male_types;
            resolve(msg, male_types);
        });
    };

    var set_on_collection = function(msg, male_types) {
        return new Promise(function(resolve, reject) {
            console.log("REACHED THE END OF STACK");
            // bot.sendMessage(msg.from.id,
            //     "TEST", {replyMarkup: 'hide'
            //         /*bot.keyboard(male_types, {resize: true})*/});
            bot.sendMessage(msg.from.id,
                "TEST", {replyMarkup:
                    bot.keyboard([bot.button('text',{callback:'/text'})])
                });
        });
    };

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

        // getMaleCollection(msg);

        set_buttons(msg, 'male')
            .then(set_replies)
            .then(set_on_collection);



        // bot.getFile()
        // console.log(msg);
        // bot.sendMessage(msg.from.id,
        //     "TEST", {replyMarkup:
        //     bot.keyboard(replies.male_collection, {resize: true})});
    });



    // function getMaleCollection(msg) {
    //     return new Promise(function(resolve, reject) {
    //
    //
    //     }).then(function(res, rej) {
    //         res();
    //         console.log("THIS IS EXTRA PART");
    //     }).then(function() {
    //         console.log("THIS IS PART THREE");
    //     })
    // }

    bot.on(BUTTONS.female_collection.command, function(msg) {

    });

    bot.on(BUTTONS.accessory.command, function(msg, props) {
        var replyMarkup = bot.keyboard([
            [bot.button('contact', 'Your contact'), bot.button('location', 'Your location')],
            [bot.button('GoBackLabel', {callback: 'GoBackLabel'}), '/hide']
        ], {resize: true});

        var rep = [bot.inlineKeyboard([bot.inlineButton('text',{callback:'/text'})])];

        var repl = bot.inlineKeyboard([
            [
                bot.inlineButton('callback', {callback: 'this_is_data'}),
                bot.inlineButton('inline', {inline: 'some query'})
            ], [
                bot.inlineButton('url', {url: 'https://telegram.org'})
            ]
        ]);

        var but = {
            label: 'This',
            command: '/this'
        };

        bot.event(but.command, msg, props);

        return bot.sendMessage(msg.from.id, 'Button example.', {replyMarkup: replyMarkup});
    });



    bot.on('GoBackLabel', function(msg) {
        console.log("HI YOU IDIOT");
        return bot.sendMessage(msg.from.id,
            "HI", {replyMarkup: 'hide'});
    });

    bot.on('this_is_data', function(msg) {
        console.log("HI YOU IDIOT");
        return bot.sendMessage(msg.from.id,
            "HI", {replyMarkup: 'hide'});
    });

    bot.on('callbackQuery', function(msg) {
        // User message alert
        bot.sendMessage(msg.from.id,
            "Hi " + msg.data, {replyMarkup: 'hide'});
        return bot.answerCallbackQuery(msg.id, "Inline button callback: " + msg.data, true);
    });

    bot.on(BUTTONS.telegram_channel.command, function(msg) {
        return bot.sendMessage(msg.from.id,
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

